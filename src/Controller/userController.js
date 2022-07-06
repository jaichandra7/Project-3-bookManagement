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
         let {title, name, phone, email, password, address} = req.body;
         let user = {}
         
         if(!isValidRequest(req.body)){
            return res
                    .status(400)
                    .send({status: false, message:"Enter a Valid Input"})
         }
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

        if(phone){
            phone = phone.trim()
            if(!isValidPhone(phone)){
                return res
                    .status(400)
                    .send({status:false, message:"Enter a valid phone Number"})
            }
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"Phone number is required"})
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
                .status(400)                  
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
        let { email, password } = req.body

        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a Valid Input" })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "Please provide email." })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "Enter password" })
        }

        let user = await userModel.findOne({ email: email })
        if (user) {
            if (user.password !== password) {
                return res
                    .status(400)
                    .send({ status: false, message: "Password is incorrect" })
            }
        } else {
            return res
                .status(404)
                .send({ status: false, message: "user with this email is not found" })
        }
        //token creation
        let token = await jwt.sign({
            userId: user._id,
            expiresIn: "24h"}, //payload
            "book-management36" 
        )
        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, message: 'Success', data: token })


    }
    catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({ status: false, message: error.message })
    }

}
 

module.exports = {createUser, login}

