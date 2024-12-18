const User = require('../models/user')
const express = require('express')
const userRouter = express.Router()
const logger = require('../utils/logger')
const bcrypt = require('bcryptjs')

userRouter.get('/', async (request, response) => {    
    const users = await User.find({})
    logger.info('Details of all users ', users)
    response.status(200).json(users)
})

userRouter.post('/', async(request, response) => {
    const username = request.body.username
    const name = request.body.name
    const password = request.body.password
    const isPasswordMin3Xters = password.length > 2
    logger.info('Is password minimum 3 xters', isPasswordMin3Xters)

    const saltRounds = 10

    if(!username || !name || !isPasswordMin3Xters) {
        logger.error('None of the parameters can be empty')
        return response.status(400).end()
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = {
        "username": username, 
        "name": name,
        "passwordHash": passwordHash,
    }
    const newUser = new User(user)
    const savedUser = await newUser.save()
    logger.info('User saved', savedUser)
    return response.status(201).json(savedUser)
})


userRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const deletedUser = await User.findByIdAndDelete(id)
    response.status(200).json(deletedUser)
})



module.exports = userRouter