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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const admin_model_1 = require("../admin/admin.model");
const user_constant_1 = require("./user.constant");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const users_1 = require("../../../enums/users");
// get all users:
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({}).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Users Not Found'));
    return users;
});
// get single user:
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found'));
    return result;
});
// update user:
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.User.exists({ _id: id }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found !'));
    if (Object.keys(payload).length < 1) {
        throw new Error('No data found to update');
    }
    const { name } = payload, UserData = __rest(payload, ["name"]);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            UserData[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, UserData, {
        new: true,
    }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to Update User or User not Found'));
    return result;
});
// delete user:
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to Delete User or User not Found'));
    return result;
});
const getUserProfile = (userAuthData) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, role } = userAuthData;
    // role ? admin | seller| buyer => model
    const UserModel = role === users_1.ENUM_USER_ROLE.ADMIN
        ? admin_model_1.Admin
        : role === users_1.ENUM_USER_ROLE.BUYER || role === users_1.ENUM_USER_ROLE.SELLER
            ? user_model_1.User
            : null;
    const userProfile = yield UserModel.findById(_id, user_constant_1.profileProjection)
        .lean()
        .orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to retrieve or User Not Found'));
    return userProfile;
});
const updateUserProfile = (userAuthData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, role } = userAuthData;
    // role ? admin | seller| buyer => model
    const UserModel = role === users_1.ENUM_USER_ROLE.ADMIN
        ? admin_model_1.Admin
        : role === users_1.ENUM_USER_ROLE.BUYER || role === users_1.ENUM_USER_ROLE.SELLER
            ? user_model_1.User
            : null;
    // role !== admin | buyer | seller
    if (!UserModel) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Role must be admin | buyer | seller');
    }
    // if user exists at database
    yield UserModel.exists({ _id }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found !'));
    // if data not sent from client-side
    if (Object.keys(payload).length < 1) {
        throw new Error('No data found to update');
    }
    const { name } = payload, UserData = __rest(payload, ["name"]);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            UserData[nameKey] = name[key];
        });
    }
    const result = yield UserModel.findOneAndUpdate({ _id }, UserData, {
        new: true,
    })
        .lean()
        .select(user_constant_1.profileProjection);
    return result;
});
exports.UserService = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getUserProfile,
    updateUserProfile,
};
