import { check, oneOf } from 'express-validator';
import { ValidationErrors } from '../shared/errors';

const updatable = [
  check('name').bail().trim().notEmpty().withMessage(ValidationErrors.REQUIRED),
  check('password')
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ValidationErrors.REQUIRED)
    .isLength({ min: 8, max: 25 })
    .withMessage('NUMBER_MIN_8_MAX_25'),
];

export const registerValidation = [
  ...updatable,
  check('email')
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ValidationErrors.REQUIRED),
];

export const updateUserValidation = [
  oneOf(updatable, ValidationErrors.NO_UPDATE),
];
export const loginValidation = [
  check('email').trim().notEmpty().withMessage(ValidationErrors.REQUIRED),
  check('password').trim().notEmpty().withMessage(ValidationErrors.REQUIRED),
  check('rememberMe').optional().isBoolean(),
];
