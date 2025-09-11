import { z } from 'zod';

export const deliveryNoteItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const deliveryNoteFormSchema = z.object({
  deliveryNumber: z.string().optional(),
  invoiceId: z.string().optional(),
  quotationId: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  deliveryMethod: z.string().optional(),
  driverName: z.string().optional(),
  vehicleNumber: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(deliveryNoteItemSchema)
    .min(1, 'At least one item is required'),
});

export type DeliveryNoteFormData = z.infer<typeof deliveryNoteFormSchema>;
export type DeliveryNoteItem = z.infer<typeof deliveryNoteItemSchema>;
