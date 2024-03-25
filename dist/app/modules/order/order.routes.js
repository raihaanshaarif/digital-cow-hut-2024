"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const users_1 = require("../../../enums/users");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
// access: admin, specific buyer, specific seller
router.get('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER), order_controller_1.OrderController.getSingleOrder);
// access: admin, specific buyer, specific seller
router.get('/', (0, auth_1.default)(users_1.ENUM_USER_ROLE.ADMIN, users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER), order_controller_1.OrderController.getAllOrders);
// access: buyer
router.post('/', (0, validateRequest_1.default)(order_validation_1.OrderValidation.createOrderZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.BUYER), order_controller_1.OrderController.createOrder);
exports.OrderRoutes = router;
