const logger = require('./logger')

const dummy = (blogs) => {
    return 1
  }

  let sum = 0
  const totalLikes = (blogs) => {
    blogs.map(blog => {
        sum += blog.likes
    })

    return sum
  }

  const favoriteBlog = (blogs) => {
    const blogsLength = blogs.length
    const arrayLikes = blogs.map(blog => blog.likes)
    logger.info('Length of blogs ', blogsLength)
    logger.info('New array ', arrayLikes)

    const maxLikes = Math.max(...arrayLikes)
    logger.info('Max Likes ', maxLikes)

    const maxLikesIndex = arrayLikes.findIndex(likes => {
        return likes === maxLikes
    })
    logger.info('Max Likes index ', maxLikesIndex)
    logger.info('Blog with max likes ', blogs[maxLikesIndex])

    const newBlog =  blogs[maxLikesIndex]

    delete newBlog["_id"]
    delete newBlog["url"]
    delete newBlog["__v"]

    logger.info('New Blog ', newBlog)
    
    return newBlog
  }

  const mostBlogs = (blogs) => {
    let blogCount = []
    const blogsLength = blogs.length
    logger.info('Length of blogs ', blogsLength)

    const uniqueAuthors = Array.from(new Set(blogs.map(blog => blog.author)))
    logger.info('New array ', uniqueAuthors)
    logger.info('Length of new array ', uniqueAuthors.length)

    for(let index = 0; index < uniqueAuthors.length; index++) {
        blogCount[index] = (blogs.filter(blog => blog.author === uniqueAuthors[index])).length
        logger.info(`Count for blogCount ${index}`, blogCount[index])
    }
    logger.info('Count of blogs per author ', blogCount)

    const maxBlogs = Math.max(...blogCount)
    logger.info('Max blog count ', maxBlogs)

    const maxBlogsIndex = blogCount.findIndex(count => count === maxBlogs)
    logger.info('Index of maxBlog', maxBlogsIndex)

    return {
        "author": uniqueAuthors[maxBlogsIndex],
        "Blogs": maxBlogs
    }
  }

  const mostLikes = (blogs) => {
    let likesArray = []
    let likesCount = []
    let numLikes = []

    const blogsLength = blogs.length
    logger.info('Length of blogs ', blogsLength)

    const uniqueAuthors = Array.from(new Set(blogs.map(blog => blog.author)))
    logger.info('New array ', uniqueAuthors)
    logger.info('Length of unique authors ', uniqueAuthors.length)

    for(let index = 0; index < uniqueAuthors.length; index++) {
        likesArray[index] = blogs.filter(blog => blog.author === uniqueAuthors[index])
        logger.info(`Likes array for index ${index}`, likesArray[index])

        let like = 0
        numLikes[index] = likesArray[index].reduce((sum, obj) => { return sum + obj.likes}, 0)
        logger.info(`Number of Likes for index ${index}`, numLikes[index])
    }

    const maxLikes = Math.max(...numLikes)
    logger.info('Max Likes count ', maxLikes)

    const maxLikesIndex = numLikes.findIndex(count => count === maxLikes)
    logger.info('Index of maxLikes', maxLikesIndex)

    logger.info('Number of likes array ', numLikes)

    return {
        "author": uniqueAuthors[maxLikesIndex],
        "likes": maxLikes
    }
}


  module.exports = {
    dummy, 
    totalLikes, 
    favoriteBlog, 
    mostBlogs,
    mostLikes
  }