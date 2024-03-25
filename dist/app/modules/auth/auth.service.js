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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const admin_model_1 = require("../admin/admin.model");
const userSignup = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_model_1.User.create(user);
    if (!newUser) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
    }
    return newUser.toObject();
});
const userLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    // user exists:
    const isUserExist = yield user_model_1.User.isUserExist(phoneNumber);
    if (!isUserExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // password matching:
    if (!isUserExist.password ||
        !(yield user_model_1.User.isPasswordMatched(password, isUserExist.password))) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    // create access token & refresh token
    const { _id, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify refresh token
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    console.log(verifiedToken);
    const { _id } = verifiedToken;
    // if user exist in database
    const isUserExist = (yield user_model_1.User.findById(_id)) || (yield admin_model_1.Admin.findById(_id));
    if (!isUserExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        _id: isUserExist._id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    userSignup,
    userLogin,
    refreshToken,
};
