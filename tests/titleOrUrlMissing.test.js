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

describe('Verify if title or url is missing', () => {
    test('Test if title or url of blog is missing', async () => {
        const blog = {
            "author":"David Oyedepo"
        }  
        
        const blogsAtStart = (await api.get('/api/blogs')).body.length
        logger.info('Blogs length at start', blogsAtStart)
        
        await api.post('/api/blogs')
            .send(blog)
            .expect(400)

        
        const blogsAtEnd = (await api.get('/api/blogs')).body.length
        logger.info('Blogs length at end', blogsAtEnd)

        assert.strictEqual(blogsAtStart, blogsAtEnd)
    })
})


after(async () => {
    mongoose.connection.close()
})