import { check, oneOf } from 'express-validator';

const updatable = [
  check('title').bail().trim().notEmpty().withMessage('REQUIRED'),
  check('content').bail().trim().notEmpty().withMessage('REQUIRED'),
];

export const postValidation = [
  ...updatable,
  check('user')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('REQUIRED')
    .isMongoId()
    .withMessage('NOT_VALID'),
];

export const updatePostValidation = [oneOf(updatable, 'NO_UPDATE')];

export const queryValidators = [
  check('title').optional(),
  check('user').optional().isMongoId().withMessage('NOT_VALID'),
  check('sortBy').optional(),
  check('sortType').optional().isIn([1, -1]),
  check('page').optional().isInt({ min: 0 }).withMessage('NUMBER_MIN_0'),
  check('limit').optional().isInt({ min: 0 }).withMessage('NUMBER_MIN_0'),
];
