require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const errorHandler = require('./utils/middleware').errorHandler
const requestLogger = require('./utils/middleware').requestLogger
const unknownendpoint = require('./utils/middleware').unknownendpoint

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

logger.info('Connecting to ', mongoUrl)

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log('Connection to DB successful')
    })
    .catch(() => {
        console.log('Connection unsuccessful')
    })

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogRouter)

app.use(unknownendpoint)
app.use(errorHandler)

module.exports = app