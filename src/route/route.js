const {createUser,login} = require('../Controller/userController')
const {createBook,
        getBooks,
        getBooksParticular,
        updatebook,
        deleteBook} = require('../Controller/bookController')
const {authentication, authorization} = require('../Middleware/auth')
const {createReview,
        updateReview,
        deleteReview} = require('../Controller/reviewController')
const express = require('express')
const router = express.Router()

router.post('/register', createUser)
router.post('/login', login)


router.post('/books',authentication, createBook)
router.get('/books', authentication, getBooks )
router.get('/books/:bookId', authentication, getBooksParticular)
router.put('/books/:bookId', authentication, authorization, updatebook)
router.delete('/books/:bookId', authentication, authorization, deleteBook)


router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete('/books/:bookId/review/:reviewId', deleteReview   )

module.exports = router