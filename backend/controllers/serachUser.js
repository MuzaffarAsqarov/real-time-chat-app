const UserModel = require("../models/UserModel")

async function searchUser(req, res) {
    
    try {
        const { search } = req.body

        const query = new RegExp(search,"i","g")
        
        if(search !== ''){
            const users = await UserModel.find({
                $or : [
                    { name : query },
                    { email : query }
                ]
            }).select("-password")
    
            res.status(200).json({
                message : 'all user',
                users : users,
                success : true
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true
        })
    }
}

module.exports = searchUser