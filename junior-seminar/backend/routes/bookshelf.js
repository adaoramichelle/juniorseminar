const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();


router.get("/shelves", async (req, res) => {
    const shelfEnum = ["WanttoRead", "CurrentlyReading", "Read"]
    res.json(shelfEnum)

}
)

// GET ALL BOOKS
router.get("/bookshelf", async (req, res) => {
    const userId = req.session.userId;
    const bookshelf = await prisma.bookshelf.findMany({
        where: { userId: userId },
        include: { books: true }
    });
    res.json(bookshelf);

})

//ADD TO BOOKSHELF
router.post("/bookshelf/add", async (req, res) => {
    const userId = req.session.userId;
    const { bookshelfId, description, title, authors, cover, googleId, genres } = req.body;
    const bookshelf = await prisma.bookshelf.findFirst({
        where: { userId: userId, name: bookshelfId, }
    })

    if (!bookshelf) {
        return res.status(403).json({ error: "Unauthorized Access" })
    }
    const newBook = await prisma.book.upsert({
        where: { googleId: String(googleId) },
        update: {
            bookshelfId: bookshelf.id
        }, create: {
            title, authors, cover, description, googleId: String(googleId), genres: Array.isArray(genres) ? genres : [],
            bookshelf: {
                connect: { id: bookshelf.id }

            }
        }
    })
    res.status(201).json(newBook);
})

// GET BOOKS IN BOOKSHELF
router.get("/user-bookshelves", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: "Not Logged In" })
    }
    try {
        const bookshelves = await prisma.bookshelf.findMany({
            where: { userId },
            include: {
                books: {
                    include: {
                        reviews: {
                            where: {
                                userId: userId
                            }
                        }
                    }
                }
            }
        })
        const groupedBooks = {}
        for (const shelf of bookshelves) {
            groupedBooks[shelf.name] = shelf.books
        }
        res.json(groupedBooks)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error fetching bookshelves" })
    }
})


module.exports = router
