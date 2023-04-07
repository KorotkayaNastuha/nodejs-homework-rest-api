const express = require('express')

const {registerUser, loginUser, logoutUser, currentUser, updateAvatar, verifyEmail, verifyRepeatEmail} = require('../../conttollers/users/authControllers')
const authentication = require('../../middleware/authMiddleware')
const upload  = require('../../middleware/upload')

const router = express.Router()




router.post('/register', registerUser);
router.get('/verify/:verificationToken', verifyEmail)
router.post('/verify', verifyRepeatEmail)
router.post('/login', loginUser);
router.post('/logout', authentication, logoutUser);
router.post('/current', authentication, currentUser);
router.patch('/avatars', authentication, upload.single("avatar"), updateAvatar);
module.exports = router
