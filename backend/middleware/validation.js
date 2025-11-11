const { validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });

    }
    next();

};

exports.authValidation = {
    login: [
        require('express-validator').body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        require('express-validator').body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ],
    register: [
        require('express-validator').body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        require('express-validator').body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        require('express-validator').body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        require('express-validator').body('role')
            .isIn(['sales', 'manager', 'admin'])
            .withMessage('Role must be sales, manager, or admin')

    ]

};

exports.applicationValidation = {
    create: [
        require('express-validator').body('customerInfo.firstname')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name is required and must be between 2-50 characters'),
        require('express-validator').body('customerInfo.lastname')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name is required and must be between 2-50 characters'),
        require('express-validator').body('customerInfo.phone')
            .trim()
            .isLength({ min: 9 })
            .withMessage('Phone number is required'),
        require('express-validator').body('applicationType')
            .isIn(['new-car', 'trade-in'])
            .withMessage('Application type must be new-car or trade-in'),
        require('express-validator').body('vehicle.newCar.model')
            .trim()
            .notEmpty()
            .withMessage('Vehicle model is required'),
        require('express-validator').body('vehicle.newCar.price')
            .isFloat({ min: 0 })
            .withMessage('Vehicle price must be a positive number')
    ]
};