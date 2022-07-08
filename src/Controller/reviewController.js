const reviewModel = require('../Models/reviewModel')
const {isValidRequest, isValidName, isValid} = require('../Validator/userValidation')
const {isValidId} = require('../Validator/bookValidation')
const bookModel = require('../Models/bookModel')
const {isValidRating} = require('../Validator/reviewValidation')
const createReview = async function(req, res){
    try{
        if(!isValidRequest(req.body)){
            return res
                .status(400)
                .send({status:false, message:"Enter a valid Input"})
        }

        let {bookId, reviewedBy, rating, review} = req.body
        let data = {}
        let Id = req.params.bookId

        if(!bookId){
                return res
                    .status(400)
                    .send({status:false, message:"bookId is required"})
        }
        if(!isValidId(bookId)){
            return res
            .status(400)
            .send({status:false, message:"Enter a valid bookId"})
        }

        if(!isValidId(Id)){
            return res
            .status(400)
            .send({status:false, message:"Give a valid book id in url"})
        }

        if(bookId != Id){
            return res
            .status(400)
            .send({status:false, message:"body should contain the same Id as in URL "})

        }
        const book = await bookModel.findById({_id: bookId})
        if(!book){
            return res
            .status(404)
            .send({status:false, message:"No book found"})
        }
        data.bookId = bookId

        if(reviewedBy){
            if(!isValidName(reviewedBy)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid Name"})
            }else data.reviewedBy = reviewedBy
        }

        if(rating && typeof rating == Number){
            if(!isValidRating){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid Rating"})
            }else data.rating = rating
        }else{
            return res
            .status(400)
            .send({status:false, message:"Rating is required and will be number between 1 to 5"})
        }

        if(review){
            if(!isValid(review)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid REVIEW"})
            }else data.review = review.trim()
        }

        data.reviewedt = Date.now()
        const bookReview = await reviewModel.create(data)
        const finalBook = await bookModel.findById({_id: Id})


        return res
            .status(201)
            .send({status:false, message:"Enter a valid Successful", data:bookReview})
    }
    catch(error){
        return res
                .status(500)
                .send({status: false, message: error.message})
    }
}

module.exports = {createReview}