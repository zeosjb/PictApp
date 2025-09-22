const { Router } = require('express')

const router = Router()

// Controllers
const { register, login, viewProfile, updateProfile } = require('../controllers/user.controller')
const validateToken = require('../middlewares/validateToken')

// Register Route
router.post("/register", register)

// Login Route
router.post("/login", login)

// View Profile Route
router.get("/profile/:id", viewProfile, validateToken)

// Update Profile Route
router.put("/profile", updateProfile, validateToken)

module.exports = router