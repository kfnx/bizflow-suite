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

  // Clear existing data in reverse foreign key order (ignore errors if tables empty)
  try {
    await db.delete(schema.transferItems);
  } catch (error) {
    console.error('⚠️ Error truncating transferItems:', error);
  }
  try {
    await db.delete(schema.transfers);
  } catch (error) {
    console.error('⚠️ Error truncating transfers:', error);
  }
  try {
    await db.delete(schema.stockMovements);
  } catch (error) {
    console.error('⚠️ Error truncating stockMovements:', error);
  }
  try {
    await db.delete(schema.warehouseStocks);
  } catch (error) {
    console.error('⚠️ Error truncating warehouseStocks:', error);
  }
  try {
    await db.delete(schema.importItems);
  } catch (error) {
    console.error('⚠️ Error truncating importItems:', error);
  }
  try {
    await db.delete(schema.imports);
  } catch (error) {
    console.error('⚠️ Error truncating imports:', error);
  }
  try {
    await db.delete(schema.warehouses);
  } catch (error) {
    console.error('⚠️ Error truncating warehouses:', error);
  }
  try {
    await db.delete(schema.suppliers);
  } catch (error) {
    console.error('⚠️ Error truncating suppliers:', error);
  }
  try {
    await db.delete(schema.customers);
  } catch (error) {
    console.error('⚠️ Error truncating customers:', error);
  }
  try {
    await db.delete(schema.users);
  } catch (error) {
    console.error('⚠️ Error truncating users:', error);
  }
  try {
    await db.delete(schema.products);
  } catch (error) {
    console.error('⚠️ Error truncating products:', error);
  }
  await connection.end();
  console.log('✅ Finished truncating!');
}

main().catch((error) => {
  console.error('❌ Error truncating database:', error);
  process.exit(1);
});
