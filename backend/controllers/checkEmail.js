const UserModel = require("../models/UserModel")

async function checkEmail (req, res){    
    try {
        const { email } = req.body  

        const checkEmail = await UserModel.findOne({email})

        if(!checkEmail){
            return res.status(404).json({
                message: 'User not founded',
                error: true
            })
        }

        return res.status(200).json({
            message: 'email verify',
            data: checkEmail,
            success: true
        })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = checkEmail