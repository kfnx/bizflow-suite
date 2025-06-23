import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/mysql2';
import { seed } from 'drizzle-seed';
import mysql from 'mysql2/promise';

import * as schema from './schema';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bizdocgen_santraktor',
  });

  const db = drizzle(connection, { schema, mode: 'default' });

  // Use a fixed password hash for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  await seed(db, schema).refine((f) => ({
    users: {
      count: 3,
      columns: {
        id: f.valuesFromArray({ values: ['user-1', 'user-2', 'user-3'] }),
        email: f.valuesFromArray({
          values: [
            'admin@bizdocgen.com',
            'manager@bizdocgen.com',
            'user@bizdocgen.com',
          ],
        }),
        password: f.default({ defaultValue: hashedPassword }),
        firstName: f.valuesFromArray({
          values: ['Admin', 'Manager', 'Regular'],
        }),
        lastName: f.default({ defaultValue: 'User' }),
        phone: f.valuesFromArray({
          values: ['+6281234567890', '+6281234567891', '+6281234567892'],
        }),
        role: f.valuesFromArray({ values: ['admin', 'manager', 'user'] }),
        isActive: f.default({ defaultValue: true }),
      },
    },
    customers: {
      count: 2,
      columns: {
        id: f.valuesFromArray({ values: ['customer-1', 'customer-2'] }),
        code: f.valuesFromArray({ values: ['CUST001', 'CUST002'] }),
        name: f.valuesFromArray({
          values: ['PT Customer Pertama', 'CV Customer Kedua'],
        }),
        email: f.valuesFromArray({
          values: ['contact@customerpertama.com', 'info@customerkedua.com'],
        }),
        phone: f.valuesFromArray({
          values: ['+6281234567897', '+6281234567898'],
        }),
        address: f.valuesFromArray({
          values: [
            'Jl. Customer No. 1, Jakarta',
            'Jl. Customer No. 2, Surabaya',
          ],
        }),
        city: f.valuesFromArray({ values: ['Jakarta', 'Surabaya'] }),
        country: f.default({ defaultValue: 'Indonesia' }),
        taxNumber: f.valuesFromArray({
          values: ['123456789012345', '987654321098765'],
        }),
        isActive: f.default({ defaultValue: true }),
      },
    },
    suppliers: {
      count: 2,
      columns: {
        id: f.valuesFromArray({ values: ['supplier-1', 'supplier-2'] }),
        code: f.valuesFromArray({ values: ['SUP001', 'SUP002'] }),
        name: f.valuesFromArray({
          values: ['PT Supplier Utama', 'CV Supplier Mitra'],
        }),
        contactPerson: f.valuesFromArray({
          values: ['John Doe', 'Jane Smith'],
        }),
        email: f.valuesFromArray({
          values: ['contact@supplierutama.com', 'info@suppliermitra.com'],
        }),
        phone: f.valuesFromArray({
          values: ['+6281234567893', '+6281234567894'],
        }),
        address: f.valuesFromArray({
          values: ['Jl. Supplier No. 123', 'Jl. Mitra No. 456'],
        }),
        city: f.valuesFromArray({ values: ['Jakarta', 'Surabaya'] }),
        country: f.default({ defaultValue: 'Indonesia' }),
        taxNumber: f.valuesFromArray({
          values: ['123456789012345', '987654321098765'],
        }),
        isActive: f.default({ defaultValue: true }),
      },
    },
    warehouses: {
      count: 2,
      columns: {
        id: f.valuesFromArray({ values: ['warehouse-1', 'warehouse-2'] }),
        code: f.valuesFromArray({ values: ['WH001', 'WH002'] }),
        name: f.valuesFromArray({
          values: ['Warehouse Jakarta Pusat', 'Warehouse Surabaya'],
        }),
        address: f.valuesFromArray({
          values: ['Jl. Warehouse No. 1', 'Jl. Warehouse No. 2'],
        }),
        city: f.valuesFromArray({ values: ['Jakarta', 'Surabaya'] }),
        country: f.default({ defaultValue: 'Indonesia' }),
        manager: f.valuesFromArray({
          values: ['Warehouse Manager', 'Warehouse Manager 2'],
        }),
        phone: f.valuesFromArray({
          values: ['+6281234567895', '+6281234567896'],
        }),
        isActive: f.default({ defaultValue: true }),
      },
    },
    products: {
      count: 3,
      columns: {
        id: f.valuesFromArray({
          values: ['product-1', 'product-2', 'product-3'],
        }),
        code: f.valuesFromArray({ values: ['PROD001', 'PROD002', 'PROD003'] }),
        name: f.valuesFromArray({
          values: [
            'Laptop Dell Inspiron',
            'Printer HP LaserJet',
            'Office Chair',
          ],
        }),
        description: f.valuesFromArray({
          values: [
            'Laptop Dell Inspiron 15 inch',
            'Printer HP LaserJet Pro',
            'Ergonomic office chair',
          ],
        }),
        category: f.valuesFromArray({
          values: ['Electronics', 'Electronics', 'Furniture'],
        }),
        unit: f.default({ defaultValue: 'pcs' }),
        price: f.valuesFromArray({
          values: ['15000000.00', '2500000.00', '1500000.00'],
        }),
        currency: f.default({ defaultValue: 'IDR' }),
        supplierId: f.valuesFromArray({
          values: ['supplier-1', 'supplier-1', 'supplier-2'],
        }),
        isActive: f.default({ defaultValue: true }),
      },
    },
  }));

  await connection.end();
  console.log('✅ Database seeded successfully!');
}

main();
