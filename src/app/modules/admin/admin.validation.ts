import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone number is required.' }),
    role: z.enum(['admin']).optional(),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(1, 'Password cannot be empty.'),
    name: z.object({
      firstName: z.string({ required_error: 'First name is required.' }),
      lastName: z.string({ required_error: 'Last name is required.' }),
    }),
    address: z.string({ required_error: 'Address is required.' }),
  }),
});
const adminLoginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'phone number is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
  adminLoginZodSchema,
};
