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
  quotationId: z.string().optional(),
  branchId: z.string().optional(),
  contractNumber: z.string().optional(),
  customerPoNumber: z.string().optional(),
  currency: z.string().optional().default('IDR'),
  status: z.enum(['draft', 'sent', 'paid', 'void']).optional().default('draft'),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  salesmanUserId: z.string().optional(),
  isIncludePPN: z.boolean().optional().default(false),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        name: z.string().min(1, 'Product name is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unitPrice: z
          .string()
          .min(1, 'Unit price is required')
          .refine(
            (val) => !isNaN(Number(val)) && Number(val) > 0,
            'Unit price must be a valid positive number',
          ),
        additionalSpecs: z.string().optional(),
        category: z.string().optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export type InvoiceFormData = z.infer<typeof updateInvoiceRequestSchema>;

// TypeScript interfaces for backward compatibility
export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: string;
  category?: string;
  additionalSpecs?: string;
}

export interface UpdateInvoiceRequest {
  invoiceDate?: string;
  dueDate?: string;
  customerId?: string;
  branchId?: string;
  currency?: string;
  status?: string;
  paymentTerms?: string;
  notes?: string;
  items?: InvoiceItem[];
}
