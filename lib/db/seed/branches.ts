import { InsertBranch } from '../schema';

export const branchIds = {
  ho_jakarta: 'b0000001-0000-4000-a000-000000000001',
  pekanbaru: 'b0000002-0000-4000-a000-000000000001',
  kendari: 'b0000003-0000-4000-a000-000000000001',
  balikpapan: 'b0000004-0000-4000-a000-000000000001',
};

export const branches: InsertBranch[] = [
  { id: branchIds.ho_jakarta, name: 'HO Jakarta' },
  { id: branchIds.pekanbaru, name: 'Pekanbaru' },
  { id: branchIds.kendari, name: 'Kendari' },
  { id: branchIds.balikpapan, name: 'Balikpapan' },
];
