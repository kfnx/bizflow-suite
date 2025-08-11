export enum QUOTATION_STATUS {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  REVISED = 'revised',
}

export enum INVOICE_STATUS {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  VOID = 'void',
  OVERDUE = 'overdue',
}

export enum CUSTOMER_TYPE {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export enum DELIVERY_NOTE_STATUS {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum IMPORT_STATUS {
  PENDING = 'pending',
  VERIFIED = 'verified',
}

export enum PRODUCT_CATEGORY {
  SERIALIZED = 'serialized',
  NON_SERIALIZED = 'non_serialized',
  BULK = 'bulk',
}

export enum PRODUCT_CONDITION {
  NEW = 'new',
  USED = 'used',
  REFURBISHED = 'refurbished',
}

export enum PRODUCT_STATUS {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum STOCK_CONDITION {
  GOOD = 'good',
  DAMAGED = 'damaged',
  REPAIR = 'repair',
}

export enum MOVEMENT_TYPE {
  IN = 'in',
  OUT = 'out',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

export enum PERMISSION_RESOURCE {
  QUOTATION = 'quotation',
  INVOICE = 'invoice',
  DELIVERY_NOTE = 'delivery_note',
  IMPORT = 'import',
  PRODUCT = 'product',
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
  WAREHOUSE = 'warehouse',
}

export enum PERMISSION_ACTION {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  NAVIGATE = 'navigate',
}
