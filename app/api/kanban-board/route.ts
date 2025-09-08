import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS, QUOTATION_STATUS } from '@/lib/db/enum';
import {
  branches,
  customers,
  deliveryNotes,
  imports,
  invoices,
  quotations,
  suppliers,
  warehouses,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    // Fetch quotations data
    const quotationsData = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        total: quotations.total,
        status: quotations.status,
        customerId: quotations.customerId,
        customerName: customers.name,
        createdAt: quotations.createdAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .orderBy(quotations.createdAt);

    // Fetch invoices data
    const invoicesData = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        customerId: invoices.customerId,
        customerName: customers.name,
        total: invoices.total,
        status: invoices.status,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(invoices.createdAt);

    // Fetch delivery notes data
    const deliveryNotesData = await db
      .select({
        id: deliveryNotes.id,
        deliveryNumber: deliveryNotes.deliveryNumber,
        customerId: deliveryNotes.customerId,
        customerName: customers.name,
        branchId: deliveryNotes.branchId,
        branchName: branches.name,
        deliveryMethod: deliveryNotes.deliveryMethod,
        vehicleNumber: deliveryNotes.vehicleNumber,
        status: deliveryNotes.status,
        receivedBy: deliveryNotes.receivedBy,
        createdAt: deliveryNotes.createdAt,
      })
      .from(deliveryNotes)
      .leftJoin(customers, eq(deliveryNotes.customerId, customers.id))
      .leftJoin(branches, eq(deliveryNotes.branchId, branches.id))
      .orderBy(deliveryNotes.createdAt);

    const pendingQuotations = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        validUntil: quotations.validUntil,
        customerId: quotations.customerId,
        customerName: customers.name,
        total: quotations.total,
        status: quotations.status,
        createdAt: quotations.createdAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .where(eq(quotations.status, QUOTATION_STATUS.SUBMITTED));

    const pendingImports = await db
      .select({
        id: imports.id,
        supplierName: suppliers.name,
        supplierCode: suppliers.code,
        warehouseName: warehouses.name,
        importDate: imports.importDate,
        invoiceNumber: imports.invoiceNumber,
        invoiceDate: imports.invoiceDate,
        exchangeRateRMBtoIDR: imports.exchangeRateRMBtoIDR,
        notes: imports.notes,
        createdAt: imports.createdAt,
      })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .where(eq(imports.status, IMPORT_STATUS.PENDING))
      .groupBy(
        imports.id,
        suppliers.name,
        suppliers.code,
        warehouses.name,
        imports.importDate,
        imports.invoiceNumber,
        imports.invoiceDate,
        imports.exchangeRateRMBtoIDR,
        imports.notes,
        imports.createdAt,
      )
      .orderBy(imports.createdAt);

    return NextResponse.json({
      data: {
        quotations: quotationsData,
        invoices: invoicesData,
        deliveryNotes: deliveryNotesData,
        pendingQuotations,
        pendingImports,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 },
    );
  }
}
