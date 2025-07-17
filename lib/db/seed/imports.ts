import { IMPORT_STATUS, PRODUCT_CATEGORY } from '../enum';
import { InsertImport, InsertImportItem } from '../schema';
import {
  importIds,
  importItemIds,
  supplierIds,
  userIds,
  warehouseIds,
} from './seed-constants';

export const imports: InsertImport[] = [
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

export const importItems: InsertImportItem[] = [
  // Import 1 - Shantui wheel loader
  {
    id: importItemIds.importItem1,
    importId: importIds.import1,
    priceRMB: '85000.00',
    quantity: 2,
    category: PRODUCT_CATEGORY.SERIALIZED,
    name: 'Hitachi SL50W Wheel Loader',
    description: 'Heavy-duty wheel loader with advanced hydraulic system',
    brandId: 'hitachi',
    condition: 'new',
    year: 2024,
    machineTypeId: 'wheel_loader',
    modelOrPartNumber: 'HITL50W',
    machineNumber: 'SL50W-2024-001',
    engineNumber: 'ENG-SL50W-001',
    serialNumber: 'SN-SL50W-001',
    model: 'SL50W',
    engineModel: 'WD10G220E23',
    enginePower: '162kW',
    operatingWeight: '17500kg',
    notes: 'Main heavy equipment unit',
  },

  // Import 1 - Hydraulic spare parts
  {
    id: importItemIds.importItem7,
    importId: importIds.import1,
    priceRMB: '5000.00',
    quantity: 10,
    category: PRODUCT_CATEGORY.NON_SERIALIZED,
    name: 'Hydraulic Filter Set',
    description: 'Complete hydraulic filtration system components',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    unitOfMeasureId: 'pcs',
    modelOrPartNumber: 'HYD-FILTER-SET-001',
    modelNumber: 'HFS-SL50W',
    notes: 'Essential maintenance components',
  },

  // Import 2 - Wheel loader
  {
    id: importItemIds.importItem2,
    importId: importIds.import2,
    priceRMB: '95000.00',
    quantity: 1,
    category: PRODUCT_CATEGORY.SERIALIZED,
    name: 'Shantui SL60W Wheel Loader',
    description: 'Premium wheel loader with enhanced performance',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    machineTypeId: 'wheel_loader',
    modelOrPartNumber: 'SL60W',
    machineNumber: 'SL60W-2024-002',
    engineNumber: 'ENG-SL60W-002',
    serialNumber: 'SN-SL60W-002',
    model: 'SL60W',
    engineModel: 'WD10G240E23',
    enginePower: '178kW',
    operatingWeight: '19200kg',
    notes: 'Enhanced model with better fuel efficiency',
  },

  // Import 2 - Maintenance kit
  {
    id: importItemIds.importItem11,
    importId: importIds.import2,
    priceRMB: '12000.00',
    quantity: 2,
    category: PRODUCT_CATEGORY.NON_SERIALIZED,
    name: 'Comprehensive Maintenance Kit',
    description: 'Complete maintenance package for wheel loaders',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    unitOfMeasureId: 'pcs',
    modelOrPartNumber: 'MAINT-KIT-WL-001',
    modelNumber: 'CMK-WL-2024',
    notes: 'Includes filters, oils, and wear parts',
  },

  // Import 3 - Bulldozer equipment
  {
    id: importItemIds.importItem3,
    importId: importIds.import3,
    priceRMB: '75000.00',
    quantity: 3,
    category: PRODUCT_CATEGORY.SERIALIZED,
    name: 'Shantui SD16 Bulldozer',
    description: 'Standard bulldozer for earthmoving operations',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    machineTypeId: 'bulldozer',
    modelOrPartNumber: 'SD16',
    machineNumber: 'SD16-2024-003',
    engineNumber: 'ENG-SD16-003',
    serialNumber: 'SN-SD16-003',
    model: 'SD16',
    engineModel: 'NT855-C280S10',
    enginePower: '131kW',
    operatingWeight: '16500kg',
    notes: 'Standard configuration bulldozer',
  },

  // Import 3 - Bulldozer accessories
  {
    id: importItemIds.importItem8,
    importId: importIds.import3,
    priceRMB: '15000.00',
    quantity: 2,
    category: PRODUCT_CATEGORY.NON_SERIALIZED,
    name: 'Bulldozer Blade Assembly',
    description: 'Heavy-duty blade assembly for bulldozer operations',
    brandId: 'caterpillar',
    condition: 'new',
    year: 2024,
    unitOfMeasureId: 'pcs',
    modelOrPartNumber: 'BLADE-ASSY-SD16',
    modelNumber: 'BA-SD16-2024',
    notes: 'High-strength steel construction',
  },

  // Import 4 - Wheel loader
  {
    id: importItemIds.importItem4,
    importId: importIds.import4,
    priceRMB: '65000.00',
    quantity: 1,
    category: PRODUCT_CATEGORY.SERIALIZED,
    name: 'Shantui SL30W Compact Wheel Loader',
    description: 'Compact wheel loader for versatile applications',
    brandId: 'komatsu',
    condition: 'new',
    year: 2024,
    machineTypeId: 'wheel_loader',
    modelOrPartNumber: 'SL30W',
    machineNumber: 'SL30W-2024-004',
    engineNumber: 'ENG-SL30W-004',
    serialNumber: 'SN-SL30W-004',
    model: 'SL30W',
    engineModel: 'YC4D95Z-T20',
    enginePower: '70kW',
    operatingWeight: '10500kg',
    notes: 'Compact design for tight spaces',
  },

  // Import 4 - Consumables
  {
    id: importItemIds.importItem12,
    importId: importIds.import4,
    priceRMB: '3000.00',
    quantity: 20,
    category: PRODUCT_CATEGORY.BULK,
    name: 'Engine Oil SAE 15W-40',
    description: 'Heavy-duty engine oil for construction equipment',
    brandId: 'caterpillar',
    condition: 'new',
    year: 2024,
    unitOfMeasureId: 'liter',
    modelOrPartNumber: 'ENG-OIL-15W40',
    batchOrLotNumber: 'BATCH-2024-001',
    modelNumber: 'EO-15W40-HD',
    notes: 'Premium grade engine oil',
  },

  // Import 5 - Wheel loader batch
  {
    id: importItemIds.importItem5,
    importId: importIds.import5,
    priceRMB: '45000.00',
    quantity: 4,
    category: PRODUCT_CATEGORY.SERIALIZED,
    name: 'Shantui SL25W Wheel Loader',
    description: 'Mid-range wheel loader for general construction',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    machineTypeId: 'wheel_loader',
    modelOrPartNumber: 'SL25W',
    machineNumber: 'SL25W-2024-005',
    engineNumber: 'ENG-SL25W-005',
    serialNumber: 'SN-SL25W-005',
    model: 'SL25W',
    engineModel: 'YC4D80-T21',
    enginePower: '59kW',
    operatingWeight: '8500kg',
    notes: 'Reliable mid-range loader',
  },

  // Import 5 - Tools
  {
    id: importItemIds.importItem9,
    importId: importIds.import5,
    priceRMB: '8000.00',
    quantity: 5,
    category: PRODUCT_CATEGORY.NON_SERIALIZED,
    name: 'Professional Tool Set',
    description: 'Complete professional tool set for equipment maintenance',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    unitOfMeasureId: 'pcs',
    modelOrPartNumber: 'TOOL-SET-PRO-001',
    modelNumber: 'PTS-MAINT-2024',
    notes: 'High-quality maintenance tools',
  },

  // Import 6 - High-value excavator
  {
    id: importItemIds.importItem6,
    importId: importIds.import6,
    priceRMB: '120000.00',
    quantity: 1,
    category: PRODUCT_CATEGORY.SERIALIZED,
    name: 'Shantui SE210 Excavator',
    description: 'High-performance excavator for heavy construction',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    machineTypeId: 'excavator',
    modelOrPartNumber: 'SE210',
    machineNumber: 'SE210-2024-006',
    engineNumber: 'ENG-SE210-006',
    serialNumber: 'SN-SE210-006',
    model: 'SE210',
    engineModel: 'ISUZU-6BG1TRP',
    enginePower: '123kW',
    operatingWeight: '21500kg',
    notes: 'Premium excavator model',
  },

  // Import 6 - Safety equipment
  {
    id: importItemIds.importItem10,
    importId: importIds.import6,
    priceRMB: '25000.00',
    quantity: 3,
    category: PRODUCT_CATEGORY.NON_SERIALIZED,
    name: 'Safety Equipment Package',
    description: 'Comprehensive safety equipment for construction sites',
    brandId: 'shantui',
    condition: 'new',
    year: 2024,
    unitOfMeasureId: 'pcs',
    modelOrPartNumber: 'SAFETY-PKG-001',
    modelNumber: 'SEP-CONST-2024',
    notes: 'Complete safety compliance package',
  },
];
