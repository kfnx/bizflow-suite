import { InsertBranch } from '../schema';

export const branchIds = {
  ho_jakarta: 'b0000001-0000-4000-a000-000000000001',
  pekanbaru: 'b0000002-0000-4000-a000-000000000001',
  kendari: 'b0000003-0000-4000-a000-000000000001',
  balikpapan: 'b0000004-0000-4000-a000-000000000001',
};

export const branches: InsertBranch[] = [
  {
    id: branchIds.ho_jakarta,
    name: 'HO Jakarta',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta',
    postalCode: '12190',
    phone: '+62-21-555-0123',
    fax: '+62-21-555-0124',
    email: 'ho.jakarta@sti.com',
  },
  {
    id: branchIds.pekanbaru,
    name: 'Pekanbaru',
    address: 'Jl. Soekarno-Hatta No. 456, Pekanbaru, Riau',
    postalCode: '28112',
    phone: '+62-761-555-0456',
    fax: '+62-761-555-0457',
    email: 'pekanbaru@sti.com',
  },
  {
    id: branchIds.kendari,
    name: 'Kendari',
    address: 'Jl. Ahmad Yani No. 789, Kendari, Sulawesi Tenggara',
    postalCode: '93111',
    phone: '+62-401-555-0789',
    fax: '+62-401-555-0790',
    email: 'kendari@sti.com',
  },
  {
    id: branchIds.balikpapan,
    name: 'Balikpapan',
    address: 'Jl. Jenderal Sudirman No. 321, Balikpapan, Kalimantan Timur',
    postalCode: '76112',
    phone: '+62-542-555-0321',
    fax: '+62-542-555-0322',
    email: 'balikpapan@sti.com',
  },
];
