import { drizzle } from 'drizzle-orm/mysql2';

import { createConnection } from './index';
import * as schema from './schema';

/**
 * This script is used to truncate all tables in the database.
 * Truncate does not delete tables.
 *
 * Delete order follows foreign key dependencies:
 * 1. Child tables (items, movements, stocks, auth tables)
 * 2. Document tables (delivery notes, invoices, quotations, imports)
 * 3. Products (depends on suppliers, warehouses, brands, etc.)
 * 4. Reference tables (brands, machine types, unit measures)
 * 5. Contact person tables
 * 6. Parent tables (suppliers, customers, warehouses, users)
 */

async function main() {
  const connection = await createConnection();
  const db = drizzle(connection, { schema, mode: 'default' });

  // 1. Delete child tables first (items, movements, stocks, auth tables)
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
    await db.delete(schema.transferItems);
    console.log('✅ Truncated transferItems');
  } catch (error) {
    console.error('⚠️ Error truncating transferItems:', error);
  }

  try {
    await db.delete(schema.transfers);
    console.log('✅ Truncated transfers');
  } catch (error) {
    console.error('⚠️ Error truncating transfers:', error);
  }

  try {
    await db.delete(schema.warehouseStocks);
    console.log('✅ Truncated warehouseStocks');
  } catch (error) {
    console.error('⚠️ Error truncating warehouseStocks:', error);
  }

  try {
    await db.delete(schema.importItems);
    console.log('✅ Truncated importItems');
  } catch (error) {
    console.error('⚠️ Error truncating importItems:', error);
  }

  // 2. Delete auth tables (depend on users)
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

  // 3. Delete document tables (delivery notes, invoices, quotations, imports)
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

  // 4. Delete products (depends on suppliers, warehouses, brands, machine types, unit measures)
  try {
    await db.delete(schema.products);
    console.log('✅ Truncated products');
  } catch (error) {
    console.error('⚠️ Error truncating products:', error);
  }

  // 5. Delete contact person tables (depend on customers/suppliers)
  try {
    await db.delete(schema.customerContactPersons);
    console.log('✅ Truncated customerContactPersons');
  } catch (error) {
    console.error('⚠️ Error truncating customerContactPersons:', error);
  }

  try {
    await db.delete(schema.supplierContactPersons);
    console.log('✅ Truncated supplierContactPersons');
  } catch (error) {
    console.error('⚠️ Error truncating supplierContactPersons:', error);
  }

  // 6. Delete reference tables (no dependencies)
  try {
    await db.delete(schema.brands);
    console.log('✅ Truncated brands');
  } catch (error) {
    console.error('⚠️ Error truncating brands:', error);
  }

  try {
    await db.delete(schema.machineTypes);
    console.log('✅ Truncated machineTypes');
  } catch (error) {
    console.error('⚠️ Error truncating machineTypes:', error);
  }

  try {
    await db.delete(schema.unitOfMeasures);
    console.log('✅ Truncated unitOfMeasures');
  } catch (error) {
    console.error('⚠️ Error truncating unitOfMeasures:', error);
  }

  // 7. Delete parent tables (warehouses depend on users, suppliers/customers have no dependencies)
  try {
    await db.delete(schema.warehouses);
    console.log('✅ Truncated warehouses');
  } catch (error) {
    console.error('⚠️ Error truncating warehouses:', error);
  }

  try {
    await db.delete(schema.suppliers);
    console.log('✅ Truncated suppliers');
  } catch (error) {
    console.error('⚠️ Error truncating suppliers:', error);
  }

  try {
    await db.delete(schema.customers);
    console.log('✅ Truncated customers');
  } catch (error) {
    console.error('⚠️ Error truncating customers:', error);
  }

  // 8. Delete users last (many tables depend on users)
  try {
    await db.delete(schema.users);
    console.log('✅ Truncated users');
  } catch (error) {
    console.error('⚠️ Error truncating users:', error);
  }

  try {
    await db.delete(schema.branches);
    console.log('✅ Truncated branches');
  } catch (error) {
    console.error('⚠️ Error truncating branches:', error);
  }

  await connection.end();
  console.log('🎉 Finished truncating!');
}

main().catch((error) => {
  console.error('❌ Error truncating database:', error);
  process.exit(1);
});
