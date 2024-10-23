const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')

async function registerUser (req, res){    
    try {
        const { name, email, password } = req.body
        const file = req.file ? req.file.filename : ''  

        const chackEmail = await UserModel.findOne({email})

        if(chackEmail){
            return res.status(400).json({
                message: 'Already user exits',
                error: true
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hash,
            profile_pic: file.filename
        }

        const user = new UserModel(payload)
        const usersave = await user.save()

        res.status(201).json({
            message: 'User created succesfully',
            user: usersave,
            success: true
        })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = registerUser