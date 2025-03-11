import { z } from 'zod';

const createBiCycleOrderValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product must be selected' }),
    quantity: z.string({ required_error: 'Quantity must be provided' }),
  }),
});

export const BiCycleOrderValidationSchema = {
  createBiCycleOrderValidationSchema,
};
