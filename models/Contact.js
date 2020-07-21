const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    dateWanted: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photography: {
        type: checkbox,
        required: false
    },
    editing: {
        type: checkbox,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Contact', ContactSchema)