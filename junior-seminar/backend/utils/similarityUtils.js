function dotProduct(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0)
}

function magnitude(v) {
    return Math.sqrt(dotProduct(v, v))
}

function cosineSimilarity(a, b) {
    const dot = dotProduct(a, b)
    const magA = magnitude(a)
    const magB = magnitude(b)
    if (magA == 0 || magB == 0) return 0;
    return dot / (magA * magB)
}
function jaccardSimilarity(setA, setB) {
    const intersection = setA.filter(element => setB.includes(element)).length;
    const union = new Set([...setA, ...setB]);
    if (union.size === 0) return 0;
    return intersection / union.size;
}
function getAuthorSimilarity(bookA, bookB) {
    if (!bookA.authors || !bookB.authors) return 0;
    const authorsA = Array.isArray(bookA.authors) ? bookA.authors : [bookA.authors];
    const authorsB = Array.isArray(bookB.authors) ? bookB.authors : [bookB.authors];
    return jaccardSimilarity(authorsA, authorsB);
}

function normalizeRating(rating, min = 1, max = 5) {
    if (!rating || isNaN(rating)) return 0;
    return (rating - min) / (max - min);
}

function getSimilarity(bookA, bookB) {
    const categorySimilarity = cosineSimilarity(bookA.categoryVector, bookB.categoryVector);
    const authorSimilarity = getAuthorSimilarity(bookA, bookB);
    const ratingSimilarity = normalizeRating(bookB.averageRating)
    return (
        categorySimilarity * 0.6 +
        authorSimilarity * 0.2 +
        ratingSimilarity * 0.2
    )
}

module.exports = {
    getSimilarity
}
