require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const errorHandler = require('./utils/middleware').errorHandler
const requestLogger = require('./utils/middleware').requestLogger
const unknownendpoint = require('./utils/middleware').unknownendpoint
const config = require('./utils/config')

const mongoUrl = config.MONGODB_URI

mongoose.set('strictQuery', false)

logger.info('Connecting to ', mongoUrl)

const connectToDB = async () => {
    try {
        await mongoose.connect(mongoUrl)
        logger.info('Connection to DB successful')
    }
    catch{
        logger.info('Connection to DB successful')
    }
}

connectToDB()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(unknownendpoint)
app.use(errorHandler)

module.exports = app