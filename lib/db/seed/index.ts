import { drizzle } from 'drizzle-orm/mysql2';

import { db, endPool } from '../index';
import * as schema from '../schema';
import { branches } from './branches';
import { brands } from './brands';
import { customerContactPersons, customers } from './customers';
import { deliveryNoteItems, deliveryNotes } from './delivery-notes';
import { importItems, imports } from './imports';
import { invoiceItems, invoices } from './invoices';
import { machineModel } from './machine-model';
import { machineTypes } from './machine-types';
import { partNumbers } from './part-number';
import { permissions, rolePermissions, userRoles } from './permissions';
import { products } from './products';
import { quotationItems, quotations } from './quotations';
import { roles } from './roles';
import { supplierContactPersons, suppliers } from './suppliers';
import { transferItems, transfers } from './transfers';
import { unitOfMeasures } from './unit-of-measures';
import { users } from './users';
import { warehouses } from './warehouses';

async function main() {
  // Use the existing database pool instead of creating a new connection

  // Helper function to insert data with error handling
  const insertWithErrorHandling = async (
    table: any,
    data: any[],
    tableName: string,
  ) => {
    try {
      await db.insert(table).values(data);
      console.log(`✅ Seeded ${data.length} ${tableName}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ Skipped ${tableName} - data already exists`);
      } else {
        console.error(`❌ Error seeding ${tableName}:`, error);
        throw error;
      }
    }
  };

  // Direct database inserts to ensure proper relationships
  await insertWithErrorHandling(schema.branches, branches, 'branches');

  await insertWithErrorHandling(schema.users, users, 'users');

  await insertWithErrorHandling(schema.customers, customers, 'customers');

  await insertWithErrorHandling(
    schema.customerContactPersons,
    customerContactPersons,
    'customer contact persons',
  );

  await insertWithErrorHandling(schema.suppliers, suppliers, 'suppliers');

  await insertWithErrorHandling(
    schema.supplierContactPersons,
    supplierContactPersons,
    'supplier contact persons',
  );

  await insertWithErrorHandling(schema.warehouses, warehouses, 'warehouses');

  await insertWithErrorHandling(schema.brands, brands, 'brands');

  await insertWithErrorHandling(
    schema.machineTypes,
    machineTypes,
    'machine types',
  );

  await insertWithErrorHandling(
    schema.machineModel,
    machineModel,
    'machine model',
  );

  await insertWithErrorHandling(
    schema.partNumbers,
    partNumbers,
    'part numbers',
  );

  await insertWithErrorHandling(
    schema.unitOfMeasures,
    unitOfMeasures,
    'unit of measures',
  );

  await insertWithErrorHandling(schema.products, products, 'products');

  await insertWithErrorHandling(schema.quotations, quotations, 'quotations');

  await insertWithErrorHandling(
    schema.quotationItems,
    quotationItems,
    'quotation items',
  );

  await insertWithErrorHandling(schema.invoices, invoices, 'invoices');

  await insertWithErrorHandling(
    schema.invoiceItems,
    invoiceItems,
    'invoice items',
  );

  await insertWithErrorHandling(
    schema.deliveryNotes,
    deliveryNotes,
    'delivery notes',
  );

  await insertWithErrorHandling(
    schema.deliveryNoteItems,
    deliveryNoteItems,
    'delivery note items',
  );

  await insertWithErrorHandling(schema.imports, imports, 'imports');

  await insertWithErrorHandling(
    schema.importItems,
    importItems,
    'import items',
  );

  await insertWithErrorHandling(schema.transfers, transfers, 'transfers');

  await insertWithErrorHandling(
    schema.transferItems,
    transferItems,
    'transfer items',
  );

  await insertWithErrorHandling(schema.roles, roles, 'roles');

  await insertWithErrorHandling(schema.permissions, permissions, 'permissions');

  await insertWithErrorHandling(
    schema.rolePermissions,
    rolePermissions,
    'role permissions',
  );

  await insertWithErrorHandling(schema.userRoles, userRoles, 'user roles');

  console.log('🎉 Finished seeding!');

  // End the pool to free up connections
  await endPool();
}

main().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
