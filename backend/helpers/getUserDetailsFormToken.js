const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFormToken = async (token) => {
    if(!token || token === ''){
        return {
            message: 'session out', 
            logout: true
        } 
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)

    const user = await UserModel.findById(decode.id).select('-password')

    return user
}

module.exports = getUserDetailsFormToken