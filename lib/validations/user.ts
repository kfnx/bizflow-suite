import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  NIK: z.string().min(1, { message: 'NIK is required' }),
  jobTitle: z.string().optional(),
  joinDate: z.string().min(1, { message: 'Join date is required' }),
  type: z.enum(['full-time', 'contract', 'resigned']).optional(),

  branchId: z.string().min(1, { message: 'Branch is required' }),
  isAdmin: z.boolean().optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/(?=.*[a-z])/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter',
      }),
    // .regex(/(?=.*\d)/, {
    //   message: 'Password must contain at least one number',
    // }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  NIK: z.string().min(1, { message: 'NIK is required' }),
  jobTitle: z.string().optional(),
  joinDate: z.string().min(1, { message: 'Join date is required' }),
  type: z.enum(['full-time', 'contract', 'resigned']).optional(),

  branchId: z.string().min(1, { message: 'Branch is required' }),
  isActive: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

export interface LoginRequest {
  email: string;
  password: string;
}
