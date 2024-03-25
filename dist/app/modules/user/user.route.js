"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const users_1 = require("../../../enums/users");
const router = express_1.default.Router();
// access: specific admin, specific buyer, specific seller
router.get('/my-profile', (0, auth_1.default)(users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getUserProfile);
// access: specific admin, specific buyer, specific seller
router.patch('/my-profile', (0, validateRequest_1.default)(user_validation_1.UserValidation.updateProfileZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateUserProfile);
// access: admin
router.get('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getSingleUser);
// access: admin
router.delete('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteUser);
// access: admin
router.patch('/:id', (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateUser);
// access: admin
router.get('/', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
exports.UserRoutes = router;
