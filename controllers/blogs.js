const Blog = require('../models/blog')
const express = require('express')
const blogRouter = express.Router()
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const SECRET = require('../utils/config').SECRET
const tokenExtractor = require('../utils/middleware').tokenExtractor
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
  
blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    logger.info('Request received ', body)

    const checkLikesKey = body.hasOwnProperty('likes')
    const checkTitleKey = body.hasOwnProperty('title')
    const checkUrlKey = body.hasOwnProperty('url')
    
    if (!checkTitleKey || !checkUrlKey) {
        logger.info('Title or url key not found')

        return response.status(400).end()

    } 
    else if(!checkLikesKey) {
        logger.info('Likes key not found')

        const likedBlog = {...body, likes: 0, user: request.user}        
        const newBlog = new Blog(likedBlog)
        logger.info('New blog body ', likedBlog)
        
        const result = await newBlog.save()
        return response.status(201).json(result)
    }
    else {
        logger.info('All keys found')  
        const blogWithCreator = {...body, user: request.user} 
        const blog = new Blog(blogWithCreator)
        logger.info('Blog body ', blogWithCreator)
        
        const result = await blog.save()
        return response.status(201).json(result)
    }          
    
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const BlogID = request.params.id

    // Confirm the blog ID is in the Blog model
    const blog = await Blog.findById(BlogID)
    logger.info('Blog received from DB', blog)

    if(blog) {
        if(blog.user.toString() === request.user) {
            const result = await Blog.findByIdAndDelete(BlogID)
            return response.json(result)
        }
        else return response.status(401).json({error: "Unauthorized: User ID or token invalid"})
    }
    else return response.status(401).json({error: "Unfound blog"})
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body
    if(body) {
        const blog = new Blog(body)
        const result = await Blog.findByIdAndUpdate(id, blog)
        return response.status(201).json(result)
    }
    else return response.status(400)
})


module.exports = blogRouter

