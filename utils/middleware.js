const logger = require('./logger')
const jwt =require('jsonwebtoken')
const SECRET = require('../utils/config').SECRET
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method ', request.method)
    logger.info('Path ', request.path)
    logger.info('Body ', request.body)
    logger.info('-------')
    next()
}

const unknownendpoint = (request, response) => {
    response.status(400).send({error: "unknown endpoint"})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: "malformated id"})
    }

    if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    if(error.name === 'MongoServerError') {
        return response.status(400).json({error: error.message})
    }

    if(error.name === 'MongooseError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}


function getToken(request, next) {

}

const tokenExtractor = (request, response, next) => {
    const authHeader = request.headers['authorization']

    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token after "Bearer "
        const token = authHeader.split(' ')[1]

        // Attach token to the request object
        request.token = token

        // Call the next middleware/route handler
        next();
    } else {
        // Respond with 401 Unauthorized if token is missing or invalid
        return response.status(401).json({ message: 'Unauthorized: Token is missing or invalid' })
    }
}

const userExtractor = async (request, response, next) => {
    const authHeader = request.headers['authorization']

    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token after "Bearer "
        const token = authHeader.split(' ')[1]

        // Decode token received in the header
       const decodedToken = jwt.verify(token, SECRET)
       logger.info('Decoded token', decodedToken)

       // Confirm the decoded token
       if(decodedToken) {

            // Verify that the user id in decoded token is in the users model
            const userIdFromDB = await User.findById(decodedToken.id)
            logger.info('User found in DB', userIdFromDB)

            // Confirm the returned user details
            if (userIdFromDB) {

                //Pass the user id returned to the request
                request.user = userIdFromDB.id
                logger.info('User ID found in DB', request.user)

                // Call the next middleware/route handler
                next()

            } // Respond with 401 Unauthorized if user is missing or invalid
            else return response.status(401).json({ error: 'Unauthorized: User is missing or invalid' })

        } // Respond with 401 Unauthorized if token is missing or invalid
        else return response.status(401).json({ error: 'Unauthorized: Token is missing or invalid' })

    } // Respond with 401 Unauthorized if authorization is missing or invalid
    else return response.status(401).json({ error: 'Unauthorized: Authorization is missing or invalid' })

}

module.exports = {
    requestLogger,
    unknownendpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}

