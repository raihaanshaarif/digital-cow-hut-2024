import { z } from 'zod';

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

const updateUserZodSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: 'password is required!',
      })
      .optional(),
    name: z
      .object({
        firstName: z
          .string({
            required_error: 'First name is required',
          })
          .optional(),
        lastName: z
          .string({
            required_error: 'Last name is required',
          })
          .optional(),
      })
      .optional(),
    phoneNumber: z
      .string({
        required_error: 'phone number is required!',
      })
      .optional(),
    role: z
      .string({
        required_error: 'role is required!',
      })
      .optional(),
    address: z
      .string({
        required_error: 'address is required!',
      })
      .optional(),
    income: z.number().optional(),
    budget: z.number().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
