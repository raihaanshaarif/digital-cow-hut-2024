import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.post('/create-user', UserController.createUser);

router.get('/:id', UserController.getSingleUser);
router.get('/', UserController.getAllUsers);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser,
);
router.delete('/:id', UserController.deleteUser);

export default router;
