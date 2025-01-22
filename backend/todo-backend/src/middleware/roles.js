const ApiError = require("../utils/ApiErrors")

const verifyUserRoles = (...userRoles) => {
    return (req, _, next) => {
        try {
            console.log('User role:', req.user?.role); // Debugging log
            console.log('Allowed roles:', userRoles);

            if (!req?.user?.role) {
                throw new ApiError(403, 'Forbidden: No roles assigned.');
            }

            if (!userRoles.includes(req.user?.role)) throw new ApiError(403, "Forbidden: You do not have the required permissions")
            next()

        } catch (error) {
            next(error)           
        }
    }
}

module.exports = verifyUserRoles