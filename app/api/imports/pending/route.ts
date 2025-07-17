import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS } from '@/lib/db/enum';
import { importItems, imports, suppliers, warehouses } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'imports:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    // Fetch all pending imports with aggregated data
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
        // Aggregated fields
        itemCount: sql<number>`count(${importItems.id})`,
        totalRMB: sql<number>`sum(${importItems.quantity} * cast(${importItems.priceRMB} as decimal))`,
        totalIDR: sql<number>`sum(${importItems.quantity} * cast(${importItems.priceRMB} as decimal) * ${imports.exchangeRateRMBtoIDR})`,
      })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .leftJoin(importItems, eq(imports.id, importItems.importId))
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
      data: pendingImports,
    });
  } catch (error) {
    console.error('Error fetching pending imports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending imports' },
      { status: 500 },
    );
  }
}
