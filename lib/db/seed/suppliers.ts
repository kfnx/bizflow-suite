export const supplierIds = {
  supplier1: 'sup00001-0000-0000-0000-000000000001',
  supplier2: 'sup00002-0000-0000-0000-000000000002',
  supplier3: 'sup00003-0000-0000-0000-000000000003',
};

export const contactPersonIds = {
  supplierContact1: 'scp00001-0000-0000-0000-000000000001',
  supplierContact2: 'scp00002-0000-0000-0000-000000000002',
  supplierContact3: 'scp00003-0000-0000-0000-000000000003',
};

export const supplierContactPersons = [
  {
    id: contactPersonIds.supplierContact1,
    supplierId: supplierIds.supplier1,
    name: 'John Doe',
    email: 'contact@supplierutama.com',
    phone: '+6281234567893',
  },
  {
    id: contactPersonIds.supplierContact2,
    supplierId: supplierIds.supplier2,
    name: 'Jane Smith',
    email: 'info@suppliermitra.com',
    phone: '+6281234567894',
  },
  {
    id: contactPersonIds.supplierContact3,
    supplierId: supplierIds.supplier3,
    name: 'Ahmad Rizki',
    email: 'contact@supplierketiga.com',
    phone: '+6281234567895',
  },
];

export const suppliers = [
  {
    id: supplierIds.supplier1,
    code: 'SUP001',
    name: 'PT Supplier Utama',
    country: 'Indonesia',
    address: 'Jl. Supplier No. 123, Jakarta Pusat, DKI Jakarta 10110',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '10110',
    transactionCurrency: 'IDR',
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
    isActive: true,
  },
  {
    id: supplierIds.supplier3,
    code: 'SUP003',
    name: 'PT Supplier Ketiga',
    country: 'Indonesia',
    address: 'Jl. Supplier No. 789, Bekasi, Jawa Barat 17111',
    city: 'Bekasi',
    province: 'Jawa Barat',
    postalCode: '17111',
    transactionCurrency: 'IDR',
    isActive: true,
  },
];
