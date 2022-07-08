const mongoose = require('mongoose')

const isValidId = function(id){
   if(!mongoose.Types.ObjectId.isValid(id)){
    return false
   }return true
}

// function for array value verification
const checkValue = function (value) {
    let arrValue = [];
    value.map((x) => { 
      x= x.trim();
      if (x.length) arrValue.push(x);
    });
    return arrValue.length ? arrValue : false;
  };
  
  //function for converting string into array
  const convertToArray = function (value) {      
    if (typeof value == "string") {
      if(value.trim()){
      let newValue = value.trim()
      return [newValue];
      }
    } else if (value?.length > 0) return checkValue(value);
    return false;
  };

  const isValidISBN = function(isbn){
    return /^(?=(?:\d\-*){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn)
  }
  
  const isValidBookTitle = function(name){
    return /^[a-zA-Z0-9 ]{2,70}$/.test(name)
}

  module.exports = {convertToArray, checkValue, isValidId, isValidISBN, isValidBookTitle}