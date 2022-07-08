const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const {isValidRequest,
    isValidMail,
    isValid,
    isValidTitle,
    isValidPhone,
    isValidPassword,
    isValidPincode,
    isValidName} = require('../Validator/userValidation')

const createUser = async function(req,res){
    try{
        
         if(!isValidRequest(req.body)){
            return res
                    .status(400)
                    .send({status: false, message:"Enter a Valid Input"})
         }

         let {title, name, phone, email, password, address} = req.body;
         let user = {}
         
         if(title){
            title = title.trim()
            if(!isValidTitle(title)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid Title"})
            }else{
                user.title = title
            }
         }else{ return res
         .status(400)
         .send({status:false, message:"Title is required"})
         }

         if(name){
            name = name.trim()
            if(!isValidName(name)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a Valid Name"})
            }else{
                user.name = name
            }
         }else{ return res
            .status(400)
            .send({status:false, message:"Name is required"})
        }

        if(phone && typeof phone == String){
            phone = phone.trim()
            
            if(!isValidPhone(phone)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid phone Number"})
            }
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"Phone number is required or enter the number in string"})
        }

        if(email){
            email = email.trim()
            if(!isValidMail(email)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid email"})
            }
        }else{ return res
            .status(400)
            .send({status:false, message:"Email is required"})
       }

       const isDuplicate = await userModel.findOne({$or:[{phone:phone},{email:email}]})
       if(isDuplicate){
        return res
                .status(409)                  
                .send({status:false, message:"email or phone already in use"})
       }
       user.phone = phone
       user.email = email

       if(password){
        password = password.trim()
            if(!isValidPassword(password)){
                return res
                    .status(400)
                    .send({status:false, message:"Password should contain min 8 and max 15 characters a number and a special character"})
            }else{
                user.password = password
            }
       }else{ return res
         .status(400)
         .send({status:false, message:"Password is required"})
         }

         if(address !== undefined){
            user.address = address
            if(req.body.address.street !== undefined){
                if(!isValid(req.body.address.street)){
                    return res
                    .status(400)
                    .send({status:false, message:"Enter valid street in address"})
                }else user.address.street = req.body.address.street
            }
            if(req.body.address.city !== undefined){
                if(!isValid(req.body.address.city)){
                    return res
                    .status(400)
                    .send({status:false, message:"Enter valid city in address"})
                }else user.address.city = req.body.address.city
            }
            if(req.body.address.pincode !== undefined){
                if(!isValidPincode(req.body.address.pincode)){
                    return res
                    .status(400)
                    .send({status:false, message:"Enter a valid pincode of six characters"})
                }else user.address.pincode = req.body.address.pincode
            }
         }

         const newUser = await userModel.create(user)
         return res
                    .status(201)
                    .send({status:true, message:"Success", data: newUser })

    }
    catch(error){
        return res
                .status(500)
                .send({status:false, message: error.message})
    }
}

const login = async function (req, res) {
    try {
  
      if (!isValidRequest(req.body)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide login details" });
      }
      let email = req.body.email;
      let password = req.body.password;
  
      // validating the userName(email)
      if (!isValidMail(email))
        return res
          .status(400)
          .send({ status: false, message: "Entered mail ID is not valid" });
  
      // validating the password
      if (!isValidPassword(password))
        return res.status(400).send({
          status: false,
          message: "Passwrod is not valid",
        });
  
      // finding for the author with email and password
      let user = await userModel.findOne({
        email: email,
        password: password,
      });
      if (!user)
        return res.status(400).send({
          status: false,
          message: "Username and password are not matched",
        });
  
      // JWT creation
      let token = jwt.sign(
        {
          userId: user._id.toString(),
          expiresIn: "24h"
        },
        "book-management36"
      );
      res.header("x-api-key", token);
      return res
        .status(200)
        .send({ status: true, message: "Success", data: token });
    } catch (err) {
      return res.status(500).send({status: false, message: err.message});
    }
  };
 

module.exports = {createUser, login}

