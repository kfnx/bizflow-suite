import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  foreignKey,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { DEFAULT_PASSWORD } from './constants';
import { INVOICE_STATUS, QUOTATION_STATUS } from './enum';

// Users table
export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    code: varchar('code', { length: 50 }).notNull().unique(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    NIK: varchar('nik', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 })
      .notNull()
      .default(DEFAULT_PASSWORD),
    jobTitle: varchar('job_title', { length: 100 }),
    joinDate: date('join_date').notNull(),
    type: varchar('type', { length: 50 }).default('full-time'), // full-time, resigned, contract
    phone: varchar('phone', { length: 20 }),
    avatar: varchar('avatar', { length: 500 }),
    role: varchar('role', { length: 50 }).notNull().default('staff'), // staff, manager, director
    signature: varchar('signature', { length: 500 }),
    isActive: boolean('is_active').default(true), // for soft delete
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('email_idx').on(table.email),
    index('role_idx').on(table.role),
  ],
);

// NextAuth.js required tables
export const accounts = mysqlTable(
  'accounts',
  {
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index('userId_idx').on(account.userId),
  ],
);

export const sessions = mysqlTable('sessions', {
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
  userId: varchar('userId', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = mysqlTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// Customers table
export const customers = mysqlTable(
  'customers',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).default('individual'), // individual, company
    npwp: varchar('npwp', { length: 50 }),
    npwp16: varchar('npwp16', { length: 50 }),
    billingAddress: text('billing_address'),
    shippingAddress: text('shipping_address'),
    contactPersonName: varchar('contact_person_name', { length: 100 }),
    contactPersonEmail: varchar('contact_person_email', { length: 255 }),
    contactPersonPhone: varchar('contact_person_phone', { length: 20 }),
    paymentTerms: varchar('payment_terms', { length: 100 }), // NET 30, NET 15
    isPPN: boolean('is_ppn').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
  ],
);

// Suppliers table
export const suppliers = mysqlTable(
  'suppliers',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    country: varchar('country', { length: 50 }),
    address: text('address'),
    transactionCurrency: varchar('transaction_currency', { length: 3 }).default(
      'USD',
    ),
    postalCode: varchar('postal_code', { length: 20 }),
    contactPersonName: varchar('contact_person_name', { length: 100 }),
    contactPersonEmail: varchar('contact_person_email', { length: 255 }),
    contactPersonPhone: varchar('contact_person_phone', { length: 20 }),
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
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    code: varchar('code', { length: 100 }).notNull().unique(), // This serves as both code and serial number
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    brand: varchar('brand', { length: 100 }),
    model: varchar('model', { length: 100 }),
    year: int('year'),
    condition: varchar('condition', { length: 50 }).default('new'), // new, used, refurbished
    status: varchar('status', { length: 50 }).default('in_stock'), // in_stock, out_of_stock, discontinued
    warehouseId: varchar('warehouse_id', { length: 36 }),
    unit: varchar('unit', { length: 20 }).notNull(), // pcs, kg, m, etc.
    price: decimal('price', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    // Product Specifications
    engineModel: varchar('engine_model', { length: 100 }),
    enginePower: varchar('engine_power', { length: 50 }), // e.g., "378 hp"
    operatingWeight: varchar('operating_weight', { length: 50 }), // e.g., "47,250 kg"
    supplierId: varchar('supplier_id', { length: 36 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
    index('brand_idx').on(table.brand),
    index('category_idx').on(table.category),
    index('status_idx').on(table.status),
    index('supplier_id_idx').on(table.supplierId),
    foreignKey({
      columns: [table.supplierId],
      foreignColumns: [suppliers.id],
      name: 'fk_products_supplier',
    }),
  ],
);

// Quotations table
export const quotations = mysqlTable(
  'quotations',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    quotationNumber: varchar('quotation_number', { length: 50 }) // QT/2025/04/001
      .notNull()
      .unique(),
    quotationDate: date('quotation_date').notNull(),
    validUntil: date('valid_until').notNull(),
    customerId: varchar('customer_id', { length: 36 }),
    isIncludePPN: boolean('is_include_ppn').default(false),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 15, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    status: mysqlEnum('status', QUOTATION_STATUS).default(
      QUOTATION_STATUS.DRAFT,
    ),
    notes: text('notes'),
    termsAndConditions: text('terms_and_conditions'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    approvedBy: varchar('approver_by', { length: 36 }),
    customerResponseDate: timestamp('customer_response_date'),
    customerResponseNotes: text('customer_response_notes'),
    customerAcceptanceInfo: text('customer_acceptance_info'),
    rejectionReason: text('rejection_reason'),
    revisionReason: text('revision_reason'),
    revisionVersion: int('revision_version').default(1),
    invoicedAt: timestamp('invoiced_at'),
    invoiceId: varchar('invoice_id', { length: 36 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('quotation_number_idx').on(table.quotationNumber),
    index('customer_id_idx').on(table.customerId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: 'fk_quotations_customer',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_quotations_created_by',
    }),
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [users.id],
      name: 'fk_quotations_approver',
    }),
  ],
);

// Quotation Items table (for quotation line items)
export const quotationItems = mysqlTable(
  'quotation_items',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    foreignKey({
      columns: [table.quotationId],
      foreignColumns: [quotations.id],
      name: 'fk_quotation_items_quotation',
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: 'fk_quotation_items_product',
    }),
  ],
);

// Invoices table
export const invoices = mysqlTable(
  'invoices',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
    quotationId: varchar('quotation_id', { length: 36 }),
    invoiceDate: date('invoice_date').notNull(),
    dueDate: date('due_date').notNull(),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 15, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 15, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    status: mysqlEnum('status', INVOICE_STATUS).default(INVOICE_STATUS.DRAFT),
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
    foreignKey({
      columns: [table.quotationId],
      foreignColumns: [quotations.id],
      name: 'fk_invoices_quotation',
    }),
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: 'fk_invoices_customer',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_invoices_created_by',
    }),
  ],
);

// Invoice Items table
export const invoiceItems = mysqlTable(
  'invoice_items',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    invoiceId: varchar('invoice_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    total: decimal('total', { precision: 15, scale: 2 }).notNull(),
    paymentTerms: varchar('payment_terms', { length: 100 }),
    termsAndConditions: text('terms_and_conditions'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('invoice_id_idx').on(table.invoiceId),
    index('product_id_idx').on(table.productId),
    foreignKey({
      columns: [table.invoiceId],
      foreignColumns: [invoices.id],
      name: 'fk_invoice_items_invoice',
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: 'fk_invoice_items_product',
    }),
  ],
);

// keep simple type for now but use mysql enum when system requirement is clearer
export type DeliveryNoteStatus = 'pending' | 'delivered' | 'canceled';

// Delivery Notes table
export const deliveryNotes = mysqlTable(
  'delivery_notes',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    deliveredBy: varchar('delivered_by', { length: 36 }),
    receivedBy: varchar('received_by', { length: 36 }),
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(), // == preparedBy
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('delivery_number_idx').on(table.deliveryNumber),
    index('invoice_id_idx').on(table.invoiceId),
    index('customer_id_idx').on(table.customerId),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
    foreignKey({
      columns: [table.invoiceId],
      foreignColumns: [invoices.id],
      name: 'fk_delivery_notes_invoice',
    }),
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: 'fk_delivery_notes_customer',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_delivery_notes_created_by',
    }),
    foreignKey({
      columns: [table.deliveredBy],
      foreignColumns: [users.id],
      name: 'fk_delivery_notes_delivered_by',
    }),
    foreignKey({
      columns: [table.receivedBy],
      foreignColumns: [users.id],
      name: 'fk_delivery_notes_received_by',
    }),
  ],
);

// Delivery Note Items table
export const deliveryNoteItems = mysqlTable(
  'delivery_note_items',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    foreignKey({
      columns: [table.deliveryNoteId],
      foreignColumns: [deliveryNotes.id],
      name: 'fk_delivery_note_items_delivery_note',
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: 'fk_delivery_note_items_product',
    }),
  ],
);

// Imports table
export const imports = mysqlTable(
  'imports',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    foreignKey({
      columns: [table.supplierId],
      foreignColumns: [suppliers.id],
      name: 'fk_imports_supplier',
    }),
    foreignKey({
      columns: [table.warehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_imports_warehouse',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_imports_created_by',
    }),
  ],
);

// Import Items table
export const importItems = mysqlTable(
  'import_items',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
  ],
);

// Transfers table (warehouse transfers)
export const transfers = mysqlTable(
  'transfers',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    foreignKey({
      columns: [table.fromWarehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_transfers_from_warehouse',
    }),
    foreignKey({
      columns: [table.toWarehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_transfers_to_warehouse',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_transfers_created_by',
    }),
  ],
);

// Transfer Items table
export const transferItems = mysqlTable(
  'transfer_items',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
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
    foreignKey({
      columns: [table.transferId],
      foreignColumns: [transfers.id],
      name: 'fk_transfer_items_transfer',
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: 'fk_transfer_items_product',
    }),
  ],
);

// Warehouse Stocks table
export const warehouseStocks = mysqlTable(
  'warehouse_stocks',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    warehouseId: varchar('warehouse_id', { length: 36 }).notNull(),
    machineId: varchar('machine_id', { length: 36 }).notNull(), // FK to products.id
    lastCheck: timestamp('last_check'),
    condition: varchar('condition', { length: 20 }).notNull(), // good, damaged, repair
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('warehouse_id_idx').on(table.warehouseId),
    index('machine_id_idx').on(table.machineId),
    index('condition_idx').on(table.condition),
    foreignKey({
      columns: [table.warehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_warehouse_stocks_warehouse',
    }),
    foreignKey({
      columns: [table.machineId],
      foreignColumns: [products.id],
      name: 'fk_warehouse_stocks_machine',
    }),
  ],
);

// Stock Movements table
export const stockMovements = mysqlTable(
  'stock_movements',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    warehouseStockId: varchar('warehouse_stock_id', { length: 36 }).notNull(),
    warehouseId: varchar('warehouse_id', { length: 36 }).notNull(),
    machineId: varchar('machine_id', { length: 36 }).notNull(),
    quantity: int('quantity').notNull(),
    movementType: varchar('movement_type', { length: 20 }).notNull(), // in, out, transfer, adjustment
    invoiceId: varchar('invoice_id', { length: 50 }),
    deliveryId: varchar('delivery_id', { length: 50 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('warehouse_stock_id_idx').on(table.warehouseStockId),
    index('warehouse_id_idx').on(table.warehouseId),
    index('machine_id_idx').on(table.machineId),
    index('movement_type_idx').on(table.movementType),
    foreignKey({
      columns: [table.warehouseStockId],
      foreignColumns: [warehouseStocks.id],
      name: 'fk_stock_movements_warehouse_stock',
    }),
    foreignKey({
      columns: [table.warehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_stock_movements_warehouse',
    }),
    foreignKey({
      columns: [table.machineId],
      foreignColumns: [products.id],
      name: 'fk_stock_movements_machine',
    }),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quotations: many(quotations),
  invoices: many(invoices),
  deliveryNotes: many(deliveryNotes),
  imports: many(imports),
  transfers: many(transfers),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
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

export const warehouseStocksRelations = relations(
  warehouseStocks,
  ({ one, many }) => ({
    warehouse: one(warehouses, {
      fields: [warehouseStocks.warehouseId],
      references: [warehouses.id],
    }),
    machine: one(products, {
      fields: [warehouseStocks.machineId],
      references: [products.id],
    }),
    stockMovements: many(stockMovements),
  }),
);

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  warehouseStock: one(warehouseStocks, {
    fields: [stockMovements.warehouseStockId],
    references: [warehouseStocks.id],
  }),
  warehouse: one(warehouses, {
    fields: [stockMovements.warehouseId],
    references: [warehouses.id],
  }),
  machine: one(products, {
    fields: [stockMovements.machineId],
    references: [products.id],
  }),
}));

// Query interfaces for filtering and pagination
export interface UserQueryParams {
  search?: string;
  role?: 'staff' | 'manager' | 'director';
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CustomerQueryParams {
  search?: string;
  type?: 'individual' | 'company';
  isPPN?: boolean;
  page?: number;
  limit?: number;
}

export interface SupplierQueryParams {
  search?: string;
  country?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface WarehouseQueryParams {
  search?: string;
  city?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductQueryParams {
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  condition?: string;
  supplierId?: string;
  warehouseId?: string;
  sortBy?:
    | 'name-asc'
    | 'name-desc'
    | 'code-asc'
    | 'code-desc'
    | 'price-asc'
    | 'price-desc'
    | 'category-asc'
    | 'category-desc'
    | 'year-asc'
    | 'year-desc'
    | 'created-asc'
    | 'created-desc';
  page?: number;
  limit?: number;
}

export interface QuotationQueryParams {
  search?: string;
  status?: 'draft' | 'submitted' | 'sent' | 'accepted' | 'rejected';
  customerId?: string;
  approvedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface InvoiceQueryParams {
  search?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  customerId?: string;
  quotationId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface DeliveryNoteQueryParams {
  search?: string;
  status?: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  customerId?: string;
  invoiceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Quotation = typeof quotations.$inferSelect;
export type NewQuotation = typeof quotations.$inferInsert;
export type QuotationItem = typeof quotationItems.$inferSelect;
export type NewQuotationItem = typeof quotationItems.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
export type DeliveryNote = typeof deliveryNotes.$inferSelect;
export type NewDeliveryNote = typeof deliveryNotes.$inferInsert;
export type DeliveryNoteItem = typeof deliveryNoteItems.$inferSelect;
export type NewDeliveryNoteItem = typeof deliveryNoteItems.$inferInsert;
