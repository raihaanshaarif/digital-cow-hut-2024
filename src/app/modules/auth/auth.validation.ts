import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'ID is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});
const createUserZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'password is required!',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),
    phoneNumber: z.string({
      required_error: 'phone number is required!',
    }),
    role: z.string({
      required_error: 'role is required!',
    }),
    address: z.string({
      required_error: 'address is required!',
    }),
    income: z.number().optional(),
    budget: z.number().optional(),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  createUserZodSchema,
  refreshTokenZodSchema,
};
