import { drizzle } from 'drizzle-orm/mysql2';

import { createConnection } from './index';
import * as schema from './schema';

/**
 * This script is used to truncate all tables in the database.
 * Truncate does not delete tables.
 */

async function main() {
  const connection = await createConnection();
  const db = drizzle(connection, { schema, mode: 'default' });

  // Clear existing data in correct foreign key order (child tables first, then parents)

  // 1. Delete all item tables (child tables)
  try {
    await db.delete(schema.quotationItems);
    console.log('✅ Truncated quotationItems');
  } catch (error) {
    console.error('⚠️ Error truncating quotationItems:', error);
  }

  try {
    await db.delete(schema.invoiceItems);
    console.log('✅ Truncated invoiceItems');
  } catch (error) {
    console.error('⚠️ Error truncating invoiceItems:', error);
  }

  try {
    await db.delete(schema.deliveryNoteItems);
    console.log('✅ Truncated deliveryNoteItems');
  } catch (error) {
    console.error('⚠️ Error truncating deliveryNoteItems:', error);
  }

  try {
    await db.delete(schema.importItems);
    console.log('✅ Truncated importItems');
  } catch (error) {
    console.error('⚠️ Error truncating importItems:', error);
  }

  try {
    await db.delete(schema.transferItems);
    console.log('✅ Truncated transferItems');
  } catch (error) {
    console.error('⚠️ Error truncating transferItems:', error);
  }

  try {
    await db.delete(schema.stockMovements);
    console.log('✅ Truncated stockMovements');
  } catch (error) {
    console.error('⚠️ Error truncating stockMovements:', error);
  }

  // 2. Delete auth tables
  try {
    await db.delete(schema.accounts);
    console.log('✅ Truncated accounts');
  } catch (error) {
    console.error('⚠️ Error truncating accounts:', error);
  }

  try {
    await db.delete(schema.sessions);
    console.log('✅ Truncated sessions');
  } catch (error) {
    console.error('⚠️ Error truncating sessions:', error);
  }

  try {
    await db.delete(schema.verificationTokens);
    console.log('✅ Truncated verificationTokens');
  } catch (error) {
    console.error('⚠️ Error truncating verificationTokens:', error);
  }

  // 3. Delete warehouse stocks
  try {
    await db.delete(schema.warehouseStocks);
    console.log('✅ Truncated warehouseStocks');
  } catch (error) {
    console.error('⚠️ Error truncating warehouseStocks:', error);
  }

  // 4. Delete main document tables
  try {
    await db.delete(schema.deliveryNotes);
    console.log('✅ Truncated deliveryNotes');
  } catch (error) {
    console.error('⚠️ Error truncating deliveryNotes:', error);
  }

  try {
    await db.delete(schema.invoices);
    console.log('✅ Truncated invoices');
  } catch (error) {
    console.error('⚠️ Error truncating invoices:', error);
  }

  try {
    await db.delete(schema.quotations);
    console.log('✅ Truncated quotations');
  } catch (error) {
    console.error('⚠️ Error truncating quotations:', error);
  }

  try {
    await db.delete(schema.imports);
    console.log('✅ Truncated imports');
  } catch (error) {
    console.error('⚠️ Error truncating imports:', error);
  }

  try {
    await db.delete(schema.transfers);
    console.log('✅ Truncated transfers');
  } catch (error) {
    console.error('⚠️ Error truncating transfers:', error);
  }

  // 5. Delete products (references suppliers)
  try {
    await db.delete(schema.products);
    console.log('✅ Truncated products');
  } catch (error) {
    console.error('⚠️ Error truncating products:', error);
  }

  // 6. Delete parent tables (no foreign key dependencies)
  try {
    await db.delete(schema.customers);
    console.log('✅ Truncated customers');
  } catch (error) {
    console.error('⚠️ Error truncating customers:', error);
  }

  try {
    await db.delete(schema.users);
    console.log('✅ Truncated users');
  } catch (error) {
    console.error('⚠️ Error truncating users:', error);
  }

  try {
    await db.delete(schema.suppliers);
    console.log('✅ Truncated suppliers');
  } catch (error) {
    console.error('⚠️ Error truncating suppliers:', error);
  }

  try {
    await db.delete(schema.warehouses);
    console.log('✅ Truncated warehouses');
  } catch (error) {
    console.error('⚠️ Error truncating warehouses:', error);
  }
  await connection.end();
  console.log('🎉 Finished truncating!');
}

main().catch((error) => {
  console.error('❌ Error truncating database:', error);
  process.exit(1);
});
