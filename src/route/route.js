const {createUser,login} = require('../Controller/userController')
const {createBook} = require('../Controller/bookController')
const {authorAuthentication, authorization} = require('../Middleware/auth')
const express = require('express')
const router = express.Router()

router.post('/register', createUser)
router.post('/login', login)

router.post('/books',authorAuthentication, authorization, createBook)

module.exports = router