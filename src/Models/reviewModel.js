const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId:{
            type:objectId,
            ref: 'Books',
            required: true
    },

    reviewedBy:{
                type:String,
                required:true,
                default: "Guest" 
    },

    reviewedAt:{
                type:Date,
                required: true
    },

    rating:{
            type:Number,
            minLength: 1,
            maxLength: 5,
            required: true
    },

    review:{
        type:String
    },

    isDeleted:{
                type:Boolean,
                default: false
    }
},{timestamps: true})

module.exports = mongoose.model('reviews', reviewSchema)