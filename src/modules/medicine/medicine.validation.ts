import { z } from 'zod';

export const createBiCycleProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required.' }),
    brand: z.string({ required_error: 'Brand is required.' }),
    price: z
      .number({ required_error: 'Price is required.' })
      .positive('Price must be a positive number.'),
    type: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
      required_error: 'Type is required.',
      invalid_type_error:
        'Invalid type. Choose from Mountain, Road, Hybrid, BMX, or Electric.',
    }),
    description: z.string({ required_error: 'Description is required.' }),
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .int('Quantity must be an integer.')
      .nonnegative('Quantity must be a non-negative number.'),
    inStock: z.boolean().default(true),
  }),
});

export const BiCycleProductValidationSchema = {
  createBiCycleProductValidationSchema,
};
