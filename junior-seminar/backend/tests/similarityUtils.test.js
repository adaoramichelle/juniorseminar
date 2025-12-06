import { describe, it, expect } from 'vitest'
import { getAuthorSimilarity } from '../utils/similarityUtils.js'

describe('getAuthorSimilarity', () => {
    const tests = [
        {
            bookA: { authors: ['Alice', 'Bob'] },
            bookB: { authors: ['Alice', 'Bob'] },
            expected: 1,
            description: 'Exact same authors',
        },
        {
            bookA: { authors: ['Alice', 'Bob'] },
            bookB: { authors: ['Bob', 'Charlie'] },
            expected: 1 / 3,
            description: 'One author in common, three total',
        },
        {
            bookA: { authors: ['Alice'] },
            bookB: { authors: ['Alice', 'Bob'] },
            expected: 1 / 2,
            description: 'One author vs two authors, one in common',
        },
        {
            bookA: { authors: ['Alice'] },
            bookB: { authors: ['Charlie'] },
            expected: 0,
            description: 'No authors in common',
        },
        {
            bookA: { authors: [] },
            bookB: { authors: [] },
            expected: 0,
            description: 'Both have empty authors',
        },
        {
            bookA: { authors: 'Alice' },
            bookB: { authors: ['Alice'] },
            expected: 1,
            description: 'One author string vs array with same author',
        },
    ]

    tests.forEach(({ bookA, bookB, expected, description }) => {
        it(description, () => {
            const result = getAuthorSimilarity(bookA, bookB)
            expect(result).toBeCloseTo(expected, 6)
        })
    })
})
