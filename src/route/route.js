const {createUser} = require('../Controller/userController')
const express = require('express')
const router = express.Router()

router.post('/register', createUser)

module.exports = router