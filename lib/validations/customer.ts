import { z } from 'zod';

// Contact person schema for creation
export const customerContactPersonSchema = z.object({
  prefix: z.enum(['Bapak', 'Ibu', 'Sdr.', 'Sdri.']).optional(),
  name: z.string().min(1, 'Contact person name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

// Customer creation schema
export const createCustomerSchema = z.object({
  code: z.string().min(1, 'Customer code is required'),
  name: z.string().min(1, 'Customer name is required'),
  type: z.enum(['individual', 'company']).default('individual'),
  npwp: z.string().optional(),
  npwp16: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  paymentTerms: z.string().optional(),
  contactPersons: z.array(customerContactPersonSchema).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
