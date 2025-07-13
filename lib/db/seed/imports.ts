import { IMPORT_STATUS } from '../enum';
import { NewImport, NewImportItem } from '../schema';
import {
  importIds,
  importItemIds,
  productIds,
  supplierIds,
  userIds,
  warehouseIds,
} from './seed-constants';

export const imports: NewImport[] = [
  {
    id: importIds.import1,
    supplierId: supplierIds.supplier1,
    warehouseId: warehouseIds.warehouse1,
    importDate: new Date('2024-01-15'),
    invoiceNumber: 'INV-CN-2024-001',
    invoiceDate: new Date('2024-01-10'),
    exchangeRateRMBtoIDR: '2260.00', // 1 USD = 15,750 IDR example rate
    total: '3465000000.00', // Total from import items in IDR
    status: IMPORT_STATUS.VERIFIED,
    notes:
      'Shantui wheel loader and spare parts import - customs cleared successfully',
    createdBy: userIds.user5, // Import Manager
  },
  {
    id: importIds.import2,
    supplierId: supplierIds.supplier1,
    warehouseId: warehouseIds.warehouse2,
    importDate: new Date('2024-01-20'),
    invoiceNumber: 'INV-CN-2024-002',
    invoiceDate: new Date('2024-01-18'),
    exchangeRateRMBtoIDR: '2255.00',
    total: '1874250000.00', // Total from import items in IDR
    status: IMPORT_STATUS.PENDING,
    notes:
      'Wheel loader and maintenance kit import - delivered to Jakarta warehouse',
    createdBy: userIds.user5, // Import Manager
  },
  {
    id: importIds.import3,
    supplierId: supplierIds.supplier2,
    warehouseId: warehouseIds.warehouse1,
    importDate: new Date('2024-02-01'),
    invoiceNumber: 'INV-CN-2024-003',
    invoiceDate: new Date('2024-01-28'),
    exchangeRateRMBtoIDR: '2252.00', // Different exchange rate
    total: '4029000000.00', // Total from import items in IDR
    status: IMPORT_STATUS.VERIFIED,
    notes:
      'Bulldozer equipment and accessories import - pending final inspection',
    createdBy: userIds.user2, // Manager
  },
  {
    id: importIds.import4,
    supplierId: supplierIds.supplier1,
    warehouseId: warehouseIds.warehouse3,
    importDate: new Date('2024-02-10'),
    invoiceNumber: 'INV-CN-2024-004',
    invoiceDate: new Date('2024-02-05'),
    exchangeRateRMBtoIDR: '2252.00',
    total: '1975000000.00', // Total from import items in IDR
    status: IMPORT_STATUS.PENDING,
    notes: 'Wheel loader and consumables import - still in customs processing',
    createdBy: userIds.user5, // Import Manager
  },
  {
    id: importIds.import5,
    supplierId: supplierIds.supplier3,
    warehouseId: warehouseIds.warehouse2,
    importDate: new Date('2024-02-15'),
    invoiceNumber: 'INV-CN-2024-005',
    invoiceDate: new Date('2024-02-12'),
    exchangeRateRMBtoIDR: '2252.00',
    total: '3487000000.00', // Total from import items in IDR
    status: IMPORT_STATUS.VERIFIED,
    notes:
      'Wheel loader, tools, and additional items import - quality inspection passed',
    createdBy: userIds.user3, // Director
  },
  {
    id: importIds.import6,
    supplierId: supplierIds.supplier2,
    warehouseId: warehouseIds.warehouse1,
    importDate: new Date('2024-02-20'),
    invoiceNumber: 'INV-CN-2024-006',
    invoiceDate: new Date('2024-02-18'),
    exchangeRateRMBtoIDR: '2258.00',
    total: '3090750000.00', // Total from import items in IDR
    status: IMPORT_STATUS.PENDING,
    notes:
      'High-value excavator and safety equipment import - awaiting final customs approval',
    createdBy: userIds.user2, // Manager
  },
];

export const importItems: NewImportItem[] = [
  // Import 1 - Shantui wheel loader
  {
    id: importItemIds.importItem1,
    importId: importIds.import1,
    productId: productIds.product1,
    priceRMB: '85000.00',
    total: '170000.00', // 85,000 * 2 in RMB
  },

  // Import 1 - Additional product (spare parts)
  {
    id: importItemIds.importItem7,
    importId: importIds.import1,
    productId: productIds.product2,
    priceRMB: '5000.00',
    total: '50000.00', // 5,000 * 10 in RMB
  },

  // Import 2 - Wheel loader
  {
    id: importItemIds.importItem2,
    importId: importIds.import2,
    productId: productIds.product2,
    priceRMB: '95000.00',
    total: '95000.00', // 95,000 * 1 in RMB
  },

  // Import 2 - Additional product (maintenance kit)
  {
    id: importItemIds.importItem11,
    importId: importIds.import2,
    productId: productIds.product3,
    priceRMB: '12000.00',
    total: '24000.00', // 12,000 * 2 in RMB
  },

  // Import 3 - Bulldozer equipment
  {
    id: importItemIds.importItem3,
    importId: importIds.import3,
    productId: productIds.product4,
    priceRMB: '75000.00',
    total: '225000.00', // 75,000 * 3 in RMB
  },

  // Import 3 - Additional product (accessories)
  {
    id: importItemIds.importItem8,
    importId: importIds.import3,
    productId: productIds.product5,
    priceRMB: '15000.00',
    total: '30000.00', // 15,000 * 2 in RMB
  },

  // Import 4 - Wheel loader
  {
    id: importItemIds.importItem4,
    importId: importIds.import4,
    productId: productIds.product1,
    priceRMB: '65000.00',
    total: '65000.00', // 65,000 * 1 in RMB
  },

  // Import 4 - Additional product (consumables)
  {
    id: importItemIds.importItem12,
    importId: importIds.import4,
    productId: productIds.product2,
    priceRMB: '3000.00',
    total: '60000.00', // 3,000 * 20 in RMB
  },

  // Import 5 - Wheel loader batch
  {
    id: importItemIds.importItem5,
    importId: importIds.import5,
    productId: productIds.product3,
    priceRMB: '45000.00',
    total: '180000.00', // 45,000 * 4 in RMB
  },

  // Import 5 - Additional product (tools)
  {
    id: importItemIds.importItem9,
    importId: importIds.import5,
    productId: productIds.product4,
    priceRMB: '8000.00',
    total: '40000.00', // 8,000 * 5 in RMB
  },

  // Import 6 - High-value excavator
  {
    id: importItemIds.importItem6,
    importId: importIds.import6,
    productId: productIds.product5,
    priceRMB: '120000.00',
    total: '120000.00', // 120,000 * 1 in RMB
  },

  // Import 6 - Additional product (safety equipment)
  {
    id: importItemIds.importItem10,
    importId: importIds.import6,
    productId: productIds.product1,
    priceRMB: '25000.00',
    total: '75000.00', // 25,000 * 3 in RMB
  },
];
