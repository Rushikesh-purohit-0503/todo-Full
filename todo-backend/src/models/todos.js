const mongoose = require('mongoose')

const Schema = mongoose.Schema

const todoModel = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },

}, { timestamps: true });


module.exports = mongoose.model('Todo',todoModel); 