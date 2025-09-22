const { response } = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const validateToken = async (req, res = response, next) => {
    const authHeader = req.header("Authorization")
    token = authHeader && authHeader.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({ msg: "Access denied, no token provided." })
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(id)

        if (!user || user.deleted) {
            return res.status(401).json({ msg: "Invalid token, user not authorized." })
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expired." })
        }
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: "Invalid token."
        })
    }
}

module.exports = validateToken