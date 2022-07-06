const jwt = require("jsonwebtoken");
const bookModel = require("../Models/bookModel");
const { isValidId } = require("../Validator/bookValidation");
const userModel = require("../Models/userModel")

// Authentication
const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];
    // checking token
    if (!token)
      return res
        .status(401)
        .send({ status: false, message: "token must be present" });

    // validating the token
    let decoded = jwt.verify(token, "book-management36") 
      if (!decoded){
        return res.status(401).send({ status: false, message: "token is invalid" });
      }
      else {
        // creating an attribute in "req" to access the token outside the middleware
        req.token = decoded;
        next();
      }

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//Authorization
const authorization = async function (req, res, next) {
  try {
    let bookId = req.params.bookId
    let userLoggedIn = req.token.userId;

        if(!bookId){
            return  res
            .status(400)
            .send({status:false, message:"give bookId in params"})
        }
    
    if (!isValidId(bookId))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid bookId" });
    
    let book = await bookModel.findOne({
      _id: bookId, isDeleted:false
    });

    if (!book) {
      return res
        .status(404)
        .send({ status: false, message: "No book found" });
    }
    // token validation
    if (userLoggedIn != book.userId)
      return res.status(401).send({
        status: false,
        message: "You are not authorized to perform this task",
      });

    // creating an attribute in "req" to access the blog data outside the middleware
    req.book = book;
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  authentication,
  authorization
};
