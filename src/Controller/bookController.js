const bookModel = require("../Models/bookModel");
const reviewModel = require('../Models/reviewModel');
const {isValidRequest, isValid} = require('../Validator/userValidation');
const {isValidId, convertToArray, isValidISBN, isValidBookTitle} = require('../Validator/bookValidation');
const moment = require('moment');
const userModel = require("../Models/userModel");
const { default: mongoose } = require("mongoose");


const createBook = async function(req, res){
    try{
        if(!isValidRequest(req.body)){
            return res
            .status(400)
            .send({status:false, message: "Enter a valid Input"})
        }
        let {title, excerpt, userId, ISBN, category,subcategory} = req.body
        let book ={}

        if(title){
            title = title.trim()
            if(!isValidBookTitle(title)){
                return res
                        .status(400)
                        .send({status:false, message:"Enter valid title"})
            }
        }else{ return res
                .status(400)
                .send({status:false, message:"Title is required"})
        }

        if(excerpt){
            if(!isValid(excerpt)){
                return res
                        .status(400)
                        .send({status:false, message:"Enter valid excerpt"})
            }else book.excerpt = excerpt.trim()
        }else{ return res
                .status(400)
                .send({status:false, message:"excerpt is required"})
        }

        if(!userId){
            return  res
            .status(400)
            .send({status:false, message:"userId is required"})
        }
        if(!isValidId(userId)){
            return  res
            .status(400)
            .send({status:false, message:"Enter the valid format of userId"})
        }
        const user = await userModel.findById({_id: userId})
        if(!user){
            return  res
            .status(404)
            .send({status:false, message:"No user found"})
        }
         if(userId != req.token.userId){
            return  res
            .status(401)
            .send({status:false, message:"You are not authorized to perform this task"})
         }
         book.userId = userId  

        if(ISBN ){
            ISBN = ISBN.trim()
                if(!isValidISBN(ISBN) ){
                    return res
                    .status(400)
                    .send({status:false, message:"enter a valid ISBN of 10 or 13 characters"})
                }
        }else{
            return res
            .status(400)
            .send({status:false, message:"ISBN is required or try in string"})
        }
        const isDuplicate = await bookModel.findOne({$or:[{title:title},{ISBN:ISBN}]})
        if(isDuplicate){
            return res
            .status(409)
            .send({status:false, message:"title or ISBN is already in use"})
        }
        book.title = title
        book.ISBN = ISBN

        if(category){
            if(!isValid(category)){
                return res
                .status(400)
                .send({status:false, message:"enter a valid category"})
            }else book.category = category.trim()
        }else{
            return res
            .status(400)
            .send({status:false, message:"category is required"})
        }

        if(subcategory){
            subcategoryNew = convertToArray(subcategory)
            if(!subcategoryNew){
                return res
                .status(400)
                .send({status:false, message:"Enter a valid subcategory"})
            }else{
                book.subcategory = subcategoryNew
            }
        }else{
            return res
            .status(400)
            .send({status:false, message:"subcategory is required"})
        }
        
        book.releasedAt = Date.now()
       
        const newBook = await bookModel.create(book)
        return  res
                .status(201)
                .send({status:true, message:"Success", data: newBook})
    }
    catch(error){
        console.log(error)
        return res
                .status(500)
                .send({status:false, message: error.message})
    }
}


const getBooks = async function(req,res){
    try{
        if(!isValidRequest(req.query)){
            return  res
                .status(400)
                .send({status:false, message:"Enter valid Input"})
        }
        let {userId, category, subcategory} = req.query
        let bookData ={};

        if(userId){
            userId = userId.trim()
            if(!isValidId){
                return  res
                .status(400)
                .send({status:false, message:"Enter valid ObjectID"})
            }else bookData.userId = userId
        }
        if(category){
            category = category.trim()
            if(!isValid(category)){
                return  res
                .status(400)
                .send({status:false, message:"Enter a valid category"})
            }else bookData.category = category
        }

        if (subcategory) {
            if (subcategory.trim().length) {
              const subArr = subcategory.split(",").map((sub) => sub.trim());
              bookData.subcategory = { $in: subArr };
            } else
              return res
                .status(400)
                .send({ status: false, msg: "Please enter valid subcategory" });
          }
          
          bookData.isDeleted = false
        let bookDetails = await bookModel.find(bookData).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})
        if(bookDetails.length == 0){
            return  res
                .status(404)
                .send({status:false, message:"No book found"})
        }
        
        return  res
                .status(200)
                .send({status:true, message:'Books list', data: bookDetails})
    }
    catch(error){
        console.log(error)
        return res
                .status(500)
                .send({status:false, message: error.message})
    }
}

const getBooksParticular = async function(req, res){
    try{
        let bookId = req.params.bookId
        
        if(!isValidId(bookId)){
            return  res
                .status(400)
                .send({status:false, message:"Enter valid format of bookId"})
        }

        const book = await bookModel.findOne({_id: bookId}).select({__v:0})
        if(!book){
            return  res
                .status(404)
                .send({status:false, message:"No such book found"})
        }

        const review = await reviewModel.find({bookId: bookId}).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1, rating:1, review:1, })

        book._doc["reviewsData"] = review
        return  res
                .status(200)
                .send({status:true, message:'Books list', data: book})
    }
    catch(error){
    console.log(error)
    return res
            .status(500)
            .send({status:false, message: error.message})
    }
}                          

//updation of book
const updatebook = async function(req, res){
    try{
        if(!isValidRequest(req.body)){
            return  res
            .status(400)
            .send({status:false, message:"Enter a valid input"})
        }
        let {title, excerpt, releasedAt, ISBN} = req.body
        

        if(title != undefined){
            title = title.trim()
            if(!isValidBookTitle(title)){
                return  res
            .status(400)
            .send({status:false, message:"Enter a valid title"})
            }
        }

        if(excerpt !=  undefined){
            if(!isValid(excerpt)){
                return  res
                    .status(400)
                    .send({status:false, message:"Enter valid excerpt"})
            }
        }

        if(releasedAt != undefined){
            let date =moment().format("YYYY-MM-DD")
           
            if(releasedAt !== date){
                return  res
                    .status(400)
                    .send({status:false, message:"Enter the valid date format for releasedAt as YYYY-MM-DD"})
            }else releasedAt = Date.now()
        }
        
        if(ISBN != undefined){
            ISBN = ISBN.trim()
            if(!isValidISBN(ISBN)){
                return  res
            .status(400)
            .send({status:false, message:"enter a valid ISBN of 10 or 13 characters"})
            }
        }
        const isDuplicate = await bookModel.findOne({$or:[{title:title},{ISBN:ISBN}]})
        if(isDuplicate){
            return  res
            .status(409)
            .send({status:false, message:"title or ISBN is duplicate"})
        }
        const book = await bookModel.findOneAndUpdate({_id:req.book._id},{$set:{title:title,
                excerpt: excerpt,
                releasedAt: releasedAt,
                ISBN:ISBN}}, {new:true})
        if(!book){
            return  res
            .status(404)
            .send({status:false, message:"book is not found"})
        }
        return  res
            .status(200)
            .send({status:true, message:"Success", data:book})
    }
    catch(error){
        return res
                .status(500)
                .send({status:false, message: error.message})
    }
}

//deletion of book
const deleteBook = async function(req, res){
    try{
        let book = await bookModel.findOneAndUpdate({_id: req.book._id},{$set:{isDeleted:true, deletedAt:Date.now() }})

        if(!book){
            return res
            .status(404)
            .send({status:false, message: "No book exist or is already deleted"})
        }

        return res
        .status(200)
        .send({status:true, message: "Success"})
    }
    catch(error){
        return res
        .status(500)
        .send({status:false, message: error.message})
    }
}
    module.exports = {createBook, getBooks, getBooksParticular, updatebook, deleteBook}