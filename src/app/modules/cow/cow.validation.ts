import { z } from 'zod';
import { breed, category, label, location } from './cow.constant';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required!',
    }),

    age: z.number({
      required_error: 'Age number is required!',
    }),
    price: z.number({
      required_error: 'Price is required!',
    }),
    location: z.enum([...location] as [string, ...string[]]),
    breed: z.enum([...breed] as [string, ...string[]]),
    weight: z.number({
      required_error: 'weight is required!',
    }),
    label: z.enum([...label] as [string, ...string[]]),
    category: z.enum([...category] as [string, ...string[]]),
    seller: z.string({
      required_error: 'Seller is required!',
    }),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'name is required!',
      })
      .optional(),

    age: z
      .number({
        required_error: 'Age number is required!',
      })
      .optional(),

    price: z
      .number({
        required_error: 'Price is required!',
      })
      .optional(),

    location: z.enum([...location] as [string, ...string[]]).optional(),

    breed: z.enum([...breed] as [string, ...string[]]).optional(),

    weight: z
      .number({
        required_error: 'weight is required!',
      })
      .optional(),

    label: z.enum([...label] as [string, ...string[]]).optional(),

    category: z.enum([...category] as [string, ...string[]]).optional(),

    seller: z
      .string({
        required_error: 'Seller is required!',
      })
      .optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
