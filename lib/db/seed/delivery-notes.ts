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
  deliveryNote5: '70000005-0000-4000-a000-000000000001',
};

export const deliveryNoteItemIds = {
  deliveryNoteItem1: 'a0000001-0000-4000-a000-000000000001',
  deliveryNoteItem2: 'a0000002-0000-4000-a000-000000000001',
  deliveryNoteItem3: 'a0000003-0000-4000-a000-000000000001',
  deliveryNoteItem4: 'a0000004-0000-4000-a000-000000000001',
  deliveryNoteItem5: 'a0000005-0000-4000-a000-000000000001',
  deliveryNoteItem6: 'a0000006-0000-4000-a000-000000000001',
  deliveryNoteItem7: 'a0000007-0000-4000-a000-000000000001',
  deliveryNoteItem8: 'a0000008-0000-4000-a000-000000000001',
  deliveryNoteItem9: 'a0000009-0000-4000-a000-000000000001',
  deliveryNoteItem10: 'a0000010-0000-4000-a000-000000000001',
  deliveryNoteItem11: 'a0000011-0000-4000-a000-000000000001',
  deliveryNoteItem12: 'a0000012-0000-4000-a000-000000000001',
  deliveryNoteItem13: 'a0000013-0000-4000-a000-000000000001',
  deliveryNoteItem14: 'a0000014-0000-4000-a000-000000000001',
  deliveryNoteItem15: 'a0000015-0000-4000-a000-000000000001',
  deliveryNoteItem16: 'a0000016-0000-4000-a000-000000000001',
  deliveryNoteItem17: 'a0000017-0000-4000-a000-000000000001',
  deliveryNoteItem18: 'a0000018-0000-4000-a000-000000000001',
  deliveryNoteItem19: 'a0000019-0000-4000-a000-000000000001',
  deliveryNoteItem20: 'a0000020-0000-4000-a000-000000000001',
  deliveryNoteItem21: 'a0000021-0000-4000-a000-000000000001',
  deliveryNoteItem22: 'a0000022-0000-4000-a000-000000000001',
  deliveryNoteItem23: 'a0000023-0000-4000-a000-000000000001',
  deliveryNoteItem24: 'a0000024-0000-4000-a000-000000000001',
  deliveryNoteItem25: 'a0000025-0000-4000-a000-000000000001',
  deliveryNoteItem26: 'a0000026-0000-4000-a000-000000000001',
  deliveryNoteItem27: 'a0000027-0000-4000-a000-000000000001',
  deliveryNoteItem28: 'a0000028-0000-4000-a000-000000000001',
  deliveryNoteItem29: 'a0000029-0000-4000-a000-000000000001',
  deliveryNoteItem30: 'a0000030-0000-4000-a000-000000000001',
  deliveryNoteItem31: 'a0000031-0000-4000-a000-000000000001',
  deliveryNoteItem32: 'a0000032-0000-4000-a000-000000000001',
  deliveryNoteItem33: 'a0000033-0000-4000-a000-000000000001',
  deliveryNoteItem34: 'a0000034-0000-4000-a000-000000000001',
  deliveryNoteItem35: 'a0000035-0000-4000-a000-000000000001',
  deliveryNoteItem36: 'a0000036-0000-4000-a000-000000000001',
  deliveryNoteItem37: 'a0000037-0000-4000-a000-000000000001',
  deliveryNoteItem38: 'a0000038-0000-4000-a000-000000000001',
  deliveryNoteItem39: 'a0000039-0000-4000-a000-000000000001',
  deliveryNoteItem40: 'a0000040-0000-4000-a000-000000000001',
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
    receivedBy: userIds.user4, // Customer representative
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
  {
    id: deliveryNoteIds.deliveryNote5,
    deliveryNumber: 'DN/2025/09/005',
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
];

export const deliveryNoteItems = [
  // Delivery Note 1 - Multiple items (Bulldozer + Spare parts)
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
    deliveryNoteId: deliveryNoteIds.deliveryNote1,
    productId: productIds.product7,
    quantity: 2,
    deliveredQuantity: 2,
    notes: 'Spare parts for bulldozer maintenance kit',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem3,
    deliveryNoteId: deliveryNoteIds.deliveryNote1,
    productId: productIds.product8,
    quantity: 50,
    deliveredQuantity: 50,
    notes: 'Hydraulic oil for bulldozer operation',
  },

  // Delivery Note 2 - Multiple items (Wheel Loader + Accessories)
  {
    id: deliveryNoteItemIds.deliveryNoteItem4,
    deliveryNoteId: deliveryNoteIds.deliveryNote2,
    productId: productIds.product3,
    quantity: 1,
    deliveredQuantity: 0,
    notes: 'Wheel loader - pending delivery',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem5,
    deliveryNoteId: deliveryNoteIds.deliveryNote2,
    productId: productIds.product7,
    quantity: 1,
    deliveredQuantity: 0,
    notes: 'Spare parts kit for wheel loader',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem6,
    deliveryNoteId: deliveryNoteIds.deliveryNote2,
    productId: productIds.product8,
    quantity: 30,
    deliveredQuantity: 0,
    notes: 'Engine oil for wheel loader',
  },

  // Delivery Note 3 - Multiple items (Excavator + Training + Parts)
  {
    id: deliveryNoteItemIds.deliveryNoteItem7,
    deliveryNoteId: deliveryNoteIds.deliveryNote3,
    productId: productIds.product5,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Excavator delivered with operator training',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem8,
    deliveryNoteId: deliveryNoteIds.deliveryNote3,
    productId: productIds.product7,
    quantity: 3,
    deliveredQuantity: 3,
    notes: 'Spare parts for excavator maintenance',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem9,
    deliveryNoteId: deliveryNoteIds.deliveryNote3,
    productId: productIds.product8,
    quantity: 40,
    deliveredQuantity: 40,
    notes: 'Hydraulic oil for excavator operation',
  },

  // Delivery Note 4 - Multiple items (Bulldozer + Customer Pickup)
  {
    id: deliveryNoteItemIds.deliveryNoteItem10,
    deliveryNoteId: deliveryNoteIds.deliveryNote4,
    productId: productIds.product4,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Bulldozer picked up by customer',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem11,
    deliveryNoteId: deliveryNoteIds.deliveryNote4,
    productId: productIds.product7,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Spare parts kit included with bulldozer',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem12,
    deliveryNoteId: deliveryNoteIds.deliveryNote4,
    productId: productIds.product8,
    quantity: 25,
    deliveredQuantity: 25,
    notes: 'Initial oil supply for bulldozer',
  },

  // Delivery Note 5 - Multiple items (Caterpillar + Komatsu + Parts)
  {
    id: deliveryNoteItemIds.deliveryNoteItem13,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product6,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Caterpillar D6T bulldozer delivered to mining site',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem14,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product9,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Komatsu PC200-8 excavator delivered to mining site',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem15,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product7,
    quantity: 4,
    deliveredQuantity: 4,
    notes: 'Comprehensive spare parts kit for both machines',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem16,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product8,
    quantity: 100,
    deliveredQuantity: 100,
    notes: 'Bulk oil supply for mining operations',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem17,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product1,
    quantity: 2,
    deliveredQuantity: 2,
    notes: 'JCB 3DX backhoe loaders for mining support operations',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem18,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product2,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Volvo L90 wheel loader for material handling at mining site',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem19,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product3,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Additional wheel loader for backup operations',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem20,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product4,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Shantui bulldozer for site preparation and maintenance',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem21,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product5,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Additional excavator for increased mining capacity',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem22,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product6,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Caterpillar D7G bulldozer for heavy earthmoving tasks',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem23,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product7,
    quantity: 8,
    deliveredQuantity: 8,
    notes: 'Extended spare parts inventory for all mining equipment',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem24,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product8,
    quantity: 200,
    deliveredQuantity: 200,
    notes: 'Additional hydraulic and engine oil for extended operations',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem25,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product9,
    quantity: 1,
    deliveredQuantity: 1,
    notes: 'Komatsu PC300-8 excavator for large-scale mining operations',
  },
  {
    id: deliveryNoteItemIds.deliveryNoteItem26,
    deliveryNoteId: deliveryNoteIds.deliveryNote5,
    productId: productIds.product7,
    quantity: 6,
    deliveredQuantity: 6,
    notes: 'Specialized spare parts for Komatsu equipment',
  },
];
