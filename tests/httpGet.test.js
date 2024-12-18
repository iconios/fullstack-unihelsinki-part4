const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const logger = require('../utils/logger')
const mongoose = require('mongoose')

describe('Verify correct amount of blog posts return', () => {
    test('Test for correct amount of posts return', async () => {
        await api.get('/api/blogs')
        .expect(200)
        .expect('content-type', /application\/json/)

        const response = await api.get('/api/blogs')
        const numBlogs = response.body.length
        logger.info('Number of blogs received ', numBlogs)

        const authors = response.body.map(blog => blog.author)

        assert.strictEqual(numBlogs, 5)
        assert(authors.includes('Muyiwa Ikotun'))
    })
})

after(async () => {
    mongoose.connection.close()
})

