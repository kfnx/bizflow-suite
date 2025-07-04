import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { quotationItems, quotations } from '@/lib/db/schema';

// Generate Zod schemas from Drizzle schema
export const quotationItemSchema = createSelectSchema(quotationItems);
export const quotationSchema = createSelectSchema(quotations);

// Create schemas for API requests
export const createQuotationItemSchema = createInsertSchema(
  quotationItems,
).omit({
  id: true,
  quotationId: true,
  createdAt: true,
});

export const createQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  quotationNumber: true,
  subtotal: true,
  tax: true,
  total: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

// API request schemas
export const createQuotationRequestSchema = z.object({
  quotationDate: z.string().min(1, 'Quotation date is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  approverId: z.string().min(1, 'Approver ID is required'),
  isIncludePPN: z.boolean().optional().default(false),
  currency: z.string().optional().default('IDR'),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unitPrice: z.number().nonnegative('Unit price must be non-negative'),
        notes: z.string().optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export const updateQuotationSchema = createQuotationRequestSchema.partial();

// TypeScript interfaces for backward compatibility
export interface QuotationItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreateQuotationRequest {
  quotationDate: string;
  validUntil: string;
  customerId: string;
  approverId: string;
  isIncludePPN?: boolean;
  currency?: string;
  notes?: string;
  termsAndConditions?: string;
  items: QuotationItem[];
}

export interface UpdateQuotationRequest {
  quotationDate?: string;
  validUntil?: string;
  customerId?: string;
  approverId?: string;
  isIncludePPN?: boolean;
  currency?: string;
  notes?: string;
  termsAndConditions?: string;
  items?: QuotationItem[];
}
