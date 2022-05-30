import { isAuth } from './../middlewares/auth.middleware';
import { Router } from 'express';

import { userController } from '../controllers';
import { userValidators } from '../validators';

import {
  catchValidationError,
  catchValidationErrorForUpdates,
} from '../middlewares/validationError';

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

router.patch(
  '/',
  isAuth,
  userValidators.updateUserValidation,
  catchValidationErrorForUpdates,
  userController.updateOne
);

export default router;
