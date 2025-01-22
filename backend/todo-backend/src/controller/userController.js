// const { default: USER_ROLES } = require('../constants')
const userModel = require('../models/user')
const ApiError = require('../utils/ApiErrors')
const { ApiResponse } = require('../utils/ApiResponse')
const { generateAccessAndRefreshToken } = require('../utils/token')
const { verifyPassword, encryptPassword } = require('../utils/password')
const { USER_ROLES } = require('../constants')
const { default: mongoose } = require('mongoose')
const todoModel = require('../models/todos')
// New User (Sign Up)
const createNewUser = async (req, res) => {
    let { email, userName, password, quote } = req.body
    if ([email, userName, password].some((val) => (val.trim(' ') === " "))) {
        throw new ApiError(400, "Please enter valid details")
    }
   
    try {
        const exisitingUser = await userModel.findOne({ email: email }).exec()
        if (exisitingUser) {
            throw new ApiError(400, "Email already exists")
        }

        const hashedPassword = await encryptPassword(password)

        const newUser = await userModel.create({
            userName: userName, 
            email: email,
            password: hashedPassword,
            quote: quote
        })

        if (!newUser) {
            throw new ApiError(400, "Failed to create user")
        }
        return res
            .status(200).json(new ApiResponse(200, {
                user: newUser
            }, "User created successfully")) 

    } catch (error) {
        throw new ApiError(400, "User not created", error) 
    }
}

 
//Login
const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if ([email, password].some((val) => (val.trim(' ') === ' '))) { throw new ApiError(400, "Please enter valid details") }

    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
        throw new ApiError(400, "User already logged in")
    }

    let user = {}

    try {
        user = await userModel.findOne({ email: email }).exec()
        if (!user) { throw new ApiError(400, "User not found") }
    } catch (error) {
        throw new ApiError(400, "error finding in user", error)
    }

    try {
        const isValid = await verifyPassword(password, user.password)
        if (!isValid) { throw new ApiError(400, "Invalid password") }
    } catch (error) {
        throw new ApiError(400, "error verifying password", error)
    } 

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user)
    const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken -__v").exec()

    const options = {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    }


    return res.status(200).cookie('accessToken', accessToken, options)
        .cookie('refreshToken', newRefreshToken, options).json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken, newRefreshToken
        }, "User logged in successfully"))
}


//Update 
const handleUpdate = async (req, res) => {
    const { userName, quote, password } = req.body;
    let { userId } = req.params;

    // Validate input
    if ([userName, quote, password].some((val) => !val || val.trim() === '')) {
        throw new ApiError(400, "Please enter valid details");
    }

    const loggedInUserId = req.user?._id;
    const userRole = req.user?.role;
    userId = userId || req.user?._id;

    if (userRole !== USER_ROLES.admin && loggedInUserId.toString() !== userId.toString()) {
        throw new ApiError(403, "Not authorized: Only admins or the user themselves can update this profile");
    }

    try {
        const hashedPassword = await encryptPassword(password)
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { userName, quote, password: hashedPassword },
            { new: true, runValidators: true }
        ).select("-refreshToken -__v");

        if (!updatedUser) {
            throw new ApiError(404, "User not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, {
                    updatedInfo: updatedUser,
                }, "User updated successfully")
            );
    } catch (error) {
        throw new ApiError(500, `Error updating user info: ${error.message}`, error);
    }
};

//logout
const logOut = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!refreshToken) {
        throw new ApiError(401, "User already logout")
    }
    try {
        await userModel.findByIdAndUpdate(req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            { new: true }
        )

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"))

    } catch (error) {
        throw new ApiError()
    }
} 

//delete
const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'patient id required!!' })


    const { id } = req.params
    if (req.user.role !== USER_ROLES.admin) { // only admin can delete user
        throw new ApiError(403, "Not authorized: Only admins can delete users");
    }
    const todos = await todoModel.find({user_id : id})
    if (!todos) { 
        res.send('no todos found')
    }
    const deletedTodos = await todoModel.deleteMany({user_id : id})   
    const user = await userModel.findOne({ _id: id }).exec()
    if (!user) throw new ApiError(404, "User not found")
    const result = await user.deleteOne({ _id: id })
    return res.status(200).json(new ApiResponse(200, [result,deletedTodos], "User and todos deleted successfully"))
}

//getAlluser    
const getAllUser = async (_, res) => {
    try {
        const users = await userModel.find().select("-refreshToken -__v").exec()
        if (!users) throw new ApiError(404, "No users found")
        return res
            .status(200)
            .json(new ApiResponse(200, users, "Users retrieved successfully"))
    } catch (error) {
        throw new ApiError(501, error?.message, error)
    }
}

//a perticular userInfo
const getUser = async (req, res) => { 
    let { id } = req.params
    id = id || req.user._id.toString()


    if (req.user?.role !== USER_ROLES.admin && req.user._id.toString() !== id) throw new ApiError(403, "Not authorized: Only the user can view their own profile");
    try {
        const user = await userModel.findById(id).select("-refreshToken -__v").exec()
        if (!user) throw new ApiError(404, "User not found")
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user,
                    "")
            )
    } catch (error) {
        throw new ApiError(501, error?.message, error)
    }

}

module.exports = {
    createNewUser,
    getAllUser,
    getUser,
    deleteUser,
    handleLogin,
    logOut,
    handleUpdate
}
