const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const generateToken = require('../utils/generateToken')

/**
 * Register user
 * Create user
 * localhost:8080/api/users/register
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
        const token = await generateToken(user.id)

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

/**
 * Login user
 * localhost:8080/api/users/login
 */
const login = async (req = request, res = response) => {
    const { email, password } = req.body

    try {
        // Check if the user exists in the system
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials, try again." })
        }

        // Check if the password is correct
        const validPassword = bcryptjs.compareSync(password, user.password)

        if (!validPassword) {
            return res.status(400).json({ msg: "Invalid credentials, try again." })
        }

        // Check if the user is deleted
        if (user.deleted) {
            return res.status(410).json({ msg: "User account has been disabled, please contact support." })
        }

        // Generate JWT
        const token = await generateToken(user.id)

        const userData = {
            id: user.id,
            userName: user.userName,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            birthDay: user.birthDay,
            token
        }

        res.status(200).json({ 
            data: userData,
            message: "User logged in successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Login failed due to internal server error"
        })
    }
}

/**
 * Visualize the user profile
 * localhost:8080/api/users/2
 */
const viewProfile = async (req = request, res = response) => {
    const { id } = req.params

    try {
        const user = await User.findById(id, {
            attributes: { exclude: ['password', 'email', 'createdAt', 'updatedAt', 'deleted', 'id'] }
        })

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        if (user.deleted) {
            return res.status(410).json({ msg: "User account has been disabled, please contact support." })
        }

        // Obtain followers 
        // TODO: Optimize this query - User List only with id, userName and profilePicture
        const followers = await Follow.findAll({
            where: { followingId: id },
            include: [{ model: User, as: 'follower', attributes: ['id', 'userName', 'profilePicture'] }]
        })

        if (!followers) {
            followers = []
        }

        // TODO: Obtain following
         if (!following) {
            following = []
        }

        // TODO: Obtain posts
         if (!posts) {
            posts = []
        }


        res.status(200).json({ 
            data: user,
            followers,
            following,
            posts,
            message: "User profile retrieved successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

/**
 * Update user profile
 */
const updateProfile = async (req = request, res = response) => {
    const userId = req.user.id
    const { userName, email, bio, profilePicture, birthDay } = req.body

    try {
        if (!userName && !email && !birthDay && !bio && !profilePicture) {
            return res.status(400).json({msg:"At least one field must be provided."})
        }

        // Check the user is in the system
        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ msg: "User not found." })
        }

        if (user.deleted) {
            return res.status(410).json({ msg: "User account has been disabled, please contact support." })
        }

        // Check the userName
        if (userName && userName !== user.userName) {
            const existingUserName = await User.findOne({ userName })
            if (existingUserName) {
                return res.status(400).json({msg:"Username already exists, try again"})
            }
            user.userName = userName
        }
        
        // Check the email
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({msg:"Email already exists, try again"})
            }
            user.email = email
        }

        // Update the user fields
        user.userName = userName || user.userName
        user.email = email || user.email
        user.bio = bio || user.bio
        user.profilePicture = profilePicture || user.profilePicture
        user.birthDay = birthDay || user.birthDay
        
        await user.save()

        res.status(200).json({
            data: user,
            message: "User profile updated successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Logout user
const logout = async (req = request, res = response) => {
    // Since JWT is stateless, logout can be handled on the client side by deleting the token.
    res.status(200).json({ msg: "User logged out successfully" })
}



module.exports = {
    register,
    login,
    viewProfile,
    updateProfile
}