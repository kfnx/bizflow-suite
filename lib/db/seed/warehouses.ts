import { InsertWarehouse } from '../schema';
import { branchIds } from './branches';

export const warehouseIds = {
  warehouse1: '30000001-0000-4000-a000-000000000001',
  warehouse2: '30000002-0000-4000-a000-000000000001',
  warehouse3: '30000003-0000-4000-a000-000000000001',
  warehouse4: '30000004-0000-4000-a000-000000000001',
};

export const warehouses: InsertWarehouse[] = [
  {
    id: warehouseIds.warehouse1,
    name: 'WH Jakarta Pusat',
    address: 'Jl. Warehouse No. 1, Jakarta Pusat, DKI Jakarta',
    managerId: null, // Will be set when users are created
    branchId: branchIds.ho_jakarta,
    isActive: true,
  },
  {
    id: warehouseIds.warehouse2,
    name: 'WH Surabaya',
    address: 'Jl. Warehouse No. 2, Surabaya, Jawa Timur',
    managerId: null, // Will be set when users are created
    branchId: branchIds.pekanbaru,
    isActive: true,
  },
  {
    id: warehouseIds.warehouse3,
    name: 'WH Bandung',
    address: 'Jl. Warehouse No. 3, Bandung, Jawa Barat',
    managerId: null, // Will be set when users are created
    branchId: branchIds.kendari,
    isActive: true,
  },
  {
    id: warehouseIds.warehouse4,
    name: 'WH Medan',
    address: 'Jl. Warehouse No. 4, Medan, Sumatera Utara',
    managerId: null, // Will be set when users are created
    branchId: branchIds.balikpapan,
    isActive: true,
  },
];
