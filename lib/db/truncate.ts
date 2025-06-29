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
  await db.delete(schema.quotationItems);
  await db.delete(schema.quotations);
  await db.delete(schema.products);
  await db.delete(schema.warehouses);
  await db.delete(schema.suppliers);
  await db.delete(schema.customers);
  await db.delete(schema.users);
  console.log('🗑️ Truncated existing data');
  await connection.end();
  console.log('✅ Database truncated successfully!');
}

main().catch((error) => {
  console.error('❌ Error truncating database:', error);
  process.exit(1);
});
