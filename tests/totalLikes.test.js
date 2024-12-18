const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes


describe('Total Likes', () => {
    const blogs = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
    ]

    test('When list has only one blog, equals the likes of that', () => {
        const result = totalLikes(blogs)        
        assert.strictEqual(result, 7)
    })
})