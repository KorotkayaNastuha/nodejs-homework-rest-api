const express = require('express')

const {registerUser, loginUser, logoutUser, currentUser} = require('../../conttollers/users/authControllers')
const authentication = require('../../middleware/authMiddleware')

const router = express.Router()




router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authentication, logoutUser);
router.post('/current', authentication, currentUser)

module.exports = router
