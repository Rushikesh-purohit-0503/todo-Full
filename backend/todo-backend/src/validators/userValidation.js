const { body, validationResult } = require('express-validator');
const { ApiResponse } = require('../utils/ApiResponse');

const userValidator = [
    body('userName').notEmpty().withMessage('User name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isStrongPassword()
        .withMessage('Password must contain at least 8 characters, including an uppercase letter, a number, and a symbol'),
];

const todoValidator = [
    body('title').notEmpty().withMessage('title is required'),
    body('status').notEmpty().withMessage('status is required')
]

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json(new ApiResponse(400,errors.array()))
    next()
}


module.exports = { userValidator,validateRequest,todoValidator}