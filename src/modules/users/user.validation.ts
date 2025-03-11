import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name must be provided and must be a string',
      })
      .min(3)
      .max(50),
    email: z
      .string({
        required_error: 'Email must be provided and must be a string',
      })
      .email(),
    password: z
      .string({
        required_error: 'Password is required for your safety',
      })
      .max(20, { message: 'Password can not be more than 20 characters' }),
  }),
});
const updateUserValidationSchema = z.object({
  body: z.object({
    isBlocked: z
      .boolean({
        required_error: 'Its must be true or false',
      })
      .optional(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});
export const UserValidation = {
  userValidationSchema,
  updateUserValidationSchema,
  changePasswordValidationSchema,
};
