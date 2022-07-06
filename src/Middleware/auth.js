const jwt = require("jsonwebtoken");
const bookModel = require("../Models/bookModel");
const { isValidId } = require("../Validator/bookValidation");
const userModel = require("../Models/userModel")

// Authentication
const authorAuthentication = async function (req, res, next) {
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
    let userId = req.body.userId
    let userLoggedIn = req.token.userId;
    if(!userId) return res.status(400).send({status:false, message:"userId is required"})

    if (!isValidId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid userId" });
    // Blog validation
    let user = await userModel.findOne({
      _id: userId,
    });

    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "No such user exists" });
    }
    // token validation
    if (userLoggedIn != user._id)
      return res.status(401).send({
        status: false,
        message: "You are not authorized to perform this task",
      });

    // creating an attribute in "req" to access the blog data outside the middleware
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  authorAuthentication,
  authorization,
};
