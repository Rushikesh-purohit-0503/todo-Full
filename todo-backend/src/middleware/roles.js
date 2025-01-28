const ApiError = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");

const verifyUserRoles = (...userRoles) => {
    return (req, res, next) => { 
        try {
            console.log('User role:', req.user?.role); // Debugging log
            console.log('Allowed roles:', userRoles);

            if (!req?.user?.role) {
                throw new ApiError(403, 'Forbidden: No roles assigned.');
            }

            if (!userRoles.includes(req.user?.role)) return res.status(400).json(new ApiResponse(400,{},"User doesn't have permission"))
            next()

        } catch (error) {
            next(error)           
        }
    }
}

module.exports = verifyUserRoles