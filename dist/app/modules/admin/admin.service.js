"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const admin_model_1 = require("./admin.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // payload.role = 'admin';
    const newAdmin = yield admin_model_1.Admin.create(payload);
    if (!newAdmin) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
    }
    return newAdmin.toObject();
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    // admin exists:
    const isAdminExist = yield admin_model_1.Admin.isAdminExist(phoneNumber);
    if (!isAdminExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Admin does not exist');
    }
    // password matching:
    if (!isAdminExist.password ||
        !(yield admin_model_1.Admin.isPasswordMatched(password, isAdminExist.password))) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    // create access token & refresh token
    const { _id, role } = isAdminExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.AdminService = {
    createAdmin,
    loginAdmin,
};
