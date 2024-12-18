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

    const blog3 = new Blog(blogs[2])
    await blog3.save()
    logger.info('3rd blog saved and marked for deletion test')
})

describe('Verify blog deletion functionality', () => {
    test('Test the http Delete', async () => {
        const blogsAtStart = await api.get('/api/blogs')

        const blogForDeletion = await Blog.find(blogs[2])

        const blogForDeletionID = String(blogForDeletion.map(blog => blog._id))
        
        await api.delete(`/api/blogs/${blogForDeletionID}`)
            .expect(200)
            .expect('content-type', /application\/json/)

        const blogsAtEnd = await api.get('/api/blogs')

       const blogTitles = blogsAtEnd.body.map(blog => blog.title)

       assert(!blogTitles.includes('React JavaScript'))
       assert.strictEqual(blogsAtStart.body.length, (blogsAtEnd.body.length)+1)
        
    })
})


after(async () => {
    mongoose.connection.close()
})