import { DELIVERY_NOTE_STATUS } from '../enum';
import { branchIds } from './branches';
import { customerIds } from './customers';
import { invoiceIds } from './invoices';
import { productIds } from './products';
import { userIds } from './users';

export const deliveryNoteIds = {
  deliveryNote1: '70000001-0000-4000-a000-000000000001',
  deliveryNote2: '70000002-0000-4000-a000-000000000001',
  deliveryNote3: '70000003-0000-4000-a000-000000000001',
  deliveryNote4: '70000004-0000-4000-a000-000000000001',
};

export const deliveryNoteItemIds = {
  deliveryNoteItem1: 'a0000001-0000-4000-a000-000000000001',
  deliveryNoteItem2: 'a0000002-0000-4000-a000-000000000001',
  deliveryNoteItem3: 'a0000003-0000-4000-a000-000000000001',
  deliveryNoteItem4: 'a0000004-0000-4000-a000-000000000001',
};

export const deliveryNotes = [
  {
    id: deliveryNoteIds.deliveryNote1,
    deliveryNumber: 'DN/2025/05/001',
    invoiceId: invoiceIds.invoice1, // Paid invoice
    customerId: customerIds.customer3,
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    deliveryDate: new Date('2025-05-05'),
    deliveryMethod: 'Truck Delivery',
    driverName: 'Ahmad Supriadi',
    vehicleNumber: 'B 1234 ABC',
    status: DELIVERY_NOTE_STATUS.DELIVERED,
    deliveredBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
    receivedBy: userIds.user3, // Customer representative
    notes: 'Bulldozer delivered successfully to construction site',
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: deliveryNoteIds.deliveryNote2,
    deliveryNumber: 'DN/2025/07/001',
    invoiceId: invoiceIds.invoice2, // Sent invoice
    customerId: customerIds.customer2,
    branchId: branchIds.pekanbaru, // Created by Asep at Pekanbaru branch
    deliveryDate: new Date('2025-07-25'),
    deliveryMethod: 'Truck Delivery',
    driverName: 'Budi Santoso',
    vehicleNumber: 'B 5678 DEF',
    status: DELIVERY_NOTE_STATUS.PENDING,
    deliveredBy: null,
    receivedBy: null,
    notes: 'JCB backhoe loader scheduled for delivery',
    createdBy: userIds.staff_pekanbaru, // Asep - Pekanbaru branch
  },
  {
    id: deliveryNoteIds.deliveryNote3,
    deliveryNumber: 'DN/2025/09/001',
    invoiceId: invoiceIds.invoice5, // Paid invoice
    customerId: customerIds.customer5,
    branchId: branchIds.kendari, // Created by Budi at Kendari branch
    deliveryDate: new Date('2025-09-10'),
    deliveryMethod: 'Truck Delivery',
    driverName: 'Rizky Pratama',
    vehicleNumber: 'B 9012 GHI',
    status: DELIVERY_NOTE_STATUS.DELIVERED,
    deliveredBy: userIds.manager_kendari, // Budi - Kendari branch
    receivedBy: userIds.user4, // Customer representative
    notes: 'Caterpillar excavator delivered to mining site',
    createdBy: userIds.manager_kendari, // Budi - Kendari branch
  },
  {
    id: deliveryNoteIds.deliveryNote4,
    deliveryNumber: 'DN/2025/08/001',
    invoiceId: invoiceIds.invoice4, // Sent invoice
    customerId: customerIds.customer4,
    branchId: branchIds.balikpapan, // Created by Rini at Balikpapan branch
    deliveryDate: new Date('2025-08-15'),
    deliveryMethod: 'Customer Pickup',
    driverName: null,
    vehicleNumber: null,
    status: DELIVERY_NOTE_STATUS.DELIVERED,
    deliveredBy: userIds.user4, // Rini - Balikpapan branch
    receivedBy: userIds.staff_pekanbaru, // Customer representative
    notes: 'Bulldozer picked up by customer at warehouse',
    createdBy: userIds.user4, // Rini - Balikpapan branch
  },
];

export const deliveryNoteItems = [
  {
    id: deliveryNoteItemIds.deliveryNoteItem1,
    deliveryNoteId: deliveryNoteIds.deliveryNote1,
    productId: productIds.product4,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Shantui DH08-B3-XL bulldozer delivered with full accessories',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem2,
    deliveryNoteId: deliveryNoteIds.deliveryNote2,
    productId: productIds.product3,
    quantity: 1,
    deliveredQuantity: 0,
    notes: 'Wheel loader - pending delivery',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem3,
    deliveryNoteId: deliveryNoteIds.deliveryNote3,
    productId: productIds.product5,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Excavator delivered with operator training',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem4,
    deliveryNoteId: deliveryNoteIds.deliveryNote4,
    productId: productIds.product4,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Bulldozer picked up by customer',
  },
];
