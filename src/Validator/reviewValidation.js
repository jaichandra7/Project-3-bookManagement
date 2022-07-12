const isValidRating = function(rating){
    return  /^[1-5]+\.*[1-9]$/.test(rating); 
  };

module.exports = {isValidRating}