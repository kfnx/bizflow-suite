import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'Branch name is required')
    .max(100, 'Branch name is too long'),
  address: z.string().max(1000, 'Address is too long').optional(),
  postalCode: z.string().max(20, 'Postal code is too long').optional(),
  phone: z.string().max(20, 'Phone number is too long').optional(),
  fax: z.string().max(20, 'Fax number is too long').optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email is too long')
    .optional(),
});

export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'Branch name is required')
    .max(100, 'Branch name is too long'),
  address: z.string().max(1000, 'Address is too long').optional(),
  postalCode: z.string().max(20, 'Postal code is too long').optional(),
  phone: z.string().max(20, 'Phone number is too long').optional(),
  fax: z.string().max(20, 'Fax number is too long').optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email is too long')
    .optional(),
});

export type CreateBranchData = z.infer<typeof createBranchSchema>;
export type UpdateBranchData = z.infer<typeof updateBranchSchema>;
