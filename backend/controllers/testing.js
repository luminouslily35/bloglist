const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  res.status(200).send({})
})

module.exports = router