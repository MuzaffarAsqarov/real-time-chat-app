const getUserDetailsFormToken = require("../helpers/getUserDetailsFormToken")
const UserModel = require("../models/UserModel")


const updataUserDetails = async (req, res) => {    
    try {
        const token = req.cookies.token || ""
        const image = req.file && req.file.filename

        const user = await getUserDetailsFormToken(token)

        const { name } = req.body

        await UserModel.updateOne({_id: user.id}, {
            name,
            profile_pic: image
        })

        const userInformation = await UserModel.findById(user.id).select('-password')        

        return res.status(200).json({
            message: 'user detailes updated',
            user : userInformation,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = updataUserDetails