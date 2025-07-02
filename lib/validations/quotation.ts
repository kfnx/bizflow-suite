import { z } from 'zod';

export const quotationItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  notes: z.string().optional(),
});

export const createQuotationSchema = z.object({
  quotationDate: z.string().datetime('Invalid quotation date'),
  validUntil: z.string().datetime('Invalid valid until date'),
  customerId: z.string().uuid('Invalid customer ID'),
  approverId: z.string().uuid('Invalid approver ID').optional(),
  isIncludePPN: z.boolean().default(false),
  currency: z
    .string()
    .length(3, 'Currency must be 3 characters')
    .default('IDR'),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
});

export const updateQuotationSchema = z.object({
  quotationDate: z.string().datetime('Invalid quotation date').optional(),
  validUntil: z.string().datetime('Invalid valid until date').optional(),
  customerId: z.string().uuid('Invalid customer ID').optional(),
  approverId: z.string().uuid('Invalid approver ID').optional(),
  isIncludePPN: z.boolean().optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z
    .array(quotationItemSchema)
    .min(1, 'At least one item is required')
    .optional(),
});

export type CreateQuotationRequest = z.infer<typeof createQuotationSchema>;
export type UpdateQuotationRequest = z.infer<typeof updateQuotationSchema>;
export type QuotationItem = z.infer<typeof quotationItemSchema>;
