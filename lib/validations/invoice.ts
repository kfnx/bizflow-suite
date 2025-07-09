import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { invoiceItems, invoices } from '@/lib/db/schema';

// Generate Zod schemas from Drizzle schema
export const invoiceItemSchema = createSelectSchema(invoiceItems);
export const invoiceSchema = createSelectSchema(invoices);

// Create schemas for API requests
export const createInvoiceItemSchema = createInsertSchema(invoiceItems).omit({
  id: true,
  invoiceId: true,
  createdAt: true,
});

export const createInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  invoiceNumber: true,
  subtotal: true,
  tax: true,
  total: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

// API request schemas
export const updateInvoiceRequestSchema = z.object({
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  currency: z.string().optional().default('IDR'),
  status: z.enum(['draft', 'sent', 'paid', 'void']).optional().default('draft'),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unitPrice: z.number().nonnegative('Unit price must be non-negative'),
        paymentTerms: z.string().optional(),
        termsAndConditions: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export type InvoiceFormData = z.infer<typeof updateInvoiceRequestSchema>;

// TypeScript interfaces for backward compatibility
export interface InvoiceItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  paymentTerms?: string;
  termsAndConditions?: string;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  invoiceDate?: string;
  dueDate?: string;
  customerId?: string;
  currency?: string;
  status?: string;
  paymentMethod?: string;
  notes?: string;
  items?: InvoiceItem[];
}