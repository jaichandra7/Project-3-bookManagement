const isValidRating = function(rating){
    return  /^[1-5]\d{0}$/.test(rating);
  };

module.exports = {isValidRating}