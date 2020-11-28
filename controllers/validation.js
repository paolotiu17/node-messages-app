const { body, validationResult } = require('express-validator');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const nameMessages = {
    'string.min': 'length must be at least 2 characters long',
    'string.max': 'length must be less than or equal to 100 characters long',
    'string.alphanum': 'must only contain alpha-numeric characters',
    'string.empty': 'field is required',
    'string.pattern': 'Password must be ',
};

const signUpSchema = Joi.object({
    firstname: Joi.string()
        .trim()
        .alphanum()
        .min(2)
        .max(100)
        .required()
        .messages({ nameMessages, 'string.empty': 'First name is required' }),
    lastname: Joi.string()
        .trim()
        .alphanum()
        .min(2)
        .max(100)
        .required()
        .messages({ nameMessages, 'string.empty': 'Last name is required' }),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            ...nameMessages,
            'string.empty': 'Username is required',
        }),
    password: Joi.string()
        .min(6)
        .pattern(/(?=.*[A-Z])/)
        .message('Password should have at least 1 uppercase character')
        .messages({
            'string.min': 'Password should have at least 6 characters',
            'string.uppercase':
                'Password must have at least 1 uppercase character',
            'string.empty': 'Password should not be empty',
        }),
});
// const signUpValidators = [
//     body('firstname')
//         .trim()
//         .notEmpty()
//         .withMessage('First name should not be empty')
//         .isAlpha()
//         .withMessage(
//             'First name should only contain characters from A-Z or a-z'
//         )
//         .escape(),
//     body('lastname')
//         .notEmpty()
//         .withMessage('Last name should not be empty')
//         .isAlpha()
//         .withMessage(
//             'Last name should only contain characters from A-Z or a-z'
//         ),
//     body('username')
//         .notEmpty()
//         .withMessage('Username should not be empty')
//         .isLength({ min: 3 })
//         .withMessage('Username should be longer than 3 characters')
//         .isAlpha()
//         .withMessage(' Username should only contain characters from A-Z or a-z')
//         .escape(),
//     body('password').notEmpty().withMessage('Password should not be empty'),
// ];

module.exports = {
    // signUpValidators,
    validationResult,
    signUpSchema,
};
