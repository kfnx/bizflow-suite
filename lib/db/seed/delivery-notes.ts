import { DELIVERY_NOTE_STATUS } from '../enum';
import {
  customerIds,
  deliveryNoteIds,
  invoiceIds,
  productIds,
  userIds,
} from './seed-constants';

export const deliveryNotes = [
  {
    id: deliveryNoteIds.deliveryNote1,
    deliveryNumber: 'DN/2025/05/001',
    invoiceId: invoiceIds.invoice1, // Paid invoice
    customerId: customerIds.customer3,
    deliveryDate: new Date('2025-05-05'),
    deliveryMethod: 'Truck Delivery',
    driverName: 'Ahmad Supriadi',
    vehicleNumber: 'B 1234 ABC',
    status: DELIVERY_NOTE_STATUS.DELIVERED,
    deliveredBy: userIds.user1,
    receivedBy: userIds.user3, // Customer representative
    notes: 'Bulldozer delivered successfully to construction site',
    createdBy: userIds.user1,
  },
  {
    id: deliveryNoteIds.deliveryNote2,
    deliveryNumber: 'DN/2025/07/001',
    invoiceId: invoiceIds.invoice2, // Sent invoice
    customerId: customerIds.customer2,
    deliveryDate: new Date('2025-07-25'),
    deliveryMethod: 'Truck Delivery',
    driverName: 'Budi Santoso',
    vehicleNumber: 'B 5678 DEF',
    status: DELIVERY_NOTE_STATUS.PENDING,
    deliveredBy: null,
    receivedBy: null,
    notes: 'JCB backhoe loader scheduled for delivery',
    createdBy: userIds.user2,
  },
  {
    id: deliveryNoteIds.deliveryNote3,
    deliveryNumber: 'DN/2025/09/001',
    invoiceId: invoiceIds.invoice5, // Paid invoice
    customerId: customerIds.customer5,
    deliveryDate: new Date('2025-09-10'),
    deliveryMethod: 'Truck Delivery',
    driverName: 'Rizky Pratama',
    vehicleNumber: 'B 9012 GHI',
    status: DELIVERY_NOTE_STATUS.DELIVERED,
    deliveredBy: userIds.user2,
    receivedBy: userIds.user4, // Customer representative
    notes: 'Caterpillar excavator delivered to mining site',
    createdBy: userIds.user2,
  },
  {
    id: deliveryNoteIds.deliveryNote4,
    deliveryNumber: 'DN/2025/08/001',
    invoiceId: invoiceIds.invoice4, // Sent invoice
    customerId: customerIds.customer4,
    deliveryDate: new Date('2025-08-15'),
    deliveryMethod: 'Customer Pickup',
    driverName: null,
    vehicleNumber: null,
    status: DELIVERY_NOTE_STATUS.DELIVERED,
    deliveredBy: userIds.user4,
    receivedBy: userIds.user1, // Customer representative
    notes: 'Bulldozer picked up by customer at warehouse',
    createdBy: userIds.user4,
  },
];

export const deliveryNoteItems = [
  {
    id: 'a0000001-0000-4000-a000-000000000001',
    deliveryNoteId: deliveryNoteIds.deliveryNote1,
    productId: productIds.product4,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Shantui DH08-B3-XL bulldozer delivered with full accessories',
  },
  {
    id: 'a0000002-0000-4000-a000-000000000001',
    deliveryNoteId: deliveryNoteIds.deliveryNote2,
    productId: productIds.product3,
    quantity: 1,
    deliveredQuantity: 0,
    notes: 'Wheel loader - pending delivery',
  },
  {
    id: 'a0000003-0000-4000-a000-000000000001',
    deliveryNoteId: deliveryNoteIds.deliveryNote3,
    productId: productIds.product5,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Excavator delivered with operator training',
  },
  {
    id: 'a0000004-0000-4000-a000-000000000001',
    deliveryNoteId: deliveryNoteIds.deliveryNote4,
    productId: productIds.product4,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Bulldozer picked up by customer',
  },
];
