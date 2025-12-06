const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { getSimilarity } = require("../utils/similarityUtils");
const { getCategories, addVectorsToBooks } = require("../utils/categoryUtils.js");
const prisma = new PrismaClient();
router.get('/recs', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user ID in session" });
    }
    try {
        const userWithBooks = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookshelves: {
                    include: {
                        books: {
                            include: { reviews: true }
                        }
                    }
                }
            }
        });
        if (!userWithBooks || !userWithBooks.bookshelves?.length) {
            return res.status(200).json([]);
        }
        const userBooks = userWithBooks.bookshelves.flatMap(bs => bs.books);
        if (userBooks.length === 0) {
            return res.status(200).json([]);
        }
        const normalizedBooks = userBooks.map(book => {
            const userReview = book.reviews.find(r => r.userId === userId);
            const shelf = userWithBooks.bookshelves.find(bs =>
                bs.books.some(b => b.id === book.id)
            );
            const shelfName = shelf?.name?.toLowerCase() || '';
            let inferredRating = userReview?.rating;
            if (inferredRating == null) {
                if (shelfName.includes('read')) {
                    inferredRating = 3.5;
                } else if (shelfName.includes('currently')) {
                    inferredRating = 3.0;
                } else if (shelfName.includes('want')) {
                    inferredRating = 2.5;
                } else {
                    inferredRating = 2.0;
                }
            }
            return {
                ...book,
                categories: book.categories || book.genres || [],
                rating: inferredRating,
            };
        });

        const categoryList = getCategories(normalizedBooks);
        const enrichedUserBooks = addVectorsToBooks(normalizedBooks, categoryList);
        const highlyRated = enrichedUserBooks.filter(b => (b.rating ?? 0) >= 3);
        const baseBooks = highlyRated.length > 0
            ? highlyRated.sort((a, b) => b.rating - a.rating).slice(0, 5) // limit to top 5 if needed
            : enrichedUserBooks;
        const userBookGoogleIds = enrichedUserBooks.map(b => b.googleId).filter(Boolean);
        const userCategories = [
            ...new Set(enrichedUserBooks.flatMap(b => b.categories.map(c => c.toLowerCase())))
        ];
        const recBooks = await prisma.recBook.findMany({
            where: {
                googleId: {
                    notIn: userBookGoogleIds
                },
                categories: {
                    hasSome: userCategories
                }
            }
        });

        let recs = [];
        baseBooks.forEach(userBook => {
            recBooks.forEach(otherBook => {
                const similarity = getSimilarity(userBook, otherBook) * (userBook.rating / 5);
                recs.push({ book: otherBook, similarity });
            });
        });
        const deduped = new Map();
        recs.forEach(({ book, similarity }) => {
            if (!deduped.has(book.googleId) || deduped.get(book.googleId).similarity < similarity) {
                deduped.set(book.googleId, { book, similarity });
            }
        });
        const top = Array.from(deduped.values())
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10)
            .map(entry => entry.book);

        res.status(200).json(top);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" }, err);
    }
});
module.exports = router;
