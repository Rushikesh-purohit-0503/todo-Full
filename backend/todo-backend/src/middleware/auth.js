const Jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const ApiError = require('../utils/ApiErrors')
const { ApiResponse } = require('../utils/ApiResponse')
const authanticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')

        if (!token) return res.status(401).json(new ApiResponse(401,{},"not Authorized No token found"))

        const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.findById(decoded._id).select("-password -refreshToken")

        if (!user) throw new ApiError(403, "Invalid Token, user not found")

        req.user = user
        next() 
    } catch (error) { 
        console.error("Error in verifyJwt middleware: ", error)
        throw new ApiError(401, "Unauthorized, invalid token")       
    } 

}    
module.exports = authanticateUser           