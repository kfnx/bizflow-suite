import { customerIds } from './customers';
import { invoiceIds } from './invoices';
import { productIds } from './products';
import { userIds } from './users';

export const deliveryNoteIds = {
  deliveryNote1: 'dln00001-0000-0000-0000-000000000001',
  deliveryNote2: 'dln00002-0000-0000-0000-000000000002',
  deliveryNote3: 'dln00003-0000-0000-0000-000000000003',
  deliveryNote4: 'dln00004-0000-0000-0000-000000000004',
};

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
    status: 'delivered',
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
    status: 'pending',
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
    status: 'delivered',
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
    status: 'delivered',
    deliveredBy: userIds.user4,
    receivedBy: userIds.user1, // Customer representative
    notes: 'Bulldozer picked up by customer at warehouse',
    createdBy: userIds.user4,
  },
];

export const deliveryNoteItems = [
  {
    id: 'dit00001-0000-0000-0000-000000000001',
    deliveryNoteId: deliveryNoteIds.deliveryNote1,
    productId: productIds.product4,
    quantity: '1.00',
    deliveredQuantity: '1.00',
    notes: 'Shantui DH08-B3-XL bulldozer delivered with full accessories',
  },
  {
    id: 'dit00002-0000-0000-0000-000000000002',
    deliveryNoteId: deliveryNoteIds.deliveryNote2,
    productId: productIds.product15,
    quantity: '1.00',
    deliveredQuantity: '0.00',
    notes: 'JCB 3DX backhoe loader - pending delivery',
  },
  {
    id: 'dit00003-0000-0000-0000-000000000003',
    deliveryNoteId: deliveryNoteIds.deliveryNote3,
    productId: productIds.product11,
    quantity: '1.00',
    deliveredQuantity: '1.00',
    notes: 'Caterpillar 320 excavator delivered with operator training',
  },
  {
    id: 'dit00004-0000-0000-0000-000000000004',
    deliveryNoteId: deliveryNoteIds.deliveryNote4,
    productId: productIds.product8,
    quantity: '1.00',
    deliveredQuantity: '1.00',
    notes: 'Shantui SD16F bulldozer picked up by customer',
  },
];
