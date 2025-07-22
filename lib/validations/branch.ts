import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'Branch name is required')
    .max(100, 'Branch name is too long'),
});

export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'Branch name is required')
    .max(100, 'Branch name is too long'),
});

export type CreateBranchData = z.infer<typeof createBranchSchema>;
export type UpdateBranchData = z.infer<typeof updateBranchSchema>;
