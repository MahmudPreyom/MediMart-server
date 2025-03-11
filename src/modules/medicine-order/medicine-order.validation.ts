import { z } from 'zod';

const createMedicineOrderValidationSchema = z.object({
  body: z.object({
    customer: z.string({ required_error: 'Customer must be provided' }),
    product: z.string({ required_error: 'Product must be selected' }),
    quantity: z
      .number({ required_error: 'Quantity must be provided' })
      .int('Quantity must be an integer')
      .positive('Quantity must be greater than zero'),
    totalPrice: z
      .number({ required_error: 'Total price must be provided' })
      .positive('Total price must be a positive number'),
    status: z
      .enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'])
      .optional(),
    prescriptionImage: z.string().optional(),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string().optional(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.string().optional(),
      })
      .optional(),
  }),
});

export const MedicineOrderValidationSchema = {
  createMedicineOrderValidationSchema,
};
