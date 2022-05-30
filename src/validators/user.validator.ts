import { check, oneOf } from 'express-validator';
import { ValidationErrors } from '../shared/errors';

export const registerValidation = [
  check('name').bail().trim().notEmpty().withMessage(ValidationErrors.REQUIRED),
  check('email')
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ValidationErrors.REQUIRED),
  check('password')
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ValidationErrors.REQUIRED)
    .isLength({ min: 8, max: 25 })
    .withMessage('NUMBER_MIN_8_MAX_25'),
];

export const updateUserValidation = [
  oneOf(registerValidation, ValidationErrors.NO_UPDATE),
];
export const loginValidation = [
  check('email').trim().notEmpty().withMessage(ValidationErrors.REQUIRED),
  check('password').trim().notEmpty().withMessage(ValidationErrors.REQUIRED),
  check('rememberMe').optional().isBoolean(),
];
