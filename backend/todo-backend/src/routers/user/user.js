const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middleware/auth');
const verifyUserRoles = require('../../middleware/roles');
const userController = require('../../controller/userController');
const { USER_ROLES } = require('../../constants');
const { userValidator, validateRequest } = require('../../validators/userValidation');
const accessTokenController = require('../../controller/accessTokenController');

// <------ create user -----> //
router
    .route('/create')
    .post(userValidator,
        validateRequest,
        userController.createNewUser
    );


// <------- Login --------> //
router 
    .route('/login')
    .post(userController.handleLogin
    );
  

// <------- Logout --------> //
router
    .route('/logout')
    .post(authenticateUser, 
        userController.logOut
    );
 

// <------- update user --------> //
router
    .route('/update')
    .put(authenticateUser, userValidator,
        validateRequest,
        userController.handleUpdate);
router
    .route('/update/:userId')
    .put(authenticateUser, userValidator,
        validateRequest,
        verifyUserRoles(USER_ROLES.admin),
        userController.handleUpdate);


// <------- delete user (only by admin) --------> //
router
    .route('/delete/:id')
    .delete( 
        authenticateUser,
        verifyUserRoles(USER_ROLES.admin),
        userController.deleteUser
    );


// <------- get all userInfo (Only by Admin) -------> //
router
    .route('/admin/all')
    .post(authenticateUser,
        verifyUserRoles(USER_ROLES.admin),
        userController.getAllUser
    )


// <------- loggedIn user Info --------> //
router.
    route('/info').
    post(authenticateUser,
        verifyUserRoles(USER_ROLES.user),
        userController.getUser
    )
router.
    route('/info/:id').
    post(authenticateUser,
        verifyUserRoles(USER_ROLES.user),
        userController.getUser
    )


// <------- refresh accessToken endpoint --------> //
router.
    route('/refresh-token')
    .post(accessTokenController.refreshAccessToken)



module.exports = router;
