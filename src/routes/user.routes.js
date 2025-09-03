const { Router } = require('express')

const router = Router()

// Controllers
const { register } = require("../controllers/user.controller")

// Register Route
router.post("/register", register)

module.exports = router