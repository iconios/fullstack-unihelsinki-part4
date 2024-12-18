const { test, describe, after, before } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const blogs = require('../utils/test_helper').blogs
const Blog = require('../models/blog')

before(async () => {
    await Blog.deleteMany({})
    logger.info('All documents deleted')

    const blog1 = new Blog(blogs[0])
    await blog1.save()
    logger.info('1st blog saved')

    const blog2 = new Blog(blogs[1])
    await blog2.save()
    logger.info('2nd blog saved')
})

describe('Verify user with invalid token or user ID cannot post blog', () => {
    test('Test that unauthorized user cant post', async () => {
        const blogsAtStart = await api.get('/api/blogs/')
        logger.info('Blogs length at start', blogsAtStart.body.length)

        await api.post('/api/blogs/')
            .send(blogs[2])
            .expect(401)
            .expect("content-type", /application\/json/)
        
        const blogsAtEnd = await api.get('/api/blogs/')
        logger.info('Blogs length at end', blogsAtEnd.body.length)

        assert.strictEqual(blogsAtStart.body.length, blogsAtEnd.body.length)
    })
})


after(async () => {
    mongoose.connection.close()
})