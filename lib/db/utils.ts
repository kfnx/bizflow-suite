import { and, eq, sql } from 'drizzle-orm';

import { getDB } from './index';
import {
  deliveryNotes,
  imports,
  invoices,
  products,
  quotations,
  users,
} from './schema';

// Utility function to get user with their documents
export async function getUserWithDocuments(userId: string) {
  const db = await getDB();

  const user = await db
    .select({
      id: users.id,
      code: users.code,
      firstName: users.firstName,
      lastName: users.lastName,
      NIK: users.NIK,
      email: users.email,
      jobTitle: users.jobTitle,
      joinDate: users.joinDate,
      type: users.type,
      phone: users.phone,
      avatar: users.avatar,
      role: users.role,
      signature: users.signature,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  const userQuotations = await db
    .select()
    .from(quotations)
    .where(eq(quotations.createdBy, userId));

  const userInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.createdBy, userId));

  const userDeliveryNotes = await db
    .select()
    .from(deliveryNotes)
    .where(eq(deliveryNotes.createdBy, userId));

  const userImports = await db
    .select()
    .from(imports)
    .where(eq(imports.createdBy, userId));

  // const userStockMovements = await db
  //   .select()
  //   .from(stockMovements)
  //   .where(eq(stockMovements.createdBy, userId));

  return {
    ...user[0],
    quotations: userQuotations,
    invoices: userInvoices,
    deliveryNotes: userDeliveryNotes,
    imports: userImports,
    // transfers: userTransfers,
  };
}

// Utility function to get quotation with items
export async function getQuotationWithItems(quotationId: string) {
  const db = await getDB();

  const quotation = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, quotationId))
    .limit(1);

  if (quotation.length === 0) {
    return null;
  }

  const quotationItems = await db
    .select({
      id: sql`quotation_items.id`,
      productId: sql`quotation_items.product_id`,
      name: sql`products.name`,
      quantity: sql`quotation_items.quantity`,
      unitPrice: sql`quotation_items.unit_price`,
      total: sql`quotation_items.total`,
      notes: sql`quotation_items.notes`,
    })
    .from(sql`quotation_items`)
    .innerJoin(
      sql`products`,
      eq(sql`quotation_items.product_id`, sql`products.id`),
    )
    .where(eq(sql`quotation_items.quotation_id`, quotationId));

  return {
    ...quotation[0],
    items: quotationItems,
  };
}

// Utility function to get invoice with items
export async function getInvoiceWithItems(invoiceId: string) {
  const db = await getDB();

  const invoice = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  if (invoice.length === 0) {
    return null;
  }

  const invoiceItems = await db
    .select({
      id: sql`invoice_items.id`,
      productId: sql`invoice_items.product_id`,
      name: sql`products.name`,
      quantity: sql`invoice_items.quantity`,
      unitPrice: sql`invoice_items.unit_price`,
      total: sql`invoice_items.total`,
      notes: sql`invoice_items.notes`,
    })
    .from(sql`invoice_items`)
    .innerJoin(
      sql`products`,
      eq(sql`invoice_items.product_id`, sql`products.id`),
    )
    .where(eq(sql`invoice_items.invoice_id`, invoiceId));

  return {
    ...invoice[0],
    items: invoiceItems,
  };
}

// Utility function to get delivery note with items
export async function getDeliveryNoteWithItems(deliveryNoteId: string) {
  const db = await getDB();

  const deliveryNote = await db
    .select()
    .from(deliveryNotes)
    .where(eq(deliveryNotes.id, deliveryNoteId))
    .limit(1);

  if (deliveryNote.length === 0) {
    return null;
  }

  const deliveryNoteItems = await db
    .select({
      id: sql`delivery_note_items.id`,
      productId: sql`delivery_note_items.product_id`,
      name: sql`products.name`,
      quantity: sql`delivery_note_items.quantity`,
      deliveredQuantity: sql`delivery_note_items.delivered_quantity`,
      notes: sql`delivery_note_items.notes`,
    })
    .from(sql`delivery_note_items`)
    .innerJoin(
      sql`products`,
      eq(sql`delivery_note_items.product_id`, sql`products.id`),
    )
    .where(eq(sql`delivery_note_items.delivery_note_id`, deliveryNoteId));

  return {
    ...deliveryNote[0],
    items: deliveryNoteItems,
  };
}

// Utility function to get import with items
export async function getImportWithItems(importId: string) {
  const db = await getDB();

  const importDoc = await db
    .select()
    .from(imports)
    .where(eq(imports.id, importId))
    .limit(1);

  if (importDoc.length === 0) {
    return null;
  }

  const importItems = await db
    .select({
      id: sql`import_items.id`,
      productId: sql`import_items.product_id`,
      name: sql`products.name`,
      quantity: sql`import_items.quantity`,
      receivedQuantity: sql`import_items.received_quantity`,
      unitPrice: sql`import_items.unit_price`,
      total: sql`import_items.total`,
      notes: sql`import_items.notes`,
    })
    .from(sql`import_items`)
    .innerJoin(
      sql`products`,
      eq(sql`import_items.product_id`, sql`products.id`),
    )
    .where(eq(sql`import_items.import_id`, importId));

  return {
    ...importDoc[0],
    items: importItems,
  };
}

// Utility function to get product with supplier
export async function getProductWithSupplier(productId: string) {
  const db = await getDB();

  const product = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      category: products.category,
      unitOfMeasureId: products.unitOfMeasureId,
      price: products.price,
      isActive: products.isActive,
      createdAt: products.createdAt,
      supplierId: products.supplierId,
      supplierName: sql`suppliers.name`,
      supplierCode: sql`suppliers.code`,
    })
    .from(products)
    .leftJoin(sql`suppliers`, eq(products.supplierId, sql`suppliers.id`))
    .where(eq(products.id, productId))
    .limit(1);

  return product[0] || null;
}

// Utility function to get document statistics
export async function getDocumentStats(userId?: string) {
  const db = await getDB();

  let whereConditions = [];
  if (userId) {
    whereConditions.push(eq(quotations.createdBy, userId));
  }

  const quotationStats = await db
    .select({
      total: sql<number>`COUNT(*)`,
      draft: sql<number>`SUM(CASE WHEN ${quotations.status} = 'draft' THEN 1 ELSE 0 END)`,
      sent: sql<number>`SUM(CASE WHEN ${quotations.status} = 'sent' THEN 1 ELSE 0 END)`,
      accepted: sql<number>`SUM(CASE WHEN ${quotations.status} = 'accepted' THEN 1 ELSE 0 END)`,
      rejected: sql<number>`SUM(CASE WHEN ${quotations.status} = 'rejected' THEN 1 ELSE 0 END)`,
    })
    .from(quotations)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  whereConditions = [];
  if (userId) {
    whereConditions.push(eq(invoices.createdBy, userId));
  }

  const invoiceStats = await db
    .select({
      total: sql<number>`COUNT(*)`,
      draft: sql<number>`SUM(CASE WHEN ${invoices.status} = 'draft' THEN 1 ELSE 0 END)`,
      sent: sql<number>`SUM(CASE WHEN ${invoices.status} = 'sent' THEN 1 ELSE 0 END)`,
      paid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN 1 ELSE 0 END)`,
      overdue: sql<number>`SUM(CASE WHEN ${invoices.status} = 'overdue' THEN 1 ELSE 0 END)`,
    })
    .from(invoices)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  return {
    quotations: quotationStats[0] || {
      total: 0,
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
    },
    invoices: invoiceStats[0] || {
      total: 0,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
    },
  };
}
