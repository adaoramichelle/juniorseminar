const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

router.post('/reflection', async (req, res) => {
    const userId = req.session.userId;
    const { googleId, content, title, authors, cover, description } = req.body;
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        let book = await prisma.book.findUnique({
            where: { googleId: String(googleId) }
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
                    googleId: String(googleId),
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
        const reflection = await prisma.reflection.upsert({
            where: {
                userId_googleId: {
                    userId: userId,
                    googleId: String(googleId)
                },
            },
            update: {
                content,
            },
            create: {
                userId: userId,
                googleId: String(googleId),
                content: content,
            },
        });
        res.json(reflection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});
router.get('/reflection/:googleId', async (req, res) => {
    const userId = req.session.userId;
    const googleId = req.params.googleId
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        const reflection = await prisma.reflection.findUnique({
            where: {
                userId_googleId: { userId, googleId }
            }
        })
        res.json(reflection);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong." });
    }
})
module.exports = router;
