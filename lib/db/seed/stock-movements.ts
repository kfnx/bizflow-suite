import { stockMovements as stockMovementsSchema } from '../schema';
import {
  deliveryNoteIds,
  importIds,
  invoiceIds,
  productIds,
  stockMovementIds,
  warehouseIds,
} from './seed-constants';

export type NewStockMovement = typeof stockMovementsSchema.$inferInsert;

export const stockMovements: NewStockMovement[] = [
  // Import-related stock movements (IN type)
  // Import 1 - Shantui wheel loader (2 units)
  {
    id: stockMovementIds.stockMovement1,
    warehouseIdFrom: warehouseIds.warehouse1, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse1, // To warehouse
    productId: productIds.product1,
    quantity: 2,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-001',
    deliveryId: null,
    notes: 'Import from China - Shantui wheel loaders received',
  },

  // Import 1 - Additional product (spare parts - 10 units)
  {
    id: stockMovementIds.stockMovement2,
    warehouseIdFrom: warehouseIds.warehouse1, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse1, // To warehouse
    productId: productIds.product2,
    quantity: 10,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-001',
    deliveryId: null,
    notes: 'Import from China - Spare parts received',
  },

  // Import 2 - Wheel loader (1 unit)
  {
    id: stockMovementIds.stockMovement3,
    warehouseIdFrom: warehouseIds.warehouse2, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse2, // To warehouse
    productId: productIds.product2,
    quantity: 1,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-002',
    deliveryId: null,
    notes: 'Import from China - Wheel loader received at Jakarta warehouse',
  },

  // Import 2 - Maintenance kit (2 units)
  {
    id: stockMovementIds.stockMovement4,
    warehouseIdFrom: warehouseIds.warehouse2, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse2, // To warehouse
    productId: productIds.product3,
    quantity: 2,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-002',
    deliveryId: null,
    notes: 'Import from China - Maintenance kit received',
  },

  // Import 3 - Bulldozer equipment (3 units)
  {
    id: stockMovementIds.stockMovement5,
    warehouseIdFrom: warehouseIds.warehouse1, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse1, // To warehouse
    productId: productIds.product4,
    quantity: 3,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-003',
    deliveryId: null,
    notes: 'Import from China - Bulldozer equipment received',
  },

  // Import 3 - Accessories (2 units)
  {
    id: stockMovementIds.stockMovement6,
    warehouseIdFrom: warehouseIds.warehouse1, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse1, // To warehouse
    productId: productIds.product5,
    quantity: 2,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-003',
    deliveryId: null,
    notes: 'Import from China - Accessories received',
  },

  // Import 4 - Wheel loader (1 unit)
  {
    id: stockMovementIds.stockMovement7,
    warehouseIdFrom: warehouseIds.warehouse3, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse3, // To warehouse
    productId: productIds.product1,
    quantity: 1,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-004',
    deliveryId: null,
    notes: 'Import from China - Wheel loader received at Surabaya warehouse',
  },

  // Import 4 - Consumables (20 units)
  {
    id: stockMovementIds.stockMovement8,
    warehouseIdFrom: warehouseIds.warehouse3, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse3, // To warehouse
    productId: productIds.product2,
    quantity: 20,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-004',
    deliveryId: null,
    notes: 'Import from China - Consumables received',
  },

  // Import 5 - Wheel loader batch (4 units)
  {
    id: stockMovementIds.stockMovement9,
    warehouseIdFrom: warehouseIds.warehouse2, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse2, // To warehouse
    productId: productIds.product3,
    quantity: 4,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-005',
    deliveryId: null,
    notes: 'Import from China - Wheel loader batch received',
  },

  // Import 5 - Tools (5 units)
  {
    id: stockMovementIds.stockMovement10,
    warehouseIdFrom: warehouseIds.warehouse2, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse2, // To warehouse
    productId: productIds.product4,
    quantity: 5,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-005',
    deliveryId: null,
    notes: 'Import from China - Tools received',
  },

  // Import 6 - High-value excavator (1 unit)
  {
    id: stockMovementIds.stockMovement11,
    warehouseIdFrom: warehouseIds.warehouse1, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse1, // To warehouse
    productId: productIds.product5,
    quantity: 1,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-006',
    deliveryId: null,
    notes: 'Import from China - High-value excavator received',
  },

  // Import 6 - Safety equipment (3 units)
  {
    id: stockMovementIds.stockMovement12,
    warehouseIdFrom: warehouseIds.warehouse1, // From supplier (external)
    warehouseIdTo: warehouseIds.warehouse1, // To warehouse
    productId: productIds.product1,
    quantity: 3,
    movementType: 'in',
    invoiceId: 'INV-CN-2024-006',
    deliveryId: null,
    notes: 'Import from China - Safety equipment received',
  },

  // Transfer movements between warehouses
  // Transfer from Jakarta to Surabaya
  {
    id: stockMovementIds.stockMovement13,
    warehouseIdFrom: warehouseIds.warehouse2, // From Jakarta
    warehouseIdTo: warehouseIds.warehouse3, // To Surabaya
    productId: productIds.product2,
    quantity: 1,
    movementType: 'transfer',
    invoiceId: null,
    deliveryId: null,
    notes: 'Transfer wheel loader from Jakarta to Surabaya warehouse',
  },

  // Transfer from Surabaya to Bandung
  {
    id: stockMovementIds.stockMovement14,
    warehouseIdFrom: warehouseIds.warehouse3, // From Surabaya
    warehouseIdTo: warehouseIds.warehouse4, // To Bandung
    productId: productIds.product1,
    quantity: 1,
    movementType: 'transfer',
    invoiceId: null,
    deliveryId: null,
    notes: 'Transfer wheel loader from Surabaya to Bandung warehouse',
  },

  // Sales-related stock movements (OUT type)
  // Sale from Jakarta warehouse
  {
    id: stockMovementIds.stockMovement15,
    warehouseIdFrom: warehouseIds.warehouse2, // From Jakarta warehouse
    warehouseIdTo: warehouseIds.warehouse2, // To customer (external)
    productId: productIds.product3,
    quantity: 1,
    movementType: 'out',
    invoiceId: 'INV/2025/04/001',
    deliveryId: deliveryNoteIds.deliveryNote1,
    notes: 'Sale of wheel loader to customer - delivered',
  },
];
