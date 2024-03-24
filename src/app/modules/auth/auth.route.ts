import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);
router.post(
  '/signup',
  validateRequest(AuthValidation.createUserZodSchema),
  AuthController.createUser,
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.createUser,
);

export const AuthRoutes = router;
