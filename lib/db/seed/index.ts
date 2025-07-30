import { drizzle } from 'drizzle-orm/mysql2';

import { createConnection } from '../index';
import * as schema from '../schema';
import { branches } from './branches';
import { brands } from './brands';
import { customerContactPersons, customers } from './customers';
import { deliveryNoteItems, deliveryNotes } from './delivery-notes';
import { importItems, imports } from './imports';
import { invoiceItems, invoices } from './invoices';
import { machineTypes } from './machine-types';
import { permissions, rolePermissions, roles, userRoles } from './permissions';
import { products } from './products';
import { quotationItems, quotations } from './quotations';
import { supplierContactPersons, suppliers } from './suppliers';
import { transferItems, transfers } from './transfers';
import { unitOfMeasures } from './unit-of-measures';
import { users } from './users';
import { warehouses } from './warehouses';

async function main() {
  const connection = await createConnection();
  const db = drizzle(connection, { schema, mode: 'default' });

  // Direct database inserts to ensure proper relationships
  await db.insert(schema.branches).values(branches);
  console.log(`✅ Seeded ${branches.length} branches`);

  await db.insert(schema.users).values(users);
  console.log(`✅ Seeded ${users.length} users`);

  await db.insert(schema.customers).values(customers);
  console.log(`✅ Seeded ${customers.length} customers`);

  await db.insert(schema.customerContactPersons).values(customerContactPersons);
  console.log(
    `✅ Seeded ${customerContactPersons.length} customer contact persons`,
  );

  await db.insert(schema.suppliers).values(suppliers);
  console.log(`✅ Seeded ${suppliers.length} suppliers`);

  await db.insert(schema.supplierContactPersons).values(supplierContactPersons);
  console.log(
    `✅ Seeded ${supplierContactPersons.length} supplier contact persons`,
  );

  await db.insert(schema.warehouses).values(warehouses);
  console.log(`✅ Seeded ${warehouses.length} warehouses`);

  await db.insert(schema.brands).values(brands);
  console.log(`✅ Seeded ${brands.length} brands`);

  await db.insert(schema.machineTypes).values(machineTypes);
  console.log(`✅ Seeded ${machineTypes.length} machine types`);

  await db.insert(schema.unitOfMeasures).values(unitOfMeasures);
  console.log(`✅ Seeded ${unitOfMeasures.length} unit of measures`);

  await db.insert(schema.products).values(products);
  console.log(`✅ Seeded ${products.length} products`);

  await db.insert(schema.quotations).values(quotations);
  console.log(`✅ Seeded ${quotations.length} quotations`);

  await db.insert(schema.quotationItems).values(quotationItems);
  console.log(`✅ Seeded ${quotationItems.length} quotation items`);

  await db.insert(schema.invoices).values(invoices);
  console.log(`✅ Seeded ${invoices.length} invoices`);

  await db.insert(schema.invoiceItems).values(invoiceItems);
  console.log(`✅ Seeded ${invoiceItems.length} invoice items`);

  await db.insert(schema.deliveryNotes).values(deliveryNotes);
  console.log(`✅ Seeded ${deliveryNotes.length} delivery notes`);

  await db.insert(schema.deliveryNoteItems).values(deliveryNoteItems);
  console.log(`✅ Seeded ${deliveryNoteItems.length} delivery note items`);

  await db.insert(schema.imports).values(imports);
  console.log(`✅ Seeded ${imports.length} imports`);

  await db.insert(schema.importItems).values(importItems);
  console.log(`✅ Seeded ${importItems.length} import items`);

  await db.insert(schema.transfers).values(transfers);
  console.log(`✅ Seeded ${transfers.length} transfers`);

  await db.insert(schema.transferItems).values(transferItems);
  console.log(`✅ Seeded ${transferItems.length} transfer items`);

  await db.insert(schema.roles).values(roles);
  console.log(`✅ Seeded ${roles.length} roles`);

  await db.insert(schema.permissions).values(permissions);
  console.log(`✅ Seeded ${permissions.length} permissions`);

  await db.insert(schema.rolePermissions).values(rolePermissions);
  console.log(`✅ Seeded ${rolePermissions.length} role permissions`);

  await db.insert(schema.userRoles).values(userRoles);
  console.log(`✅ Seeded ${userRoles.length} user roles`);

  await connection.end();
  console.log('🎉 Database seeded successfully with complete sample data!');
}

main().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
