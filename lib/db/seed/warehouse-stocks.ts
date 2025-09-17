import { InsertWarehouseStock } from '../schema';
import { productIds } from './products';
import { warehouseIds } from './warehouses';

export const warehouseStocks: InsertWarehouseStock[] = [
  // Jakarta Warehouse (WH Jakarta Pusat) - Large inventory across all categories

  // SERIALIZED PRODUCTS in Jakarta
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product1, // Shantui L36-B3 Wheel Loader (2025)
    condition: 'new',
    quantity: 1,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product4, // Shantui DH08-B3-XL Bulldozer
    condition: 'new',
    quantity: 1,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product6, // Caterpillar D6T Bulldozer
    condition: 'new',
    quantity: 1,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product9, // Komatsu PC200-8 Excavator
    condition: 'used',
    quantity: 1,
  },

  // BULK PRODUCTS in Jakarta
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product10, // Portland Cement
    condition: 'new',
    quantity: 500, // tons
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product11, // Reinforcement Steel Bar
    condition: 'new',
    quantity: 250, // tons
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product14, // Engine Oil SAE 15W-40
    condition: 'new',
    quantity: 2000, // liters
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product15, // Hydraulic Oil ISO 46
    condition: 'new',
    quantity: 1500, // liters
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product23, // Diesel Fuel
    condition: 'new',
    quantity: 10000, // liters
  },

  // NON_SERIALIZED PRODUCTS in Jakarta
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product17, // Air Filter Element
    condition: 'new',
    quantity: 150,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product18, // Oil Filter Cartridge
    condition: 'new',
    quantity: 200,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product19, // Hydraulic Filter Element
    condition: 'new',
    quantity: 100,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product26, // Safety Helmet
    condition: 'new',
    quantity: 500,
  },

  // Surabaya Warehouse - Mixed inventory with some used equipment

  // SERIALIZED PRODUCTS in Surabaya
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product2, // Shantui L36-B3 Wheel Loader (2023)
    condition: 'used',
    quantity: 1,
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product3, // Shantui SL36-B3 Wheel Loader (2019)
    condition: 'used',
    quantity: 1,
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product5, // Shantui SFD35-3000 Excavator
    condition: 'refurbished',
    quantity: 1,
  },

  // BULK PRODUCTS in Surabaya
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product12, // Crushed Stone Aggregate
    condition: 'new',
    quantity: 800, // tons
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product13, // River Sand Fine
    condition: 'new',
    quantity: 600, // tons
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product16, // Gear Oil SAE 90
    condition: 'new',
    quantity: 800, // liters
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product25, // Coolant/Antifreeze
    condition: 'new',
    quantity: 500, // liters
  },

  // NON_SERIALIZED PRODUCTS in Surabaya
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product20, // Track Roller Assembly
    condition: 'new',
    quantity: 50,
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product21, // Bucket Teeth Set
    condition: 'new',
    quantity: 80,
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product27, // Safety Vest
    condition: 'new',
    quantity: 300,
  },
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product28, // Work Gloves
    condition: 'new',
    quantity: 400,
  },

  // Bandung Warehouse - Specialized in spare parts and small equipment

  // NON_SERIALIZED PRODUCTS in Bandung
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product17, // Air Filter Element (also in Jakarta - cross-stocking)
    condition: 'new',
    quantity: 75,
  },
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product18, // Oil Filter Cartridge
    condition: 'new',
    quantity: 120,
  },
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product22, // Hydraulic Hose Assembly
    condition: 'new',
    quantity: 60,
  },
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product29, // Measuring Tape
    condition: 'new',
    quantity: 100,
  },
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product30, // Level Tool
    condition: 'new',
    quantity: 80,
  },

  // BULK PRODUCTS in Bandung
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product24, // Grease Cartridge
    condition: 'new',
    quantity: 200,
  },
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product14, // Engine Oil SAE 15W-40 (shared with Jakarta)
    condition: 'new',
    quantity: 500, // liters
  },

  // Medan Warehouse - Regional distribution center

  // BULK PRODUCTS in Medan
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product10, // Portland Cement (shared with Jakarta)
    condition: 'new',
    quantity: 200, // tons
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product15, // Hydraulic Oil ISO 46
    condition: 'new',
    quantity: 600, // liters
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product23, // Diesel Fuel
    condition: 'new',
    quantity: 5000, // liters
  },

  // NON_SERIALIZED PRODUCTS in Medan
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product19, // Hydraulic Filter Element
    condition: 'new',
    quantity: 40,
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product26, // Safety Helmet
    condition: 'new',
    quantity: 200,
  },

  // Cross-warehouse inventory examples (same products in multiple warehouses)

  // Engine Oil in multiple warehouses
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product14, // Engine Oil SAE 15W-40
    condition: 'new',
    quantity: 1000, // liters
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product14, // Engine Oil SAE 15W-40
    condition: 'new',
    quantity: 800, // liters
  },

  // Air Filters distributed across warehouses
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product17, // Air Filter Element
    condition: 'new',
    quantity: 80,
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product17, // Air Filter Element
    condition: 'new',
    quantity: 60,
  },

  // Mixed condition inventory examples
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product21, // Bucket Teeth Set
    condition: 'new',
    quantity: 30,
  },
  {
    warehouseId: warehouseIds.warehouse1,
    productId: productIds.product21, // Bucket Teeth Set (used condition)
    condition: 'used',
    quantity: 15,
  },

  // Some products with low stock (realistic scenarios)
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product20, // Track Roller Assembly
    condition: 'new',
    quantity: 5, // low stock
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product22, // Hydraulic Hose Assembly
    condition: 'new',
    quantity: 8, // low stock
  },

  // Zero stock examples (products that exist but currently out of stock)
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product16, // Gear Oil SAE 90
    condition: 'new',
    quantity: 0, // out of stock
  },
  {
    warehouseId: warehouseIds.warehouse4,
    productId: productIds.product18, // Oil Filter Cartridge
    condition: 'new',
    quantity: 0, // out of stock
  },

  // Refurbished equipment examples
  {
    warehouseId: warehouseIds.warehouse2,
    productId: productIds.product20, // Track Roller Assembly (refurbished)
    condition: 'refurbished',
    quantity: 12,
  },
  {
    warehouseId: warehouseIds.warehouse3,
    productId: productIds.product21, // Bucket Teeth Set (refurbished)
    condition: 'refurbished',
    quantity: 8,
  },
];