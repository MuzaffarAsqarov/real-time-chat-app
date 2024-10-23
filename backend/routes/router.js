const express = require('express')
const registerUser = require('../controllers/registerUser')
const checkEmail = require('../controllers/checkEmail')
const checkPassword = require('../controllers/checkPassword')
const UserDetails = require('../controllers/userDetails')
const logout = require('../controllers/logout')
const updataUserDetails = require('../controllers/updataUserDetails')
const { upload } = require('../helpers/filehelper')
const searchUser = require('../controllers/serachUser')
const { ImageUploads, VideoUploads } = require('../controllers/uploadsControllect')

const router = express.Router()

router.post('/image-uploads', upload.single('image'), ImageUploads)
router.post('/video-uploads', upload.single('video'), VideoUploads)

router.post('/register', upload.single('image'), registerUser)
router.post('/email', checkEmail)
router.post('/password', checkPassword)
router.get('/user-details', UserDetails)
router.get('/logout', logout)
router.put('/user-update', upload.single('image'), updataUserDetails)
router.post('/search-users', searchUser)

module.exports = router

