const express = require("express");
const router = express.Router();
const redisClient = require("../utils/redisClient");
router.get("/home-sections", async (req, res) => {
    const cacheKey = "home-sections";
    const ApiKey = process.env.VITE_API_KEY;
    const genres = ["fiction", "poetry", "fantasy", "romance"];
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const result = {};
        for (const genre of genres) {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&orderBy=newest&maxResults=10&key=${ApiKey}`
            );
            const data = await response.json();
            if (data.items) {
                result[genre] = data.items;
            } else {
                result[genre] = [];
            }
        }
        await redisClient.setEx(cacheKey, 21600, JSON.stringify(result))
        res.json(result);
    } catch (err) {
        console.error("Error fetching genre books:", err);
        res.status(500).json({ error: "Failed to fetch genre books" });
    }
});

// get popular books
router.get("/popular", async (req, res) => {
    const cacheKey = "popular";
    const ApiKey = process.env.VITE_API_KEY
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const subjects = ['manga', 'african', 'mystery',
            'science fiction', 'thriller', 'horror',
            'biography', 'history', 'self help', 'cooking',
            'spiritual',
            'children', 'comics',
            'graphic novels',];
        const allBooks = [];

        for (const subject of subjects) {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${subject}&orderBy=newest&maxResults=5&key=${ApiKey}`);
            const data = await response.json();
            if (data.items) {
                allBooks.push(...data.items);
            }
        }
        const uniqueBooksMap = new Map();
        for (const book of allBooks) {
            if (book.volumeInfo.imageLinks?.thumbnail) {
                uniqueBooksMap.set(book.id, book);
            }
        }
        const uniqueBooks = Array.from(uniqueBooksMap.values());
        await redisClient.setEx(cacheKey, 21600, JSON.stringify(uniqueBooks))
        res.json(uniqueBooks)
    } catch (err) {
        console.error("Error fetching books: ", err)
        res.status(500).json({ error: "Error fetching books" })
    }

}
)

//get searched books
router.get("/search", async (req, res) => {
    const { q } = req.query
    const ApiKey = process.env.VITE_API_KEY
    const query = q || "bestsellers"
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30&key=${ApiKey}`)
        const data = await response.json()
        res.json(data.items)
    } catch (err) {
        console.error("Error fetching books: ", err)
        res.status(500).json({ error: "Error fetching books" })
    }
})

router.get("/book-ratings/:googleId", async (req, res) => {
    const { googleId } = req.params;
    const cacheKey = `bookRatings:${googleId}`;
    const ApiKey = process.env.VITE_API_KEY;
    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleId}?key=${ApiKey}`);
        const data = await response.json();
        const ratingsData = {
            averageRating: data.volumeInfo?.averageRating || null,
            ratingsCount: data.volumeInfo?.ratingsCount || null,
        };
        await redisClient.setEx(cacheKey, 86400, JSON.stringify(ratingsData));
        res.json(ratingsData);
    } catch (err) {
        console.error("Error fetching book ratings:", err);
        res.status(500).json({ error: "Failed to fetch book ratings" });
    }
});

module.exports = router
