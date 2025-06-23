import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  index,
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

// Users table
export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    avatar: varchar('avatar', { length: 500 }),
    role: varchar('role', { length: 50 }).default('user'), // admin, user, manager
    isActive: boolean('is_active').default(true), // for soft delete
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('email_idx').on(table.email),
    index('role_idx').on(table.role),
  ],
);

// Customers table
export const customers = mysqlTable(
  'customers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    taxNumber: varchar('tax_number', { length: 50 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
    index('email_idx').on(table.email),
  ],
);

// Suppliers table
export const suppliers = mysqlTable(
  'suppliers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    contactPerson: varchar('contact_person', { length: 100 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    taxNumber: varchar('tax_number', { length: 50 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
  ],
);

// Warehouses table
export const warehouses = mysqlTable(
  'warehouses',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    manager: varchar('manager', { length: 100 }),
    phone: varchar('phone', { length: 20 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
  ],
);

// Products table
export const products = mysqlTable(
  'products',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    unit: varchar('unit', { length: 20 }).notNull(), // pcs, kg, m, etc.
    price: decimal('price', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    supplierId: varchar('supplier_id', { length: 36 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
    index('supplier_id_idx').on(table.supplierId),
  ],
);

// Quotations table
export const quotations = mysqlTable(
  'quotations',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    quotationNumber: varchar('quotation_number', { length: 50 })
      .notNull()
      .unique(),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    quotationDate: date('quotation_date').notNull(),
    validUntil: date('valid_until').notNull(),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 15, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    status: varchar('status', { length: 50 }).default('draft'), // draft, sent, accepted, rejected
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('quotation_number_idx').on(table.quotationNumber),
    index('customer_id_idx').on(table.customerId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
  ],
);

// Quotation Items table (for quotation line items)
export const quotationItems = mysqlTable(
  'quotation_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    quotationId: varchar('quotation_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    total: decimal('total', { precision: 15, scale: 2 }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('quotation_id_idx').on(table.quotationId),
    index('product_id_idx').on(table.productId),
  ],
);

// Invoices table
export const invoices = mysqlTable(
  'invoices',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
    quotationId: varchar('quotation_id', { length: 36 }),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    invoiceDate: date('invoice_date').notNull(),
    dueDate: date('due_date').notNull(),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 15, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    status: varchar('status', { length: 50 }).default('draft'), // draft, sent, paid, overdue
    paymentMethod: varchar('payment_method', { length: 100 }),
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('invoice_number_idx').on(table.invoiceNumber),
    index('quotation_id_idx').on(table.quotationId),
    index('customer_id_idx').on(table.customerId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
  ],
);

// Invoice Items table
export const invoiceItems = mysqlTable(
  'invoice_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    invoiceId: varchar('invoice_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    total: decimal('total', { precision: 15, scale: 2 }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('invoice_id_idx').on(table.invoiceId),
    index('product_id_idx').on(table.productId),
  ],
);

// Delivery Notes table
export const deliveryNotes = mysqlTable(
  'delivery_notes',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    deliveryNumber: varchar('delivery_number', { length: 50 })
      .notNull()
      .unique(),
    invoiceId: varchar('invoice_id', { length: 36 }),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    deliveryDate: date('delivery_date').notNull(),
    deliveryMethod: varchar('delivery_method', { length: 100 }),
    driverName: varchar('driver_name', { length: 100 }),
    vehicleNumber: varchar('vehicle_number', { length: 20 }),
    status: varchar('status', { length: 50 }).default('pending'), // pending, in_transit, delivered
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('delivery_number_idx').on(table.deliveryNumber),
    index('invoice_id_idx').on(table.invoiceId),
    index('customer_id_idx').on(table.customerId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
  ],
);

// Delivery Note Items table
export const deliveryNoteItems = mysqlTable(
  'delivery_note_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    deliveryNoteId: varchar('delivery_note_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    deliveredQuantity: decimal('delivered_quantity', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('delivery_note_id_idx').on(table.deliveryNoteId),
    index('product_id_idx').on(table.productId),
  ],
);

// Imports table
export const imports = mysqlTable(
  'imports',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    importNumber: varchar('import_number', { length: 50 }).notNull().unique(),
    supplierId: varchar('supplier_id', { length: 36 }).notNull(),
    warehouseId: varchar('warehouse_id', { length: 36 }).notNull(),
    importDate: date('import_date').notNull(),
    expectedDate: date('expected_date').notNull(),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 15, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    status: varchar('status', { length: 50 }).default('pending'), // pending, received, cancelled
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('import_number_idx').on(table.importNumber),
    index('supplier_id_idx').on(table.supplierId),
    index('warehouse_id_idx').on(table.warehouseId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
  ],
);

// Import Items table
export const importItems = mysqlTable(
  'import_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    importId: varchar('import_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    receivedQuantity: decimal('received_quantity', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    total: decimal('total', { precision: 15, scale: 2 }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('import_id_idx').on(table.importId),
    index('product_id_idx').on(table.productId),
  ],
);

// Transfers table (warehouse transfers)
export const transfers = mysqlTable(
  'transfers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    transferNumber: varchar('transfer_number', { length: 50 })
      .notNull()
      .unique(),
    fromWarehouseId: varchar('from_warehouse_id', { length: 36 }).notNull(),
    toWarehouseId: varchar('to_warehouse_id', { length: 36 }).notNull(),
    transferDate: date('transfer_date').notNull(),
    expectedDate: date('expected_date').notNull(),
    status: varchar('status', { length: 50 }).default('pending'), // pending, in_transit, completed, cancelled
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('transfer_number_idx').on(table.transferNumber),
    index('from_warehouse_id_idx').on(table.fromWarehouseId),
    index('to_warehouse_id_idx').on(table.toWarehouseId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
  ],
);

// Transfer Items table
export const transferItems = mysqlTable(
  'transfer_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    transferId: varchar('transfer_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    transferredQuantity: decimal('transferred_quantity', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('transfer_id_idx').on(table.transferId),
    index('product_id_idx').on(table.productId),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quotations: many(quotations),
  invoices: many(invoices),
  deliveryNotes: many(deliveryNotes),
  imports: many(imports),
  transfers: many(transfers),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  quotations: many(quotations),
  invoices: many(invoices),
  deliveryNotes: many(deliveryNotes),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  products: many(products),
  imports: many(imports),
}));

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  imports: many(imports),
  fromTransfers: many(transfers, { relationName: 'fromWarehouse' }),
  toTransfers: many(transfers, { relationName: 'toWarehouse' }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  quotationItems: many(quotationItems),
  invoiceItems: many(invoiceItems),
  deliveryNoteItems: many(deliveryNoteItems),
  importItems: many(importItems),
  transferItems: many(transferItems),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [quotations.createdBy],
    references: [users.id],
  }),
  quotationItems: many(quotationItems),
  invoices: many(invoices),
}));

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationItems.quotationId],
    references: [quotations.id],
  }),
  product: one(products, {
    fields: [quotationItems.productId],
    references: [products.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  quotation: one(quotations, {
    fields: [invoices.quotationId],
    references: [quotations.id],
  }),
  createdBy: one(users, {
    fields: [invoices.createdBy],
    references: [users.id],
  }),
  invoiceItems: many(invoiceItems),
  deliveryNotes: many(deliveryNotes),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}));

export const deliveryNotesRelations = relations(
  deliveryNotes,
  ({ one, many }) => ({
    customer: one(customers, {
      fields: [deliveryNotes.customerId],
      references: [customers.id],
    }),
    invoice: one(invoices, {
      fields: [deliveryNotes.invoiceId],
      references: [invoices.id],
    }),
    createdBy: one(users, {
      fields: [deliveryNotes.createdBy],
      references: [users.id],
    }),
    deliveryNoteItems: many(deliveryNoteItems),
  }),
);

export const deliveryNoteItemsRelations = relations(
  deliveryNoteItems,
  ({ one }) => ({
    deliveryNote: one(deliveryNotes, {
      fields: [deliveryNoteItems.deliveryNoteId],
      references: [deliveryNotes.id],
    }),
    product: one(products, {
      fields: [deliveryNoteItems.productId],
      references: [products.id],
    }),
  }),
);

export const importsRelations = relations(imports, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [imports.supplierId],
    references: [suppliers.id],
  }),
  warehouse: one(warehouses, {
    fields: [imports.warehouseId],
    references: [warehouses.id],
  }),
  createdBy: one(users, {
    fields: [imports.createdBy],
    references: [users.id],
  }),
  importItems: many(importItems),
}));

export const importItemsRelations = relations(importItems, ({ one }) => ({
  import: one(imports, {
    fields: [importItems.importId],
    references: [imports.id],
  }),
  product: one(products, {
    fields: [importItems.productId],
    references: [products.id],
  }),
}));

export const transfersRelations = relations(transfers, ({ one, many }) => ({
  fromWarehouse: one(warehouses, {
    fields: [transfers.fromWarehouseId],
    references: [warehouses.id],
    relationName: 'fromWarehouse',
  }),
  toWarehouse: one(warehouses, {
    fields: [transfers.toWarehouseId],
    references: [warehouses.id],
    relationName: 'toWarehouse',
  }),
  createdBy: one(users, {
    fields: [transfers.createdBy],
    references: [users.id],
  }),
  transferItems: many(transferItems),
}));

export const transferItemsRelations = relations(transferItems, ({ one }) => ({
  transfer: one(transfers, {
    fields: [transferItems.transferId],
    references: [transfers.id],
  }),
  product: one(products, {
    fields: [transferItems.productId],
    references: [products.id],
  }),
}));
