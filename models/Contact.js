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
    datepicker: {
        type: String,
        ref: 'datepicker'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photography: {
        type: String,
        ref: 'photography',
        required: false
    },
    editing: {
        type: String,
        ref: 'editing',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Contact', ContactSchema)