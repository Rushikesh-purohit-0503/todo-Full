const ApiError = require("../utils/ApiErrors")
const Jwt = require("jsonwebtoken")
const userModel = require('../models/user')
const { ApiResponse } = require("../utils/ApiResponse")
const {generateAccessAndRefreshToken} =require('../utils/token')

const refreshAccessToken = async (req, res) => {
    const inComingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!inComingRefreshToken) {
        throw new ApiError(401, "unautherized access")
    }
    try {
        const decoded = Jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await userModel.findById(decoded?._id)

        if (!user) {
            console.error("User not found for ID:", decoded?._id);
            return res
                .status(403)
                .json({ message: "Invalid or expired refresh token" });
        }

        if (inComingRefreshToken !== user?.refreshToken) {
            throw new Error("refresh token expired", 401)
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user)
        // console.log(newRefreshToken);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, {
                accessToken: accessToken,
                refreshToken: newRefreshToken,

            }, "access token refreshed"))

    } catch (error) {
        console.error("Error during token refresh:", error.message);
        throw new ApiError(501, "Error refreshing token", error)
    }


}

module.exports = {refreshAccessToken}