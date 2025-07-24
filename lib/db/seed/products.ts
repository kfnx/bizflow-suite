import { PRODUCT_CATEGORY } from '../enum';
import { InsertProduct } from '../schema';
import { brandIds } from './brands';
import { machineTypeIds } from './machine-types';
import { supplierIds } from './suppliers';
import { unitOfMeasureIds } from './unit-of-measures';
import { warehouseIds } from './warehouses';

export const productIds = {
  product1: '40000001-0000-4000-a000-000000000001',
  product2: '40000002-0000-4000-a000-000000000001',
  product3: '40000003-0000-4000-a000-000000000001',
  product4: '40000004-0000-4000-a000-000000000001',
  product5: '40000005-0000-4000-a000-000000000001',
  product6: '40000006-0000-4000-a000-000000000001',
  product7: '40000007-0000-4000-a000-000000000001',
  product8: '40000008-0000-4000-a000-000000000001',
  product9: '40000009-0000-4000-a000-000000000001',
};

export const products: InsertProduct[] = [
  {
    id: productIds.product1,
    name: 'Shantui L36-B3 Wheel Loader',
    description: 'Wheel Loader for construction and material handling',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.wheel_loader,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.shantui,
    modelNumber: 'L36-B3',
    serialNumber: 'SHA-L36B3-2025-001',
    code: 'SHA-L36B3-2025-001',
    engineNumber: 'SHA-ENG-2025-001',
    additionalSpecs: `
      engineModel WD10G220E23
      enginePower 220 hp
      operatingWeight 18,500 kg
      year 2025
    `,
    condition: 'new',
    status: 'in_stock',
    price: '185000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier1,
    isActive: true,
  },
  {
    id: productIds.product2,
    name: 'Shantui L36-B3 Wheel Loader',
    description: 'Wheel Loader for construction and material handling',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.wheel_loader,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.shantui,
    modelNumber: 'L36-B3',
    serialNumber: 'SHA-L36B3-2023-002',
    code: 'SHA-L36B3-2023-002',
    engineNumber: 'SHA-ENG-2023-002',
    additionalSpecs: `
      engineModel WD10G220E23
      enginePower 220 hp
      operatingWeight 18,500 kg
      year 2023
    `,
    condition: 'used',
    status: 'in_stock',
    price: '145000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier1,
    isActive: true,
  },
  {
    id: productIds.product3,
    name: 'Shantui SL36-B3 Wheel Loader',
    description: 'Wheel Loader for construction and material handling',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.wheel_loader,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.shantui,
    modelNumber: 'SL36-B3',
    serialNumber: 'SHA-SL36B3-2019-003',
    code: 'SHA-SL36B3-2019-003',
    engineNumber: 'SHA-ENG-2019-003',
    additionalSpecs: `
      engineModel WD10G220E23
      enginePower 220 hp
      operatingWeight 18,500 kg
      year 2019
    `,
    condition: 'used',
    status: 'in_stock',
    price: '95000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier1,
    isActive: true,
  },
  {
    id: productIds.product4,
    name: 'Shantui DH08-B3-XL Bulldozer',
    description: 'Bulldozer for earthmoving and construction',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.bulldozer,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.shantui,
    modelNumber: 'DH08-B3-XL',
    serialNumber: 'SHA-DH08B3XL-2024-004',
    code: 'SHA-DH08B3XL-2024-004',
    engineNumber: 'SHA-ENG-2024-004',
    additionalSpecs: `
      engineModel Cummins NT855-C360
      enginePower 360 hp
      operatingWeight 32,000 kg
      year 2024
    `,
    condition: 'new',
    status: 'in_stock',
    price: '220000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier1,
    isActive: true,
  },
  {
    id: productIds.product5,
    name: 'Shantui SFD35-3000 Excavator',
    description: 'Excavator for construction and digging operations',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.excavator,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.shantui,
    modelNumber: 'SFD35-3000',
    serialNumber: 'SHA-SFD35-2022-005',
    code: 'SHA-SFD35-2022-005',
    engineNumber: 'SHA-ENG-2022-005',
    additionalSpecs: `
      engineModel Cummins NT855-C360
      enginePower 360 hp
      operatingWeight 35,000 kg
      year 2022
    `,
    condition: 'used',
    status: 'in_stock',
    price: '165000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier1,
    isActive: true,
  },
  {
    id: productIds.product6,
    name: 'Caterpillar D6T Bulldozer',
    description: 'Heavy-duty bulldozer for large-scale earthmoving projects',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.bulldozer,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.caterpillar,
    modelNumber: 'D6T',
    serialNumber: 'CAT-D6T-2024-006',
    code: 'CAT-D6T-2024-006',
    engineNumber: 'CAT-ENG-2024-006',
    additionalSpecs: `
      engineModel Caterpillar C11 ACERT
      enginePower 330 hp
      operatingWeight 22,000 kg
      year 2024
    `,
    condition: 'new',
    status: 'in_stock',
    price: '450000000.00',
    warehouseId: warehouseIds.warehouse2,
    supplierId: supplierIds.supplier2,
    isActive: true,
  },
  {
    id: productIds.product7,
    name: 'Komatsu PC200-8 Excavator',
    description: 'Medium-sized excavator for versatile construction work',
    category: PRODUCT_CATEGORY.NON_SERIALIZED,
    unitOfMeasureId: unitOfMeasureIds.unit,
    machineTypeId: null,
    quantity: 1,
    brandId: brandIds.sparepartABC,
    modelNumber: 'PC200-8',
    serialNumber: 'SP-PC200-2021-007',
    code: 'SP-PC200-2021-007',
    engineNumber: 'SP-ENG-2021-007',
    condition: 'used',
    status: 'in_stock',
    price: '10000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier3,
    isActive: true,
  },
  {
    id: productIds.product8,
    name: 'Komatsu PC200-8 Excavator',
    description: 'Medium-sized excavator for versatile construction work',
    category: PRODUCT_CATEGORY.BULK,
    machineTypeId: null,
    unitOfMeasureId: unitOfMeasureIds.kg,
    quantity: 1,
    brandId: brandIds.oliolio,
    modelNumber: 'PC200-8',
    serialNumber: 'OLI-PC200-2021-007',
    code: 'OLI-PC200-2021-007',
    engineNumber: 'OLI-ENG-2021-007',
    condition: 'used',
    status: 'in_stock',
    price: '8000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier3,
    isActive: true,
  },
  {
    id: productIds.product9,
    name: 'Komatsu PC200-8 Excavator',
    description: 'Medium-sized excavator for versatile construction work',
    category: PRODUCT_CATEGORY.SERIALIZED,
    machineTypeId: machineTypeIds.excavator,
    unitOfMeasureId: unitOfMeasureIds.unit,
    quantity: 1,
    brandId: brandIds.komatsu,
    modelNumber: 'PC200-8',
    serialNumber: 'KOM-PC200-2021-007',
    code: 'KOM-PC200-2021-007',
    engineNumber: 'KOM-ENG-2021-007',
    additionalSpecs: `
      engineModel Komatsu SAA6D107E-1
      enginePower 103 kW
      operatingWeight 20,000 kg
      year 2021
    `,
    condition: 'used',
    status: 'in_stock',
    price: '280000000.00',
    warehouseId: warehouseIds.warehouse1,
    supplierId: supplierIds.supplier3,
    isActive: true,
  },
];
