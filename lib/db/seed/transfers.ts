import { InsertTransfer, InsertTransferItem } from '../schema';
import { deliveryNoteIds } from './delivery-notes';
import { importIds } from './imports';
import { invoiceIds } from './invoices';
import { productIds } from './products';
import { userIds } from './users';
import { warehouseIds } from './warehouses';

export const transferIds = {
  transfer1: 't0000001-0000-4000-a000-000000000001',
  transfer2: 't0000002-0000-4000-a000-000000000001',
  transfer3: 't0000003-0000-4000-a000-000000000001',
  transfer4: 't0000004-0000-4000-a000-000000000001',
  transfer5: 't0000005-0000-4000-a000-000000000001',
  transfer6: 't0000006-0000-4000-a000-000000000001',
  transfer7: 't0000007-0000-4000-a000-000000000001',
  transfer8: 't0000008-0000-4000-a000-000000000001',
  transfer9: 't0000009-0000-4000-a000-000000000001',
  transfer10: 't000000a-0000-4000-a000-000000000001',
  transfer11: 't000000b-0000-4000-a000-000000000001',
  transfer12: 't000000c-0000-4000-a000-000000000001',
  transfer13: 't000000d-0000-4000-a000-000000000001',
  transfer14: 't000000e-0000-4000-a000-000000000001',
  transfer15: 't000000f-0000-4000-a000-000000000001',
};

export const transferItemIds = {
  transferItem1: 'ti000001-0000-4000-a000-000000000001',
  transferItem2: 'ti000002-0000-4000-a000-000000000001',
  transferItem3: 'ti000003-0000-4000-a000-000000000001',
  transferItem4: 'ti000004-0000-4000-a000-000000000001',
  transferItem5: 'ti000005-0000-4000-a000-000000000001',
  transferItem6: 'ti000006-0000-4000-a000-000000000001',
  transferItem7: 'ti000007-0000-4000-a000-000000000001',
  transferItem8: 'ti000008-0000-4000-a000-000000000001',
  transferItem9: 'ti000009-0000-4000-a000-000000000001',
  transferItem10: 'ti00000a-0000-4000-a000-000000000001',
  transferItem11: 'ti00000b-0000-4000-a000-000000000001',
  transferItem12: 'ti00000c-0000-4000-a000-000000000001',
  transferItem13: 'ti00000d-0000-4000-a000-000000000001',
  transferItem14: 'ti00000e-0000-4000-a000-000000000001',
  transferItem15: 'ti00000f-0000-4000-a000-000000000001',
};

export const transfers: InsertTransfer[] = [
  // Import 1 - Shantui wheel loader and spare parts
  {
    id: transferIds.transfer1,
    transferNumber: 'TRF/2024/001',
    warehouseIdFrom: null, // Import from external
    warehouseIdTo: warehouseIds.warehouse1,
    movementType: 'in',
    status: 'completed',
    transferDate: new Date('2024-01-15'),
    invoiceId: 'INV/CN/2024/001',
    deliveryId: null,
    notes: 'Import from China - Shantui wheel loaders and spare parts received',
    createdBy: userIds.admin_ho_jakarta,
    approvedBy: userIds.manager_kendari,
    approvedAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-15'),
  },

  // Import 2 - Wheel loader and maintenance kit
  {
    id: transferIds.transfer2,
    transferNumber: 'TRF/2024/002',
    warehouseIdFrom: null, // Import from external
    warehouseIdTo: warehouseIds.warehouse2,
    movementType: 'in',
    status: 'completed',
    transferDate: new Date('2024-01-20'),
    invoiceId: 'INV/CN/2024/002',
    deliveryId: null,
    notes:
      'Import from China - Wheel loader and maintenance kit received at Jakarta warehouse',
    createdBy: userIds.admin_ho_jakarta,
    approvedBy: userIds.manager_kendari,
    approvedAt: new Date('2024-01-20'),
    completedAt: new Date('2024-01-20'),
  },

  // Import 3 - Bulldozer equipment and accessories
  {
    id: transferIds.transfer3,
    transferNumber: 'TRF/2024/003',
    warehouseIdFrom: null, // Import from external
    warehouseIdTo: warehouseIds.warehouse1,
    movementType: 'in',
    status: 'completed',
    transferDate: new Date('2024-02-01'),
    invoiceId: 'INV/CN/2024/003',
    deliveryId: null,
    notes: 'Import from China - Bulldozer equipment and accessories received',
    createdBy: userIds.admin_ho_jakarta,
    approvedBy: userIds.manager_kendari,
    approvedAt: new Date('2024-02-01'),
    completedAt: new Date('2024-02-01'),
  },

  // Transfer from Jakarta to Surabaya
  {
    id: transferIds.transfer4,
    transferNumber: 'TRF/2024/004',
    warehouseIdFrom: warehouseIds.warehouse2, // From Jakarta
    warehouseIdTo: warehouseIds.warehouse3, // To Surabaya
    movementType: 'transfer',
    status: 'completed',
    transferDate: new Date('2024-02-10'),
    invoiceId: null,
    deliveryId: null,
    notes: 'Transfer wheel loader from Jakarta to Surabaya warehouse',
    createdBy: userIds.admin_ho_jakarta,
    approvedBy: userIds.manager_kendari,
    approvedAt: new Date('2024-02-10'),
    completedAt: new Date('2024-02-10'),
  },

  // Transfer from Surabaya to Bandung
  {
    id: transferIds.transfer5,
    transferNumber: 'TRF/2024/005',
    warehouseIdFrom: warehouseIds.warehouse3, // From Surabaya
    warehouseIdTo: warehouseIds.warehouse4, // To Bandung
    movementType: 'transfer',
    status: 'completed',
    transferDate: new Date('2024-02-15'),
    invoiceId: null,
    deliveryId: null,
    notes: 'Transfer wheel loader from Surabaya to Bandung warehouse',
    createdBy: userIds.admin_ho_jakarta,
    approvedBy: userIds.manager_kendari,
    approvedAt: new Date('2024-02-15'),
    completedAt: new Date('2024-02-15'),
  },

  // Sales-related transfer (OUT type)
  {
    id: transferIds.transfer6,
    transferNumber: 'TRF/2024/006',
    warehouseIdFrom: warehouseIds.warehouse2, // From Jakarta warehouse
    warehouseIdTo: warehouseIds.warehouse2, // To customer (external)
    movementType: 'out',
    status: 'completed',
    transferDate: new Date('2024-02-20'),
    invoiceId: 'INV/2025/04/001',
    deliveryId: deliveryNoteIds.deliveryNote1,
    notes: 'Sale of wheel loader to customer - delivered',
    createdBy: userIds.admin_ho_jakarta,
    approvedBy: userIds.manager_kendari,
    approvedAt: new Date('2024-02-20'),
    completedAt: new Date('2024-02-20'),
  },
];

export const transferItems: InsertTransferItem[] = [
  // Transfer 1 items (Import 1)
  {
    id: transferItemIds.transferItem1,
    transferId: transferIds.transfer1,
    productId: productIds.product1,
    quantity: 2,
    quantityTransferred: 2,
    notes: 'Shantui wheel loaders',
  },
  {
    id: transferItemIds.transferItem2,
    transferId: transferIds.transfer1,
    productId: productIds.product2,
    quantity: 10,
    quantityTransferred: 10,
    notes: 'Spare parts',
  },

  // Transfer 2 items (Import 2)
  {
    id: transferItemIds.transferItem3,
    transferId: transferIds.transfer2,
    productId: productIds.product2,
    quantity: 1,
    quantityTransferred: 1,
    notes: 'Wheel loader',
  },
  {
    id: transferItemIds.transferItem4,
    transferId: transferIds.transfer2,
    productId: productIds.product3,
    quantity: 2,
    quantityTransferred: 2,
    notes: 'Maintenance kit',
  },

  // Transfer 3 items (Import 3)
  {
    id: transferItemIds.transferItem5,
    transferId: transferIds.transfer3,
    productId: productIds.product4,
    quantity: 3,
    quantityTransferred: 3,
    notes: 'Bulldozer equipment',
  },
  {
    id: transferItemIds.transferItem6,
    transferId: transferIds.transfer3,
    productId: productIds.product5,
    quantity: 2,
    quantityTransferred: 2,
    notes: 'Accessories',
  },

  // Transfer 4 items (Jakarta to Surabaya)
  {
    id: transferItemIds.transferItem7,
    transferId: transferIds.transfer4,
    productId: productIds.product2,
    quantity: 1,
    quantityTransferred: 1,
    notes: 'Wheel loader transfer',
  },

  // Transfer 5 items (Surabaya to Bandung)
  {
    id: transferItemIds.transferItem8,
    transferId: transferIds.transfer5,
    productId: productIds.product1,
    quantity: 1,
    quantityTransferred: 1,
    notes: 'Wheel loader transfer',
  },

  // Transfer 6 items (Sale)
  {
    id: transferItemIds.transferItem9,
    transferId: transferIds.transfer6,
    productId: productIds.product3,
    quantity: 1,
    quantityTransferred: 1,
    notes: 'Wheel loader sale',
  },
];
