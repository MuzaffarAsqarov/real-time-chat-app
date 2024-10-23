
const logout = async (req, res) => {    
    try {
        const cookieOptins = {
            http: true,
            secure: true 
        }

        return res.clearCookie('token').status(200).json({
            message: 'session out',
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = logout