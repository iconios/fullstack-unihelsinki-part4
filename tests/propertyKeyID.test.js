const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const blogs = require('../utils/test_helper').blogs

describe('Verify unique identifier id key', () => {
    test('Test the database id key name', async() => {
        const blog = blogs[3]
        logger.info('Received blog ', blog)
        const blogKeys = Object.keys(blog)
        logger.info('Keys of a blog ', blogKeys)
        assert.strictEqual(blogKeys[5], 'id')
    })
})

after(async () => {
    mongoose.connection.close()
})
