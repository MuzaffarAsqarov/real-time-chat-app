const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    quality: 100,
    resize: {width: 500, height: 500},

    filename: (req, file, cb) =>{
        cb(null, file.fieldname + "_" +Date.now() + path.extname(file.originalname))
    }
})

// const filefilter = (req, file, cb) => {
//     if(!file){
//         cb(null, true)
//     }
//     if(file.mimetype === 'image/png' ||  file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){
//         cb(null, true)
//     }else{
//         cb(null, false)
//         return cb(new Error('only jpg'))
//     }
// }

// const upload = multer({storege: storege, fileFilter: filefilter})
const upload = multer({storage: storage})

module.exports = {
    upload
}