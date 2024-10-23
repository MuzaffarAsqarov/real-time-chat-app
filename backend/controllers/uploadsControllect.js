

async function ImageUploads (req, res){
    try {
        const filePath = req.file ? req.file.filename : ''
        
        res.status(200).json({
            message : 'success',
            upload : true,
            filePath : filePath
        })
    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            error : true
        })
    }    
    
}

async function VideoUploads (req, res){    
    try {
        const filePath = req.file ? req.file.filename : ''
        
        res.status(200).json({
            message : 'success',
            upload : true,
            filePath : filePath
        })
    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            error : true
        })
    } 
}

module.exports = {
    ImageUploads,
    VideoUploads
}