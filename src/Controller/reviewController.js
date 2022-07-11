const reviewModel = require('../Models/reviewModel')
const {isValidRequest, isValidName, isValid} = require('../Validator/userValidation')
const {isValidId} = require('../Validator/bookValidation')
const bookModel = require('../Models/bookModel')
const {isValidRating} = require('../Validator/reviewValidation')
const moment = require('moment')


const createReview = async function(req, res){
    try{
        if(!isValidRequest(req.body)){
            return res
                .status(400)
                .send({status:false, message:"Enter a valid Input"})
        }

        let {bookId, reviewedBy, reviewedAt, rating, review} = req.body
        let data = {}
        let Id = req.params.bookId

        if(!isValidId(Id)){
            return res
            .status(400)
            .send({status:false, message:"Give a valid book id in url"})
        }

        const book = await bookModel.findOne({_id: Id, isDeleted:false})
        if(!book){
            return res
            .status(404)
            .send({status:false, message:"No book found or is already deleted"})
        }

        if(bookId == undefined){
            data.bookId = Id;
        }

       
        if(reviewedBy){
            if(!isValidName(reviewedBy)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid Name"})
            }else data.reviewedBy = reviewedBy
        }

        if(reviewedAt == undefined){
            data.reviewedAt = Date.now()
        }

        if(rating && typeof rating != String){ // "4"
            if(!isValidRating(rating)){
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

        // data.reviewedt = Date.now()
        const bookReview = await reviewModel.create(data)
        const finalBook = await bookModel.findOneAndUpdate({_id:Id},{$inc:{reviews: 1}},{new:true}).select({__v:0})
        
        finalBook._doc["reviewsData"] = [bookReview] 

        return res
            .status(201)
            .send({status:true, message:"Successful", data:finalBook})
    }
    catch(error){
        return res
                .status(500)
                .send({status: false, message: error.message})
    }
}


const updateReview = async function(req, res){
    try{
        if(!isValidRequest(req.body)){
            return res
                .status(400)
                .send({status:false, message:"Enter a valid Input"})
        }

        let {review, rating, reviewedBy} = req.body 
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        

        if(!isValidId(bookId) || !isValidId(reviewId)){
            return res
                .status(400)
                .send({status:false, message:"Enter valid bookId or reviewId"})
        }

        if(review != undefined){
            review = review.trim()
            if(!isValid(review)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter valid review"})
            }
        }

        if(rating != undefined){
            if(rating == String || !isValidRating(rating)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter valid rating"})
            }
        }

        if(reviewedBy != undefined){
            reviewedBy = reviewedBy.trim()
            if(!isValidName(reviewedBy)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid Name"})
            }
        }

        let book = await bookModel.findOne({_id: bookId, isDeleted:false})
        if(!book){
            return res
                .status(404)
                .send({status:false, message:"Book not found or is deleted"})
        }

        const bookReview = await reviewModel.findOneAndUpdate({_id: reviewId, bookId: bookId},{$set:{review:review, rating: rating, reviewedBy:reviewedBy}},{new: true})

        if(!bookReview){
            return res
                .status(404)
                .send({status:false, message:"Review not found or is not for given bookId in url"})
        }
        
        book._doc["reviewsData"] = bookReview

        return res
            .status(200)
            .send({status: true, message:"Books list", data: book})

    }
    catch(error){
        return res
            .status(500)
            .send({status:false, message: error.message})        
    }
}


const deleteReview = async function (req, res){
    try{
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if(!isValidId(bookId) || !isValidId(reviewId)){
            return res
                .status(400)
                .send({status:false, message:"Enter valid bookId or reviewId"})
        }

        const bookReview = await reviewModel.findOneAndUpdate({_id:reviewId, bookId:bookId, isDeleted: false},{$set:{isDeleted: true}})
        if(!bookReview){
            return res
                .status(404)
                .send({status:false, message:"Review not found or is not for the same book as given in url"})
        }

        const book = await bookModel.findOneAndUpdate({_id: bookId},{$inc:{reviews: -1}})
        if(!book){
            return res
                .status(404)
                .send({status:false, message:"Book not found"})
        }
        return res
            .status(200)
            .send({status:true, message:"Review deleted"})

    }
    catch(error){
        return res
            .status(500)
            .send({status:false, message: error.message})        
    }
}
module.exports = {createReview, updateReview, deleteReview}