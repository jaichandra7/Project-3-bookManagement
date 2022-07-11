const isValidRating = function(rating){
    return  /^[1-5]+\.+[5]$/.test(rating); 
  };

module.exports = {isValidRating}