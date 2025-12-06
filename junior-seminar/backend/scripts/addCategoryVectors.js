const fs = require('fs');
const path = require('path');
const { getCategories, createCategoryVector, addVectorsToBooks } = require('../utils/categoryUtils.js');
const books = require('../data/cleaned_books.json');
const categoryList = getCategories(books);
const bookswithVectors = addVectorsToBooks(books, categoryList);
fs.writeFileSync(
    path.join('data', 'cleaned_books.json'),
    JSON.stringify(bookswithVectors, null, 2),
)
