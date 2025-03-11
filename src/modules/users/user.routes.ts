import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.const';

const UserRoutes = Router();
UserRoutes.post(
  '/create-admin',
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.createUser,
);

UserRoutes.patch(
  '/:id/block',
  auth('admin'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUserActiveStatus,
);

// UserRoutes.patch(
//   '/change-password',
//   auth(USER_ROLE.customer),
//   validateRequest(UserValidation.changePasswordValidationSchema),
//   UserControllers.changePassword,
// );

UserRoutes.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.getUser,
);

export default UserRoutes;
