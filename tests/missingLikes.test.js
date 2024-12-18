const { test, describe, after, before } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const blogs = require('../utils/test_helper').blogs
const Blog =require('../models/blog')

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


describe('Verify if Likes property is missing', () => {
    test('Test if the Likes is missing', async () => {
        const blogsAtStart = (await api.get('/api/blogs')).body.length
        logger.info('Response data for http GET at start', blogsAtStart)

        await api.post('/api/blogs')
            .send(blogs[5])
            .expect(201)
            .expect('content-type', /application\/json/)

        const blogsAtEnd = (await api.get('/api/blogs')).body.length
        logger.info('Response data for http GET at end', blogsAtEnd)

        assert.strictEqual(blogsAtStart, blogsAtEnd-1)        
    })
})





after(async () => {
    mongoose.connection.close()
})