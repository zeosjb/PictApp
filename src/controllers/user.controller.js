const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

/**
 * Register user
 */
const register = async (req = request, res = response) => {
    const { userName, email, password, bio, profilePicture, birthDay } = req.body

    try {
        // Check the userName
        const existingUserName = await User.findOne({ userName })
        if (existingUserName) {
            return res.status(400).json({msg:"Username already exists, try again"})
        }

        // Check the email
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({msg:"Invalid operation, cannot register the user."})
        }

        // Validation of the null data
        if (!userName || !email || !password || !birthDay) {
            return res.status(400).json({msg:"All fields are required."})
        }

        // Validation of the max lenght
        if (userName.length > 15 || email.length > 100 || password.length > 15|| password.length < 8 || bio.length > 255 || profilePicture.length > 255) {
            return res.status(400).json({msg:"Max length exceeded."})
        }

        // Hash the password
        const salt = bcryptjs.genSaltSync(10)
        const hashedPassword = bcryptjs.hashSync(password, salt)

        // Create the user
        const user = new User({
            userName,
            email,
            password: hashedPassword,
            bio,
            profilePicture,
            birthDay
        })

        await user.save()

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        const userData = {
            id: user.id,
            userName: user.userName,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            birthDay: user.birthDay,
            token
        }

        res.status(201).json({ 
            data: userData,
            message: "User registered successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    register
}