import { drizzle } from 'drizzle-orm/mysql2';

import { createConnection } from '../index';
import * as schema from '../schema';
import { brands } from './brands';
import { customerContactPersons, customers } from './customers';
import { deliveryNoteItems, deliveryNotes } from './delivery-notes';
import { importItems, imports } from './imports';
import { invoiceItems, invoices } from './invoices';
import { machineTypes } from './machine-types';
import { products } from './products';
import { quotationItems, quotations } from './quotations';
import { stockMovements } from './stock-movements';
import { supplierContactPersons, suppliers } from './suppliers';
import { unitOfMeasures } from './unit-of-measures';
import { users } from './users';
import { warehouses } from './warehouses';

async function main() {
  const connection = await createConnection();
  const db = drizzle(connection, { schema, mode: 'default' });

  // Direct database inserts to ensure proper relationships
  console.log('🔄 Seeding users...');
  await db.insert(schema.users).values(users);
  console.log(`✅ Seeded ${users.length} users`);

  console.log('🔄 Seeding customers...');
  await db.insert(schema.customers).values(customers);
  console.log(`✅ Seeded ${customers.length} customers`);

  console.log('🔄 Seeding customer contact persons...');
  await db.insert(schema.customerContactPersons).values(customerContactPersons);
  console.log(
    `✅ Seeded ${customerContactPersons.length} customer contact persons`,
  );

  console.log('🔄 Seeding suppliers...');
  await db.insert(schema.suppliers).values(suppliers);
  console.log(`✅ Seeded ${suppliers.length} suppliers`);

  console.log('🔄 Seeding supplier contact persons...');
  await db.insert(schema.supplierContactPersons).values(supplierContactPersons);
  console.log(
    `✅ Seeded ${supplierContactPersons.length} supplier contact persons`,
  );

  console.log('🔄 Seeding warehouses...');
  await db.insert(schema.warehouses).values(warehouses);
  console.log(`✅ Seeded ${warehouses.length} warehouses`);

  console.log('🔄 Seeding brands...');
  await db.insert(schema.brands).values(brands);
  console.log(`✅ Seeded ${brands.length} brands`);

  console.log('🔄 Seeding machine types...');
  await db.insert(schema.machineTypes).values(machineTypes);
  console.log(`✅ Seeded ${machineTypes.length} machine types`);

  console.log('🔄 Seeding unit of measures...');
  await db.insert(schema.unitOfMeasures).values(unitOfMeasures);
  console.log(`✅ Seeded ${unitOfMeasures.length} unit of measures`);

  console.log('🔄 Seeding products...');
  await db.insert(schema.products).values(products);
  console.log(`✅ Seeded ${products.length} products`);

  console.log('🔄 Seeding quotations...');
  await db.insert(schema.quotations).values(quotations);
  console.log(`✅ Seeded ${quotations.length} quotations`);

  console.log('🔄 Seeding quotation items...');
  await db.insert(schema.quotationItems).values(quotationItems);
  console.log(`✅ Seeded ${quotationItems.length} quotation items`);

  console.log('🔄 Seeding invoices...');
  await db.insert(schema.invoices).values(invoices);
  console.log(`✅ Seeded ${invoices.length} invoices`);

  console.log('🔄 Seeding invoice items...');
  await db.insert(schema.invoiceItems).values(invoiceItems);
  console.log(`✅ Seeded ${invoiceItems.length} invoice items`);

  console.log('🔄 Seeding delivery notes...');
  await db.insert(schema.deliveryNotes).values(deliveryNotes);
  console.log(`✅ Seeded ${deliveryNotes.length} delivery notes`);

  console.log('🔄 Seeding delivery note items...');
  await db.insert(schema.deliveryNoteItems).values(deliveryNoteItems);
  console.log(`✅ Seeded ${deliveryNoteItems.length} delivery note items`);

  console.log('🔄 Seeding imports...');
  await db.insert(schema.imports).values(imports);
  console.log(`✅ Seeded ${imports.length} imports`);

  console.log('🔄 Seeding import items...');
  await db.insert(schema.importItems).values(importItems);
  console.log(`✅ Seeded ${importItems.length} import items`);

  console.log('🔄 Seeding stock movements...');
  await db.insert(schema.stockMovements).values(stockMovements);
  console.log(`✅ Seeded ${stockMovements.length} stock movements`);

  await connection.end();
  console.log('🎉 Database seeded successfully with complete sample data!');
}

main().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
