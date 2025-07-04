import { drizzle } from 'drizzle-orm/mysql2';

import { createConnection } from '../index';
import * as schema from '../schema';
import { users } from './users';
import { customers } from './customers';
import { suppliers } from './suppliers';
import { warehouses } from './warehouses';
import { products } from './products';
import { quotations, quotationItems } from './quotations';
import { invoices, invoiceItems } from './invoices';
import { deliveryNotes, deliveryNoteItems } from './delivery-notes';

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

  console.log('🔄 Seeding suppliers...');
  await db.insert(schema.suppliers).values(suppliers);
  console.log(`✅ Seeded ${suppliers.length} suppliers`);

  console.log('🔄 Seeding warehouses...');
  await db.insert(schema.warehouses).values(warehouses);
  console.log(`✅ Seeded ${warehouses.length} warehouses`);

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

  await connection.end();
  console.log('🎉 Database seeded successfully with complete sample data!');
}

main().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});