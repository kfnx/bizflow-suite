# Proposed import_items Schema Enhancement

## Current Schema Issues
The current `import_items` table only stores basic pricing/quantity data but lacks all product specification fields needed for product creation during verification.

## Proposed Solution: Expand import_items Table

```sql
export const importItems = mysqlTable(
  'import_items',
  {
    id: varchar('id', { length: 36 }).primaryKey().notNull().default(sql`(UUID())`),
    importId: varchar('import_id', { length: 36 }).notNull(),
    
    // Pricing & Quantity (existing)
    priceRMB: decimal('price_rmb', { precision: 15, scale: 2 }).notNull(),
    quantity: int('quantity').notNull().default(1),
    notes: text('notes'),
    
    // Product Creation Data (NEW)
    // Core product fields
    category: mysqlEnum('category', PRODUCT_CATEGORY).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    brandId: varchar('brand_id', { length: 36 }),
    condition: varchar('condition', { length: 50 }).default('new'),
    year: int('year'),
    
    // Category-specific fields
    machineTypeId: varchar('machine_type_id', { length: 36 }), // for serialized
    unitOfMeasureId: varchar('unit_of_measure_id', { length: 36 }), // for non-serialized/bulk
    modelOrPartNumber: varchar('model_or_part_number', { length: 100 }),
    machineNumber: varchar('machine_number', { length: 100 }),
    engineNumber: varchar('engine_number', { length: 100 }),
    serialNumber: varchar('serial_number', { length: 100 }),
    model: varchar('model', { length: 100 }),
    engineModel: varchar('engine_model', { length: 100 }),
    enginePower: varchar('engine_power', { length: 50 }),
    operatingWeight: varchar('operating_weight', { length: 50 }),
    batchOrLotNumber: varchar('batch_or_lot_number', { length: 100 }),
    modelNumber: varchar('model_number', { length: 100 }),
    
    // Reference to existing product (for updates)
    productId: varchar('product_id', { length: 36 }), // nullable - only set if updating existing product
    
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('import_id_idx').on(table.importId),
    index('product_id_idx').on(table.productId),
    index('category_idx').on(table.category),
    index('machine_number_idx').on(table.machineNumber), // for duplicate detection
    foreignKey({
      columns: [table.importId],
      foreignColumns: [imports.id],
      name: 'fk_import_items_import',
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: 'fk_import_items_product',
    }),
    foreignKey({
      columns: [table.brandId],
      foreignColumns: [brands.id],
      name: 'fk_import_items_brand',
    }),
    foreignKey({
      columns: [table.machineTypeId],
      foreignColumns: [machineTypes.id],
      name: 'fk_import_items_machine_type',
    }),
    foreignKey({
      columns: [table.unitOfMeasureId],
      foreignColumns: [unitOfMeasures.id],
      name: 'fk_import_items_unit_of_measure',
    }),
  ],
);
```

## Benefits of This Approach

1. **Complete Data Storage**: All product specs stored during import creation
2. **Easy Verification**: Simple transfer from import_items → products
3. **Duplicate Detection**: Can check for existing products by machineNumber before verification
4. **Data Integrity**: Same validation rules as products table
5. **Audit Trail**: Keep import history even after verification

## Migration Required

```sql
-- Add new columns to existing import_items table
ALTER TABLE import_items ADD COLUMN category ENUM('serialized', 'non_serialized', 'bulk') NOT NULL;
ALTER TABLE import_items ADD COLUMN name VARCHAR(100) NOT NULL;
ALTER TABLE import_items ADD COLUMN description TEXT;
-- ... add all other product fields
```

## Verification Logic Enhancement

```typescript
// During verification, for each import item:
1. Check if productId exists (updating existing product)
   - Update product with new data
   - Create stock movement for quantity difference
   
2. If no productId (new product):
   - Check for existing product by machineNumber (for serialized)
   - If exists: link and update
   - If not exists: create new product
   - Create stock movement for new quantity
```

## Alternative Solutions Considered

**Option 2: Separate import_product_data table**
- More normalized but adds complexity
- Requires additional joins

**Option 3: JSON column for product specs**
- Less structured, harder to query/validate
- Database-specific features

**Option 4: Pre-create products in draft state**
- Complicates product queries (need to filter drafts)
- More complex state management

## Recommendation

Proceed with **Option 1** (expand import_items) as it provides the cleanest solution with minimal complexity while maintaining data integrity and enabling proper verification workflow.