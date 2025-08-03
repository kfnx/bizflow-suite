import { createConnection } from './index';

/**
 * This script is used to truncate all tables in the database.
 * Truncate does not delete tables.
 *
 * Uses direct SQL with proper foreign key constraint handling.
 * Excludes __drizzle_migrations table to preserve migration history.
 */

async function main() {
  const connection = await createConnection();

  try {
    // Disable foreign key checks temporarily
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Get all table names except __drizzle_migrations
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'bizdocgen' 
      AND table_type = 'BASE TABLE'
      AND table_name != '__drizzle_migrations'
    `);

    // Truncate all tables
    for (const table of tables as any[]) {
      const tableName = table.TABLE_NAME;
      try {
        await connection.execute(`TRUNCATE TABLE \`${tableName}\``);
        console.log(`✅ Truncated ${tableName}`);
      } catch (error: any) {
        console.error(`⚠️ Error truncating ${tableName}:`, error.message);
      }
    }

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🎉 Finished truncating!');
  } catch (error) {
    console.error('❌ Error during truncate:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('❌ Error truncating database:', error);
  process.exit(1);
});
