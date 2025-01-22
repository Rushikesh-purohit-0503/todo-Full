const express = require('express')
const router = express.Router()
const authanticateUser = require('../../middleware/auth')
const verifyUserRoles = require('../../middleware/roles')
const { todoValidator, validateRequest } = require('../../validators/userValidation')
const todoController = require('../../controller/todoContoller')

const { USER_ROLES } = require('../../constants')

// <--------- create_task --------> //
router
    .route('/new-task')
    .post(authanticateUser,
        todoValidator,
        validateRequest,
        todoController.createTodo
    )
router
    .route('/new-task/:assignedTo')
    .post(authanticateUser,
        todoValidator,
        validateRequest,
        todoController.createTodo
    )

// <------- get all or user wise tasks(only for admin) ------> //
router
    .route('/all-tasks')
    .post(authanticateUser,
        verifyUserRoles(USER_ROLES.admin),
        todoController.getAlltodos
    )
router
    .route('/all-tasks/:userId')
    .post(authanticateUser,
        verifyUserRoles(USER_ROLES.admin),
        todoController.getAlltodos
    )


// <------ get logged in users tasks ----->//
router
    .route('/user-tasks')
    .post(
        authanticateUser,
        todoController.getTodo
    )
router
    .route('/user-tasks /:id')
    .post(
        authanticateUser,
        todoController.getTodo
    )


// <--------- update task --------> //
router
    .route('/update/:todoId')
    .put(
        authanticateUser,
        todoValidator,
        validateRequest,
        todoController.updateTodo
    )


// <--------- delete tasks (only done by admin) --------> //
router
    .route('/delete/:todoId')
    .delete(authanticateUser, verifyUserRoles(USER_ROLES.admin), todoController.deleteTodo)


module.exports = router