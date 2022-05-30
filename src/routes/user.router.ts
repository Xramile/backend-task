import { Router } from 'express';

import { userController } from '../controllers';
import { userValidators } from '../validators';

import { catchValidationError } from '../middlewares/validationError';

const router = Router();

router.post(
  '/register/',
  userValidators.registerValidation,
  catchValidationError,
  userController.register
);

router.post(
  '/login/',
  userValidators.loginValidation,
  catchValidationError,
  userController.login
);

export default router;
