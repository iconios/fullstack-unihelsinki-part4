const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const users = require('../utils/test_helper').users
const User =require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    logger.info('All users deleted')

    const user1 = new User(users[0])
    await user1.save()
    logger.info('1st user saved')

    const user2 = new User(users[1])
    await user2.save()
    logger.info('2nd user saved')

    const user3 = new User(users[2])
    await user3.save()
    logger.info('3rd user saved')
})

describe('Verify invalid users are not created', () => {
    test('Test username uniqueness', async () => {
        const newUser = {
            "username": "mercy@hotmail.com",
            "name": "Mercy Ikotun",
            "password": "Mercy@123"
        }

        const usersAtStart =(await api.get('/api/users')).body.length
        logger.info('Users number at start', usersAtStart)

        await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('content-type', /application\/json/)

        const usersAtEnd =(await api.get('/api/users')).body.length
        logger.info('Users number at end', usersAtEnd)

        assert.strictEqual(usersAtStart, usersAtEnd)
    })
    
    test('Test username length', async () => {
        const newUser = {
            "username": "me",
            "name": "Mercy Ikotun",
            "password": "Mercy@123"
        }

        const usersAtStart =(await api.get('/api/users')).body.length
        logger.info('Users number at start', usersAtStart)

        await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('content-type', /application\/json/)

        const usersAtEnd =(await api.get('/api/users')).body.length
        logger.info('Users number at end', usersAtEnd)
    
        assert.strictEqual(usersAtStart, usersAtEnd)
    })
})

after(async () => {
    mongoose.connection.close()
})