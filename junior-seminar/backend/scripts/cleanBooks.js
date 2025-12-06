const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const books = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cleaned_books.json')));
(async () => {
    for (const book of books) {
        await prisma.recBook.upsert({
            where: { googleId: book.id },
            update: {
                title: book.title,
                description: book.description,
                authors: book.authors,
                categories: book.categories,
                averageRating: book.averageRating,
                maturityRating: book.maturityRating,
                pageCount: book.pageCount,
                categoryVector: book.categoryVector || null,
            },
            create: {
                googleId: book.id,
                title: book.title,
                description: book.description,
                authors: book.authors,
                categories: book.categories,
                averageRating: book.averageRating,
                maturityRating: book.maturityRating,
                pageCount: book.pageCount,
                categoryVector: book.categoryVector || null,
            },
        });
    }
    await prisma.$disconnect();
})();
