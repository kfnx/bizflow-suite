import { z } from 'zod';

// Base product schema for different categories
const baseProductSchema = z.object({
  productId: z.string().uuid().optional(), // If provided, update existing product
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['serialized', 'non_serialized', 'bulk']),
  brandId: z.string().optional(),
  condition: z.enum(['new', 'used', 'refurbished']).default('new'),
  year: z.number().int().min(1900).max(2100).optional(),
  priceRMB: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid RMB price'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  notes: z.string().optional(),
});

// Serialized product schema
const serializedProductSchema = baseProductSchema.extend({
  category: z.literal('serialized'),
  machineTypeId: z
    .string()
    .min(1, 'Machine type is required for serialized products'),
  unitOfMeasureId: z
    .string()
    .transform((str) => (str === '' ? null : str))
    .nullish(), // NULL for serialized
  modelOrPartNumber: z.string().max(100).optional(),
  machineNumber: z.string().max(100).optional(),
  engineNumber: z.string().max(100).optional(),
  serialNumber: z.string().max(100),
  model: z.string().max(100).optional(),
  engineModel: z.string().max(100).optional(),
  enginePower: z.string().max(50).optional(),
  operatingWeight: z.string().max(50).optional(),
  // These should be null for serialized
  batchOrLotNumber: z.string().nullish(),
  id: z.string().uuid().optional(), // For updating existing items
});

// Non-serialized product schema
const nonSerializedProductSchema = baseProductSchema.extend({
  category: z.literal('non_serialized'),
  unitOfMeasureId: z
    .string()
    .min(1, 'Unit of measure is required for non-serialized products'),
  batchOrLotNumber: z.string().max(100).optional(),
  // These should be null for non-serialized
  machineTypeId: z.string().nullish(),
  modelOrPartNumber: z.string().nullish(),
  machineNumber: z.string().nullish(),
  engineNumber: z.string().nullish(),
  serialNumber: z.string().nullish(),
  model: z.string().nullish(),
  engineModel: z.string().nullish(),
  enginePower: z.string().nullish(),
  operatingWeight: z.string().nullish(),
  id: z.string().uuid().optional(), // For updating existing items
});

// Bulk product schema
const bulkProductSchema = baseProductSchema.extend({
  category: z.literal('bulk'),
  unitOfMeasureId: z
    .string()
    .min(1, 'Unit of measure is required for bulk products'),
  modelOrPartNumber: z.string().max(100).optional(),
  batchOrLotNumber: z.string().max(100).optional(),
  // These should be null for bulk
  machineTypeId: z.string().nullish(),
  machineNumber: z.string().nullish(),
  engineNumber: z.string().nullish(),
  serialNumber: z.string().nullish(),
  model: z.string().nullish(),
  engineModel: z.string().nullish(),
  enginePower: z.string().nullish(),
  operatingWeight: z.string().nullish(),
  id: z.string().uuid().optional(), // For updating existing items
});

// Discriminated union for product types
const productItemSchema = z.discriminatedUnion('category', [
  serializedProductSchema,
  nonSerializedProductSchema,
  bulkProductSchema,
]);

// Import request validation schemas
export const createImportRequestSchema = z.object({
  supplierId: z.string().uuid({ message: 'Invalid supplier ID' }),
  warehouseId: z.string().uuid({ message: 'Invalid warehouse ID' }),
  importDate: z.string().transform((str) => new Date(str)),
  invoiceNumber: z
    .string()
    .min(1, { message: 'Invoice number is required' })
    .max(50),
  invoiceDate: z.string().transform((str) => new Date(str)),
  exchangeRateRMBtoIDR: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Invalid exchange rate' }),
  notes: z.string().optional(),
  items: z
    .array(productItemSchema)
    .min(1, { message: 'At least one product item is required' }),
});

export const updateImportRequestSchema = z.object({
  supplierId: z.string().uuid().optional(),
  warehouseId: z.string().uuid().optional(),
  importDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  invoiceNumber: z.string().min(1).max(50).optional(),
  invoiceDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  exchangeRateRMBtoIDR: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  status: z.enum(['pending', 'verified']).optional(),
  notes: z.string().optional(),
  // Items can be updated, added, or removed
  items: z.array(productItemSchema).optional(),
});

export const importQueryParamsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'verified', 'all']).optional(),
  supplierId: z.string().uuid().optional(),
  warehouseId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  dateFrom: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  dateTo: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  sortBy: z
    .enum([
      'date-asc',
      'date-desc',
      'status-asc',
      'status-desc',
      'supplier-asc',
      'supplier-desc',
      'total-asc',
      'total-desc',
    ])
    .optional(),
  page: z
    .string()
    .transform((str) => parseInt(str))
    .default('1'),
  limit: z
    .string()
    .transform((str) => parseInt(str))
    .default('10'),
});

// Type exports
export type CreateImportRequest = z.infer<typeof createImportRequestSchema>;
export type UpdateImportRequest = z.infer<typeof updateImportRequestSchema>;
export type ImportQueryParams = z.infer<typeof importQueryParamsSchema>;
