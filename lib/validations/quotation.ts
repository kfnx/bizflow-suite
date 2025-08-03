import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { quotationItems, quotations } from '@/lib/db/schema';

import { QUOTATION_STATUS } from '../db/enum';

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
  quotationNumber: z.string().min(1, 'Quotation number is required'),
  quotationDate: z.string().min(1, 'Quotation date is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  branchId: z.string().optional(),
  isIncludePPN: z.boolean().optional().default(false),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  status: z.enum(
    [
      QUOTATION_STATUS.DRAFT,
      QUOTATION_STATUS.SUBMITTED,
      QUOTATION_STATUS.APPROVED,
      QUOTATION_STATUS.SENT,
      QUOTATION_STATUS.ACCEPTED,
      QUOTATION_STATUS.REJECTED,
      QUOTATION_STATUS.REVISED,
    ],
    {
      errorMap: () => ({
        message: 'Status must be either DRAFT, SUBMITTED, or REJECTED',
      }),
    },
  ),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        name: z.string().min(1, 'Product name is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unitPrice: z.string().min(1, 'Unit price is required'),
        additionalSpecs: z.string().optional(),
        category: z.string().optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export type QuotationFormData = z.infer<typeof createQuotationRequestSchema>;

export const createQuotationDraftRequestSchema = z.object({
  quotationNumber: z.string().min(1, 'Quotation number is required'),
  quotationDate: z.string().min(1, 'Quotation date is required'),
  validUntil: z
    .string()
    .min(1, 'Valid until date is required')
    .optional()
    .default(new Date().toISOString()),
  customerId: z.string().min(1, 'Customer ID is required').optional(),
  isIncludePPN: z.boolean().optional().default(false),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  status: z.enum([QUOTATION_STATUS.DRAFT], {
    errorMap: () => ({ message: 'Status must be DRAFT' }),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unitPrice: z.string().min(1, 'Unit price is required'),
        notes: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

export const updateQuotationRequestSchema =
  createQuotationRequestSchema.partial();

export interface QuotationItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: string;
  category?: string;
  additionalSpecs?: string;
}

export interface CreateQuotationRequest {
  quotationDate: Date;
  validUntil: Date;
  customerId: string;
  isIncludePPN: boolean;
  notes?: string;
  termsAndConditions?: string;
  status: QUOTATION_STATUS;
  items: QuotationItem[];
}

export interface UpdateQuotationRequest {
  quotationNumber?: string;
  quotationDate?: string;
  validUntil?: string;
  status?: string;
  customerId?: string;
  approvedBy?: string;
  isIncludePPN?: boolean;
  notes?: string;
  termsAndConditions?: string;
  items?: QuotationItem[];
}

// Response type for GET /api/quotations/[id]
export interface QuotationResponse {
  data: {
    id: string;
    quotationNumber: string;
    quotationDate: string;
    validUntil: string;
    customerId: string | null;
    customerName: string | null;
    customerCode: string | null;
    customerType: string | null;
    customerAddress: string | null;
    customerContactPerson: string | null;
    customerContactPersonPrefix: string | null;
    customerContactPersonEmail: string | null;
    customerContactPersonPhone: string | null;
    branchId: string | null;
    branchName: string | null;
    approvedBy: string | null;
    isIncludePPN: boolean;
    subtotal: string;
    tax: string;
    total: string;
    status: QUOTATION_STATUS;
    notes: string | null;
    termsAndConditions: string | null;
    invoiceId: string | null;
    invoicedAt: string | null;
    createdBy: string;
    createdByUserPrefix: string | null;
    createdByUserFirstName: string | null;
    createdByUserLastName: string | null;
    createdByUserPhone: string | null;
    createdAt: string;
    updatedAt: string;
    items: QuotationItemResponse[];
  };
}

export interface QuotationItemResponse {
  id: string;
  productId: string;
  name: string | null;
  quantity: number;
  unitPrice: string;
  total: string;
  notes: string | null;
}
