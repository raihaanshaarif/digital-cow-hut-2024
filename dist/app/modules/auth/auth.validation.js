"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("../user/user.constant");
const userSignupZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone Number is required',
        }),
        role: zod_1.z.enum([...user_constant_1.userRole], {
            required_error: 'Role is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password Number is required',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: 'First name is required',
            }),
            lastName: zod_1.z.string({
                required_error: 'Last name is required',
            }),
        }),
        address: zod_1.z.string({
            required_error: 'Address is required',
        }),
        budget: zod_1.z.number({
            required_error: 'Budget is required',
        }),
        income: zod_1.z.number({
            required_error: 'Income is required',
        }),
    }),
});
const userLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone Number is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password Number is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
exports.AuthValidation = {
    userSignupZodSchema,
    userLoginZodSchema,
    refreshTokenZodSchema,
};
