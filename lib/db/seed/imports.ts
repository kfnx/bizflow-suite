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
    exchangeRateRMB: '15750.00', // 1 USD = 15,750 IDR example rate
    subtotal: '90000.00', // 85,000 + 5,000 RMB (from import items)
    total: '3465000000.00', // Total from import items in IDR
    status: 'completed',
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
    exchangeRateRMB: '15750.00',
    subtotal: '107000.00', // 95,000 + 12,000 RMB (from import items)
    total: '1874250000.00', // Total from import items in IDR
    status: 'completed',
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
    exchangeRateRMB: '15800.00', // Different exchange rate
    subtotal: '105000.00', // 75,000 + 30,000 RMB (from import items)
    total: '4029000000.00', // Total from import items in IDR
    status: 'verified',
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
    exchangeRateRMB: '15800.00',
    subtotal: '125000.00', // 65,000 + 60,000 RMB (from import items)
    total: '1975000000.00', // Total from import items in IDR
    status: 'pending',
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
    exchangeRateRMB: '15850.00',
    subtotal: '65000.00', // 45,000 + 8,000 + 12,000 RMB (from import items)
    total: '3487000000.00', // Total from import items in IDR
    status: 'verified',
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
    exchangeRateRMB: '15850.00',
    subtotal: '195000.00', // 120,000 + 75,000 RMB (from import items)
    total: '3090750000.00', // Total from import items in IDR
    status: 'pending',
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
    quantity: 2,
    total: '2677500000.00', // 85,000 * 15,750 * 2 in IDR
  },

  // Import 1 - Additional product (spare parts)
  {
    id: importItemIds.importItem7,
    importId: importIds.import1,
    productId: productIds.product2,
    priceRMB: '5000.00',
    quantity: 10,
    total: '787500000.00', // 5,000 * 15,750 * 10 in IDR
  },

  // Import 2 - Wheel loader
  {
    id: importItemIds.importItem2,
    importId: importIds.import2,
    productId: productIds.product2,
    priceRMB: '95000.00',
    quantity: 1,
    total: '1496250000.00', // 95,000 * 15,750 * 1 in IDR
  },

  // Import 2 - Additional product (maintenance kit)
  {
    id: importItemIds.importItem11,
    importId: importIds.import2,
    productId: productIds.product3,
    priceRMB: '12000.00',
    quantity: 2,
    total: '378000000.00', // 12,000 * 15,750 * 2 in IDR
  },

  // Import 3 - Bulldozer equipment
  {
    id: importItemIds.importItem3,
    importId: importIds.import3,
    productId: productIds.product4,
    priceRMB: '75000.00',
    quantity: 3,
    total: '3555000000.00', // 75,000 * 15,800 * 3 in IDR
  },

  // Import 3 - Additional product (accessories)
  {
    id: importItemIds.importItem8,
    importId: importIds.import3,
    productId: productIds.product5,
    priceRMB: '15000.00',
    quantity: 2,
    total: '474000000.00', // 15,000 * 15,800 * 2 in IDR
  },

  // Import 4 - Wheel loader
  {
    id: importItemIds.importItem4,
    importId: importIds.import4,
    productId: productIds.product1,
    priceRMB: '65000.00',
    quantity: 1,
    total: '1027000000.00', // 65,000 * 15,800 * 1 in IDR
  },

  // Import 4 - Additional product (consumables)
  {
    id: importItemIds.importItem12,
    importId: importIds.import4,
    productId: productIds.product2,
    priceRMB: '3000.00',
    quantity: 20,
    total: '948000000.00', // 3,000 * 15,800 * 20 in IDR
  },

  // Import 5 - Wheel loader batch
  {
    id: importItemIds.importItem5,
    importId: importIds.import5,
    productId: productIds.product3,
    priceRMB: '45000.00',
    quantity: 4,
    total: '2853000000.00', // 45,000 * 15,850 * 4 in IDR
  },

  // Import 5 - Additional product (tools)
  {
    id: importItemIds.importItem9,
    importId: importIds.import5,
    productId: productIds.product4,
    priceRMB: '8000.00',
    quantity: 5,
    total: '634000000.00', // 8,000 * 15,850 * 5 in IDR
  },

  // Import 6 - High-value excavator
  {
    id: importItemIds.importItem6,
    importId: importIds.import6,
    productId: productIds.product5,
    priceRMB: '120000.00',
    quantity: 1,
    total: '1902000000.00', // 120,000 * 15,850 * 1 in IDR
  },

  // Import 6 - Additional product (safety equipment)
  {
    id: importItemIds.importItem10,
    importId: importIds.import6,
    productId: productIds.product1,
    priceRMB: '25000.00',
    quantity: 3,
    total: '1188750000.00', // 25,000 * 15,850 * 3 in IDR
  },
];
