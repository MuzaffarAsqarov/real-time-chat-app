const mongoose = require('mongoose')

const conversitionSchema = new mongoose.Schema({
    sender : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    messages : [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message'
        }
    ],
},{
    timestamps: true
})

const ConversationModel = mongoose.model('Conversation', conversitionSchema)

module.exports = ConversationModel