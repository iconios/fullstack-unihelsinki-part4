const jwt = require('jsonwebtoken')
const express = require('express')
const loginRouter = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const SECRET = require('../utils/config').SECRET
const logger = require('../utils/logger')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    logger.info('Received username', username, 'and password', password)

    const userName = await User.findOne({username})
    logger.info('Found user', userName)

    if(userName) {
        const isPasswordCorrect = await bcrypt.compare(password, userName.passwordHash)
        logger.info('Is the password correct', isPasswordCorrect)
        if(isPasswordCorrect) {
            const userForToken = {
                "username": userName.username,
                "id": userName._id
            }

            const token = jwt.sign(userForToken, SECRET)
            return response.status(200).send({token, "username": userName.username, "name": userName.name })
        }
        else return response.status(400).send('Username or password is incorrect')
    }
    else return response.status(400).send('No such account with us')
})




module.exports = loginRouter