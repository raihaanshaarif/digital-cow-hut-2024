"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileProjection = exports.userRole = void 0;
exports.userRole = ['seller', 'buyer'];
// profile field projection:
exports.profileProjection = {
    name: 1,
    phoneNumber: 1,
    address: 1,
    _id: 0,
};
