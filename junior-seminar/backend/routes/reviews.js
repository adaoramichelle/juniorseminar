const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

//get all reviews
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: true
            }
        })
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

//add reviews
router.post('/review', async (req, res) => {
    const userId = req.session.userId;
    const { googleId, content, title, authors, cover, description, rating } = req.body;
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        let book = await prisma.book.findUnique({
            where: { googleId }
        })
        const shelf = await prisma.bookshelf.findFirst({
            where: {
                userId,
                name: "Read"
            }
        })
        if (!book) {
            book = await prisma.book.create({
                data: {
                    googleId,
                    title,
                    authors,
                    cover,
                    description,
                    bookshelf: {
                        connect: { id: shelf.id }
                    }
                }
            })
        }
        const review = await prisma.review.create({
            data: {
                userId: userId,
                googleId: googleId,
                content: content,
                rating: Number(rating)
            }
        })
        res.json(review)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

//edit reviews
router.patch('/review/:googleId', async (req, res) => {
    const { content, rating } = req.body;
    const userId = req.session.userId;
    const googleId = req.params.googleId
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        const updated = await prisma.review.update({
            where: {
                userId_googleId: {
                    userId,
                    googleId
                }
            },
            data: {
                content,
                rating: Number(rating)
            }
        })
        res.json(updated)

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})
module.exports = router
