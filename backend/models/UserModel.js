const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'required name']
    },
    email : {
        type: String,
        required: [true, 'required email'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'required password']
    },
    profile_pic : {
        type: String,
        default: ''
    },
},{
    timestamps: true
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel