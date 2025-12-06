const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function fetchCategories(title, author) {
    try {
        const query = `intitle:"${title}" inauthor:"${author}"`;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        const items = response.data.items;
        if (!items || items.length === 0) return [];

        for (const item of items) {
            // Instead of categories
            const genres = item.volumeInfo.categories;
            if (genres && genres.length > 0) {
                return genres; // these are your "genres"
            }

        }
        return [];
    } catch (error) {
        console.error(`Error fetching categories for "${title}":`, error.message);
        return [];
    }
}

async function main() {
    const books = await prisma.book.findMany();

    for (const book of books) {
        if (book.genres && book.genres.length > 0) {
            console.log(`Skipping "${book.title}" — already has genres`);
            continue;
        }

        console.log(`Fetching categories for "${book.title}" by ${book.author}...`);
        const genres = await fetchCategories(book.title, book.author);

        if (genres.length > 0) {
            await prisma.book.update({
                where: { googleId: book.googleId },
                data: { genres },
            });
            console.log(`Updated "${book.title}" with categories: ${genres.join(', ')}`);
        } else {
            console.log(`No categories found for "${book.title}"`);
        }

        // Optional: Delay requests to avoid hitting Google API rate limits
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
    }
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
