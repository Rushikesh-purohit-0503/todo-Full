const Jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
    return Jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPITY
        }
    )
}

const generateRefreshToken = (user) => {
    return Jwt.sign(
        {
            _id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPITY
        }
    )
}

const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save({ validationBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateAccessAndRefreshToken
}