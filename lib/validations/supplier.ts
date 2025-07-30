import { z } from 'zod';

// Contact person schema for creation
export const supplierContactPersonSchema = z.object({
  prefix: z.enum(['Bapak', 'Ibu', 'Sdr.', 'Sdri.']).optional(),
  name: z.string().min(1, 'Contact person name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

// Supplier creation schema
export const createSupplierSchema = z.object({
  code: z.string().min(1, 'Supplier code is required'),
  name: z.string().min(1, 'Supplier name is required'),
  country: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  transactionCurrency: z.string().optional(),
  postalCode: z.string().optional(),
  contactPersons: z.array(supplierContactPersonSchema).optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
