const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const todoModel = require('./todos')
const userModel = new Schema({
    userName: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 2,
    },
    quote: {
        type: String,
        default: ' '
    },
    password: {
        type: String,
        required: true,
        validate: [validator.isStrongPassword, "Password must be Strong"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, " Email must be valid"]
    },
    refreshToken: {
        type: String
    }

})



module.exports = mongoose.model('User', userModel)