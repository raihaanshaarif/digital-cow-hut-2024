"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cow_controller_1 = require("./cow.controller");
const cow_validation_1 = require("./cow.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const users_1 = require("../../../enums/users");
const router = express_1.default.Router();
// access: buyer, seller, admin
router.get('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.ADMIN), cow_controller_1.CowController.getSingleCow);
// access: specific seller of the cow
router.delete('/:id', (0, auth_1.default)(users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.deleteCow);
// access: specific seller of the cow
router.patch('/:id', (0, validateRequest_1.default)(cow_validation_1.CowValidation.updateCowZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.updateCow);
// access: buyer, seller, admin
router.get('/', (0, auth_1.default)(users_1.ENUM_USER_ROLE.BUYER, users_1.ENUM_USER_ROLE.SELLER, users_1.ENUM_USER_ROLE.ADMIN), cow_controller_1.CowController.getAllCows);
// access: seller
router.post('/create-cow', (0, validateRequest_1.default)(cow_validation_1.CowValidation.createCowZodSchema), (0, auth_1.default)(users_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.createCow);
exports.CowRoutes = router;
