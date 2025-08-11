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
import {
  DELIVERY_NOTE_STATUS,
  IMPORT_STATUS,
  INVOICE_STATUS,
  MOVEMENT_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_STATUS,
  QUOTATION_STATUS,
  STOCK_CONDITION,
} from './enum';

// NextAuth.js required tables
export const accounts = mysqlTable(
  'accounts',
  {
    userId: varchar('userId', { length: 36 }).notNull(),
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
  userId: varchar('userId', { length: 36 }).notNull(),
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

// Roles table
export const roles = mysqlTable(
  'roles',
  {
    id: varchar('id', { length: 36 }).primaryKey().notNull(), // example: admin, staff, manager, import-manager, director
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [index('name_idx').on(table.name)],
);

// Permissions table
export const permissions = mysqlTable(
  'permissions',
  {
    id: varchar('id', { length: 36 }).primaryKey().notNull(), // example: quotation:read, invoice:update
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [index('name_idx').on(table.name)],
);

// User-Roles junction table
export const userRoles = mysqlTable(
  'user_roles',
  {
    userId: varchar('user_id', { length: 36 }).notNull(),
    roleId: varchar('role_id', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
    index('user_id_idx').on(table.userId),
    index('role_id_idx').on(table.roleId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'fk_user_roles_user',
    }),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: 'fk_user_roles_role',
    }),
  ],
);

// Role-Permissions junction table
export const rolePermissions = mysqlTable(
  'role_permissions',
  {
    roleId: varchar('role_id', { length: 36 }).notNull(),
    permissionId: varchar('permission_id', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    index('role_id_idx').on(table.roleId),
    index('permission_id_idx').on(table.permissionId),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: 'fk_role_permissions_role',
    }),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
      name: 'fk_role_permissions_permission',
    }),
  ],
);

// Users table
export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    code: varchar('code', { length: 50 }).notNull().unique(),
    prefix: varchar('prefix', { length: 50 }).default('Bapak'),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }),
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
    // TODO: remove this role and use user_roles
    role: varchar('role', { length: 50 }).notNull().default('staff'), // staff, manager, import-manager director
    branchId: varchar('branch_id', { length: 36 }), // HO Jakarta, Pekanbaru , Kendari, Balikpapan
    signature: varchar('signature', { length: 500 }),
    isActive: boolean('is_active').default(true), // for soft delete
    isAdmin: boolean('is_admin').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('email_idx').on(table.email),
    index('role_idx').on(table.role),
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branches.id],
      name: 'fk_users_branch',
    }),
  ],
);

export const branches = mysqlTable('branches', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`(UUID())`),
  name: varchar('name', { length: 100 }).notNull(),
  address: text('address'),
  postalCode: varchar('postal_code', { length: 20 }),
  phone: varchar('phone', { length: 20 }),
  fax: varchar('fax', { length: 20 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

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
    type: varchar('type', { length: 50 }).notNull().default('individual'), // individual, company
    npwp: varchar('npwp', { length: 50 }),
    npwp16: varchar('npwp16', { length: 50 }),
    billingAddress: text('billing_address'),
    shippingAddress: text('shipping_address'),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    province: varchar('province', { length: 100 }),
    country: varchar('country', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    paymentTerms: varchar('payment_terms', { length: 100 }), // NET 30, NET 15
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
  ],
);

// Customer contact persons table
export const customerContactPersons = mysqlTable(
  'customer_contact_persons',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    prefix: varchar('prefix', { length: 50 }).default('Bapak'),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('customer_id_idx').on(table.customerId),
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: 'fk_customer_contact_persons_customer',
    }),
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
    address: text('address'),
    city: varchar('city', { length: 100 }),
    province: varchar('province', { length: 100 }),
    country: varchar('country', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    transactionCurrency: varchar('transaction_currency', { length: 3 }).default(
      'USD',
    ),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('code_idx').on(table.code),
    index('name_idx').on(table.name),
  ],
);

// Supplier contact persons table
export const supplierContactPersons = mysqlTable(
  'supplier_contact_persons',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    supplierId: varchar('supplier_id', { length: 36 }).notNull(),
    prefix: varchar('prefix', { length: 50 }).default('Bapak'),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('supplier_id_idx').on(table.supplierId),
    foreignKey({
      columns: [table.supplierId],
      foreignColumns: [suppliers.id],
      name: 'fk_supplier_contact_persons_supplier',
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
    branchId: varchar('branch_id', { length: 36 }).notNull(),
    quotationNumber: varchar('quotation_number', { length: 50 }) // QT/2025/04/001
      .notNull()
      .unique(),
    quotationDate: date('quotation_date').notNull(),
    validUntil: date('valid_until').notNull(),
    customerId: varchar('customer_id', { length: 36 }),
    isIncludePPN: boolean('is_include_ppn').default(false),
    subtotal: decimal('subtotal', { precision: 17, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 17, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 17, scale: 2 }).default('0.00'),
    status: mysqlEnum('status', QUOTATION_STATUS).default(
      QUOTATION_STATUS.DRAFT,
    ),
    notes: text('notes'),
    termsAndConditions: text('terms_and_conditions'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    approvedBy: varchar('approver_by', { length: 36 }),
    purchaseOrderId: varchar('purchase_order_id', { length: 36 }),
    customerResponseDate: date('customer_response_date'),
    customerResponseNotes: text('customer_response_notes'),
    rejectionReason: text('rejection_reason'),
    revisionReason: text('revision_reason'),
    revisionVersion: int('revision_version').default(0),
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
      columns: [table.branchId],
      foreignColumns: [branches.id],
      name: 'fk_quotations_branch',
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
    // Note: invoiceId foreign key removed due to circular reference
    // This relationship is handled through the invoices.quotationId instead
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
    quantity: int('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 17, scale: 2 }).notNull(),
    total: decimal('total', { precision: 17, scale: 2 }).notNull(),
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
    branchId: varchar('branch_id', { length: 36 }).notNull(),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
    quotationId: varchar('quotation_id', { length: 36 }), // if was invoiced from quotation
    invoiceDate: date('invoice_date').notNull(),
    dueDate: date('due_date').notNull(),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    contractNumber: varchar('contract_number', { length: 50 }),
    customerPoNumber: varchar('customer_po_number', { length: 50 }),
    subtotal: decimal('subtotal', { precision: 17, scale: 2 }).default('0.00'),
    tax: decimal('tax', { precision: 17, scale: 2 }).default('0.00'),
    total: decimal('total', { precision: 17, scale: 2 }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    status: mysqlEnum('status', INVOICE_STATUS).default(INVOICE_STATUS.DRAFT),
    paymentTerms: varchar('payment_terms', { length: 100 }),
    notes: text('notes'),
    salesmanUserId: varchar('salesman_user_id', { length: 36 }),
    isIncludePPN: boolean('is_include_ppn').default(false),
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
      columns: [table.customerId],
      foreignColumns: [customers.id],
      name: 'fk_invoices_customer',
    }),
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branches.id],
      name: 'fk_invoices_branch',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_invoices_created_by',
    }),
    foreignKey({
      columns: [table.salesmanUserId],
      foreignColumns: [users.id],
      name: 'fk_invoices_salesman_user',
    }),
    // Note: quotationId foreign key removed due to circular reference
    // This relationship is handled through the relations instead
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
    quantity: int('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 17, scale: 2 }).notNull(),
    total: decimal('total', { precision: 17, scale: 2 }).notNull(),
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

// Delivery Notes table
export const deliveryNotes = mysqlTable(
  'delivery_notes',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    branchId: varchar('branch_id', { length: 36 }),
    deliveryNumber: varchar('delivery_number', { length: 50 })
      .notNull()
      .unique(),
    invoiceId: varchar('invoice_id', { length: 36 }),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    deliveryDate: date('delivery_date').notNull(),
    deliveryMethod: varchar('delivery_method', { length: 100 }),
    driverName: varchar('driver_name', { length: 100 }),
    vehicleNumber: varchar('vehicle_number', { length: 20 }),
    status: mysqlEnum('status', DELIVERY_NOTE_STATUS).default(
      DELIVERY_NOTE_STATUS.PENDING,
    ),
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
      columns: [table.branchId],
      foreignColumns: [branches.id],
      name: 'fk_delivery_notes_branch',
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
    quantity: int('quantity').notNull(),
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

// Products table
export const products = mysqlTable(
  'products',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    code: varchar('code', { length: 100 }).notNull().unique(), // unique identifier for user
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    category: mysqlEnum('category', PRODUCT_CATEGORY).notNull(),
    unitOfMeasureId: varchar('unit_of_measure_id', { length: 36 }), // unit, kg, pcs, etc
    brandId: varchar('brand_id', { length: 36 }), // shantui, etc
    quantity: int('quantity').notNull().default(1),
    // ================================
    machineTypeId: varchar('machine_type_id', { length: 36 }), // [serialized]
    modelNumber: varchar('model_number', { length: 100 }), // [serialized]
    engineNumber: varchar('engine_number', { length: 100 }), // [serialized]
    serialNumber: varchar('serial_number', { length: 100 }), // [serialized]
    additionalSpecs: text('additional_specs'), // [serialized]
    partNumber: varchar('part_number', { length: 100 }), // [non-serialized, bulk]
    batchOrLotNumber: varchar('batch_or_lot_number', { length: 100 }), // [non-serialized, bulk]
    // ================================
    status: varchar('status', { length: 50 }).default('in_stock'), // in_stock, out_of_stock
    price: decimal('price', { precision: 17, scale: 2 })
      .notNull()
      .default('0.00'),
    condition: varchar('condition', { length: 50 }).default('new'), // new, used, refurbished
    warehouseId: varchar('warehouse_id', { length: 36 }),
    supplierId: varchar('supplier_id', { length: 36 }),
    importNotes: text('import_notes'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('name_id_idx').on(table.name),
    index('brand_id_idx').on(table.brandId),
    index('category_idx').on(table.category),
    index('status_idx').on(table.status),
    index('supplier_id_idx').on(table.supplierId),
    index('warehouse_id_idx').on(table.warehouseId),
    foreignKey({
      columns: [table.supplierId],
      foreignColumns: [suppliers.id],
      name: 'fk_products_supplier',
    }),
    foreignKey({
      columns: [table.warehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_products_warehouse',
    }),
    foreignKey({
      columns: [table.brandId],
      foreignColumns: [brands.id],
      name: 'fk_products_brand',
    }),
    foreignKey({
      columns: [table.machineTypeId],
      foreignColumns: [machineTypes.id],
      name: 'fk_products_machine_type',
    }),
    foreignKey({
      columns: [table.unitOfMeasureId],
      foreignColumns: [unitOfMeasures.id],
      name: 'fk_products_unit_of_measure',
    }),
  ],
);

export const brands = mysqlTable('brands', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(), // using non UUID: shantui, toshiba, etc.
  type: varchar('type', { length: 100 }).notNull(), // machine, sparepart
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const machineTypes = mysqlTable('machine_types', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(), // using non UUID: 'excavator', 'bulldozer', 'loader', 'motor_grader', 'roller'
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const unitOfMeasures = mysqlTable('unit_of_measures', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(), // using non UUID: kg, pcs, etc.
  abbreviation: varchar('abbreviation', { length: 10 }).notNull(), // kg, pcs
  name: varchar('name', { length: 100 }).notNull(), // Kilogram, Pieces
  createdAt: timestamp('created_at').defaultNow(),
});

// Imports table
export const imports = mysqlTable(
  'imports',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    supplierId: varchar('supplier_id', { length: 36 }).notNull(),
    warehouseId: varchar('warehouse_id', { length: 36 }).notNull(),
    importDate: date('import_date').notNull(),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
    invoiceDate: date('invoice_date').notNull(),
    billOfLadingNumber: varchar('bill_of_lading_number', { length: 50 }),
    billOfLadingDate: date('bill_of_lading_date'),
    exchangeRateRMBtoIDR: decimal('exchange_rate_rmb_to_idr', {
      precision: 15,
      scale: 2,
    }).notNull(),
    total: decimal('total', { precision: 17, scale: 2 }).default('0.00'),
    status: mysqlEnum('status', IMPORT_STATUS).default(IMPORT_STATUS.PENDING),
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    verifiedBy: varchar('verified_by', { length: 36 }), // import-manager role
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('invoice_number_idx').on(table.invoiceNumber),
    index('supplier_id_idx').on(table.supplierId),
    index('warehouse_id_idx').on(table.warehouseId),
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
    foreignKey({
      columns: [table.verifiedBy],
      foreignColumns: [users.id],
      name: 'fk_imports_verified_by',
    }),
  ],
);

// Import Items table (for multiple products per import)
export const importItems = mysqlTable(
  'import_items',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    importId: varchar('import_id', { length: 36 }).notNull(),

    // Pricing & Quantity
    priceRMB: decimal('price_rmb', { precision: 17, scale: 2 }).notNull(),
    quantity: int('quantity').notNull().default(1),
    total: decimal('total', { precision: 17, scale: 2 }).default('0.00'),
    notes: text('notes'),

    // Product Creation Data - Core fields
    productId: varchar('product_id', { length: 36 }), // nullable - only set if updating existing product
    category: mysqlEnum('category', PRODUCT_CATEGORY).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    brandId: varchar('brand_id', { length: 36 }),
    condition: varchar('condition', { length: 50 }).default('new'),
    unitOfMeasureId: varchar('unit_of_measure_id', { length: 36 }),

    // Category-specific fields
    machineTypeId: varchar('machine_type_id', { length: 36 }), // [serialized]
    modelNumber: varchar('model_number', { length: 100 }), // [serialized]
    engineNumber: varchar('engine_number', { length: 100 }), // [serialized]
    serialNumber: varchar('serial_number', { length: 100 }).unique(), // [serialized]
    additionalSpecs: text('additional_specs'), // [serialized]
    partNumber: varchar('part_number', { length: 100 }), // [non-serialized, bulk]
    batchOrLotNumber: varchar('batch_or_lot_number', { length: 100 }), // [non-serialized, bulk]

    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('import_id_idx').on(table.importId),
    index('product_id_idx').on(table.productId),
    index('category_idx').on(table.category),
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

// Warehouses table
export const warehouses = mysqlTable(
  'warehouses',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address'),
    managerId: varchar('manager_id', { length: 36 }),
    branchId: varchar('branch_id', { length: 36 }).notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('name_idx').on(table.name),
    index('manager_id_idx').on(table.managerId),
    index('branch_id_idx').on(table.branchId),
    foreignKey({
      columns: [table.managerId],
      foreignColumns: [users.id],
      name: 'fk_warehouses_manager',
    }),
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branches.id],
      name: 'fk_warehouses_branch',
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
    productId: varchar('product_id', { length: 36 }).notNull(),
    condition: varchar('condition', { length: 20 }).notNull(), // good, damaged, repair
    quantity: int('quantity').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('warehouse_id_idx').on(table.warehouseId),
    index('product_id_idx').on(table.productId),
    index('condition_idx').on(table.condition),
    foreignKey({
      columns: [table.warehouseId],
      foreignColumns: [warehouses.id],
      name: 'fk_warehouse_stocks_warehouse',
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: 'fk_warehouse_stocks_product',
    }),
  ],
);

// Transfers table (header for multi-product transfers)
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
    warehouseIdFrom: varchar('warehouse_id_from', { length: 36 }), // NULL for import
    warehouseIdTo: varchar('warehouse_id_to', { length: 36 }).notNull(),
    movementType: varchar('movement_type', { length: 20 }).notNull(), // in, out, transfer, adjustment
    status: varchar('status', { length: 20 }).default('pending'), // pending, in_transit, completed, cancelled
    transferDate: date('transfer_date').notNull(),
    invoiceId: varchar('invoice_id', { length: 50 }),
    deliveryId: varchar('delivery_id', { length: 50 }),
    notes: text('notes'),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    approvedBy: varchar('approved_by', { length: 36 }),
    approvedAt: timestamp('approved_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('transfer_number_idx').on(table.transferNumber),
    index('warehouse_id_from_idx').on(table.warehouseIdFrom),
    index('warehouse_id_to_idx').on(table.warehouseIdTo),
    index('movement_type_idx').on(table.movementType),
    index('status_idx').on(table.status),
    index('created_by_idx').on(table.createdBy),
    foreignKey({
      columns: [table.warehouseIdFrom],
      foreignColumns: [warehouses.id],
      name: 'fk_transfers_warehouse_from',
    }),
    foreignKey({
      columns: [table.warehouseIdTo],
      foreignColumns: [warehouses.id],
      name: 'fk_transfers_warehouse_to',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_transfers_created_by',
    }),
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [users.id],
      name: 'fk_transfers_approved_by',
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
    quantity: int('quantity').notNull(),
    quantityTransferred: int('quantity_transferred').default(0),
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

// Purchase Orders table
export const purchaseOrders = mysqlTable(
  'purchase_orders',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .notNull()
      .default(sql`(UUID())`),
    quotationId: varchar('quotation_id', { length: 36 }).notNull(),
    number: varchar('number', { length: 50 }).notNull().unique(),
    date: date('date').notNull(),
    approvalType: varchar('approval_type', { length: 100 }).notNull(), // e.g., 'manager', 'director', 'auto'
    document: varchar('document', { length: 500 }), // file path/URL
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [
    index('quotation_id_idx').on(table.quotationId),
    index('number_idx').on(table.number),
    index('created_by_idx').on(table.createdBy),
    foreignKey({
      columns: [table.quotationId],
      foreignColumns: [quotations.id],
      name: 'fk_purchase_orders_quotation',
    }),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [users.id],
      name: 'fk_purchase_orders_created_by',
    }),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quotations: many(quotations),
  invoices: many(invoices),
  deliveryNotes: many(deliveryNotes),
  imports: many(imports),
  accounts: many(accounts),
  sessions: many(sessions),
  approvedQuotations: many(quotations, { relationName: 'approver' }),
  deliveredNotes: many(deliveryNotes, { relationName: 'deliveredBy' }),
  receivedNotes: many(deliveryNotes, { relationName: 'receivedBy' }),
  verifiedImports: many(imports, { relationName: 'verifier' }),
  managedWarehouses: many(warehouses),
  userRoles: many(userRoles),
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
  contactPersons: many(customerContactPersons),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  products: many(products),
  imports: many(imports),
  contactPersons: many(supplierContactPersons),
}));

export const customerContactPersonsRelations = relations(
  customerContactPersons,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerContactPersons.customerId],
      references: [customers.id],
    }),
  }),
);

export const supplierContactPersonsRelations = relations(
  supplierContactPersons,
  ({ one }) => ({
    supplier: one(suppliers, {
      fields: [supplierContactPersons.supplierId],
      references: [suppliers.id],
    }),
  }),
);

// Add brands relations
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  manager: one(users, {
    fields: [warehouses.managerId],
    references: [users.id],
  }),
  branch: one(branches, {
    fields: [warehouses.branchId],
    references: [branches.id],
  }),
  imports: many(imports),
  warehouseStocks: many(warehouseStocks),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  warehouse: one(warehouses, {
    fields: [products.warehouseId],
    references: [warehouses.id],
  }),
  quotationItems: many(quotationItems),
  invoiceItems: many(invoiceItems),
  deliveryNoteItems: many(deliveryNoteItems),
  imports: many(imports),
  warehouseStocks: many(warehouseStocks),
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
  approvedBy: one(users, {
    fields: [quotations.approvedBy],
    references: [users.id],
    relationName: 'approver',
  }),
  quotationItems: many(quotationItems),
  // Note: invoices relation removed due to circular reference
  // This relationship is handled through the invoiceId field directly
  purchaseOrder: one(purchaseOrders, {
    fields: [quotations.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
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
  // Note: quotation relation removed due to circular reference
  // This relationship is handled through the quotationId field directly
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
    deliveredBy: one(users, {
      fields: [deliveryNotes.deliveredBy],
      references: [users.id],
      relationName: 'deliveredBy',
    }),
    receivedBy: one(users, {
      fields: [deliveryNotes.receivedBy],
      references: [users.id],
      relationName: 'receivedBy',
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
  verifiedBy: one(users, {
    fields: [imports.verifiedBy],
    references: [users.id],
    relationName: 'verifier',
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
  brand: one(brands, {
    fields: [importItems.brandId],
    references: [brands.id],
  }),
  machineType: one(machineTypes, {
    fields: [importItems.machineTypeId],
    references: [machineTypes.id],
  }),
  unitOfMeasure: one(unitOfMeasures, {
    fields: [importItems.unitOfMeasureId],
    references: [unitOfMeasures.id],
  }),
}));

export const warehouseStocksRelations = relations(
  warehouseStocks,
  ({ one, many }) => ({
    warehouse: one(warehouses, {
      fields: [warehouseStocks.warehouseId],
      references: [warehouses.id],
    }),
    product: one(products, {
      fields: [warehouseStocks.productId],
      references: [products.id],
    }),
  }),
);

export const transfersRelations = relations(transfers, ({ one, many }) => ({
  warehouseFrom: one(warehouses, {
    fields: [transfers.warehouseIdFrom],
    references: [warehouses.id],
    relationName: 'transfersFrom',
  }),
  warehouseTo: one(warehouses, {
    fields: [transfers.warehouseIdTo],
    references: [warehouses.id],
    relationName: 'transfersTo',
  }),
  createdBy: one(users, {
    fields: [transfers.createdBy],
    references: [users.id],
  }),
  approvedBy: one(users, {
    fields: [transfers.approvedBy],
    references: [users.id],
    relationName: 'transferApprover',
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

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one }) => ({
  quotation: one(quotations, {
    fields: [purchaseOrders.quotationId],
    references: [quotations.id],
  }),
  createdBy: one(users, {
    fields: [purchaseOrders.createdBy],
    references: [users.id],
  }),
}));

// Roles and Permissions Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

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

export interface ImportQueryParams {
  search?: string;
  status?: 'pending' | 'verified' | 'completed';
  supplierId?: string;
  warehouseId?: string;
  productId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface WarehouseStockQueryParams {
  warehouseId?: string;
  productId?: string;
  condition?: 'good' | 'damaged' | 'repair';
  page?: number;
  limit?: number;
}

export interface BrandQueryParams {
  search?: string;
  type?: 'machine' | 'sparepart';
  page?: number;
  limit?: number;
}

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Branch = typeof branches.$inferSelect;
export type InsertBranch = typeof branches.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;
export type Warehouse = typeof warehouses.$inferSelect;
export type InsertWarehouse = typeof warehouses.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Quotation = typeof quotations.$inferSelect;
export type InsertQuotation = typeof quotations.$inferInsert;
export type QuotationItem = typeof quotationItems.$inferSelect;
export type InsertQuotationItem = typeof quotationItems.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = typeof invoiceItems.$inferInsert;
export type DeliveryNote = typeof deliveryNotes.$inferSelect;
export type InsertDeliveryNote = typeof deliveryNotes.$inferInsert;
export type DeliveryNoteItem = typeof deliveryNoteItems.$inferSelect;
export type InsertDeliveryNoteItem = typeof deliveryNoteItems.$inferInsert;
export type CustomerContactPerson = typeof customerContactPersons.$inferSelect;
export type InsertCustomerContactPerson =
  typeof customerContactPersons.$inferInsert;
export type SupplierContactPerson = typeof supplierContactPersons.$inferSelect;
export type InsertSupplierContactPerson =
  typeof supplierContactPersons.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;
export type MachineType = typeof machineTypes.$inferSelect;
export type InsertMachineType = typeof machineTypes.$inferInsert;
export type UnitOfMeasure = typeof unitOfMeasures.$inferSelect;
export type InsertUnitOfMeasure = typeof unitOfMeasures.$inferInsert;
export type Import = typeof imports.$inferSelect;
export type InsertImport = typeof imports.$inferInsert;
export type ImportItem = typeof importItems.$inferSelect;
export type InsertImportItem = typeof importItems.$inferInsert;
export type WarehouseStock = typeof warehouseStocks.$inferSelect;
export type InsertWarehouseStock = typeof warehouseStocks.$inferInsert;

export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = typeof transfers.$inferInsert;
export type TransferItem = typeof transferItems.$inferSelect;
export type InsertTransferItem = typeof transferItems.$inferInsert;

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = typeof purchaseOrders.$inferInsert;

// Roles and Permissions types
export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;
