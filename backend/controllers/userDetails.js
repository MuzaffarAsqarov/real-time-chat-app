const getUserDetailsFormToken = require("../helpers/getUserDetailsFormToken")


const UserDetails = async (req, res) => {
    try {
        const token = req.cookies.token || ""

        const user = await getUserDetailsFormToken(token)

        // if(user?.logout){
        //     return res.status(401).json({
        //         data : user
        //     })
        // }

        return res.status(200).json({
            message: 'user detailes',
            data : user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = UserDetails