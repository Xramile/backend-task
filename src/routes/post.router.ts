import { Router } from 'express';

import { postController } from '../controllers';
import { postValidators } from '../validators';

import {
  catchValidationError,
  catchValidationErrorForUpdates,
} from '../middlewares/validationError';
import { isAuth } from '../middlewares/auth.middleware';

const router = Router();

router
  .route('/')
  .get(
    postValidators.queryValidators,
    catchValidationError,
    postController.getAll
  )
  .post(
    isAuth,
    postValidators.postValidation,
    catchValidationError,
    postController.create
  );

router
  .route('/:postId')
  .get(postController.getOne)
  .patch(
    isAuth,
    postValidators.updatePostValidation,
    catchValidationErrorForUpdates,
    postController.updateOne
  )
  .delete(isAuth, postController.deleteOne);

export default router;
