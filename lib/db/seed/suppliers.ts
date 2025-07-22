export const supplierIds = {
  supplier1: '20000001-0000-4000-a000-000000000001',
  supplier2: '20000002-0000-4000-a000-000000000001',
  supplier3: '20000003-0000-4000-a000-000000000001',
  supplier4: '20000004-0000-4000-a000-000000000001',
};

export const supplierContactPersonIds = {
  supplierContact1: 'e0000001-0000-4000-a000-000000000001',
  supplierContact2: 'e0000002-0000-4000-a000-000000000001',
  supplierContact3: 'e0000003-0000-4000-a000-000000000001',
  supplierContact4: 'e0000004-0000-4000-a000-000000000001',
};

export const supplierContactPersons = [
  {
    id: supplierContactPersonIds.supplierContact1,
    supplierId: supplierIds.supplier1,
    name: 'John Doe',
    email: 'contact@supplierutama.com',
    phone: '+6281234567893',
  },
  {
    id: supplierContactPersonIds.supplierContact2,
    supplierId: supplierIds.supplier2,
    name: 'Jane Smith',
    email: 'info@suppliermitra.com',
    phone: '+6281234567894',
  },
  {
    id: supplierContactPersonIds.supplierContact3,
    supplierId: supplierIds.supplier3,
    name: 'Ahmad Rizki',
    email: 'contact@supplierketiga.com',
    phone: '+6281234567895',
  },
  {
    id: supplierContactPersonIds.supplierContact4,
    supplierId: supplierIds.supplier4,
    name: 'Agus Rizki',
    email: 'contact@supplierempat.com',
    phone: '+6281234567896',
  },
];

export const suppliers = [
  {
    id: supplierIds.supplier1,
    code: 'SUP001',
    name: 'Eastern Equipment Ltd.',
    country: 'Indonesia',
    address: 'Jl. Supplier No. 123, Jakarta Pusat, DKI Jakarta 10110',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '10110',
    transactionCurrency: 'RMB',
    isActive: true,
  },
  {
    id: supplierIds.supplier2,
    code: 'SUP002',
    name: 'CV Supplier Mitra',
    country: 'Indonesia',
    address: 'Jl. Mitra No. 456, Surabaya, Jawa Timur 60111',
    city: 'Surabaya',
    province: 'Jawa Timur',
    postalCode: '60111',
    transactionCurrency: 'IDR',
    isActive: false,
  },
  {
    id: supplierIds.supplier3,
    code: 'SUP003',
    name: 'Global Machinery Co.',
    country: 'Indonesia',
    address: 'Jl. Supplier No. 789, Bekasi, Jawa Barat 17111',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postalCode: '17111',
    transactionCurrency: 'USD',
    isActive: true,
  },
  {
    id: supplierIds.supplier4,
    code: 'SUP004',
    name: 'PT Supplier Keempat',
    country: 'Indonesia',
    address: 'Jl. Supplier No. 789, Bekasi, Jawa Barat 17111',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postalCode: '17111',
    transactionCurrency: 'USD',
    isActive: true,
  },
];
