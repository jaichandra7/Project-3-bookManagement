const isValidRequest = function(value){
    if(Object.keys(value).length == 0){
        return false
    }return true
}

// function for title verification
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].includes(title);
  };

// function for email verification
const isValidMail = function (email) {
    return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email);
};

// function for string verification
const isValid = function (value) {
    if (typeof value == undefined || value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
    else {
          if (typeof value == "string" && /^[a-zA-Z ,]+.*$/.test(value) )
          return true;
          else return false;
    }
  };

//function for verifying mobile number
const isValidPhone
 = function(phone){
    return  /^((\+91(-| )?)|0)?[6-9][0-9]{9}$/.test(phone); 
  };

  // function for password verification
const isValidPassword = function (pass) {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(pass);
  };

const isValidPincode = function(pin){
    return /^[1-9][0-9]{5}$/.test(pin)
};

//function for verifying the name using regex
const isValidName = function(name){
    return /^[a-zA-Z ]{2,70}$/.test(name)
}

module.exports = {isValidRequest,
                    isValidMail,
                    isValid,
                    isValidTitle,
                    isValidPhone,
                    isValidPassword,
                    isValidPincode,
                    isValidName
                }

