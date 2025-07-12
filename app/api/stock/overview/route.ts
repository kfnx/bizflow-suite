import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { products, stockMovements, warehouses } from '@/lib/db/schema';
import { getLowStockAlerts } from '@/lib/utils/stock-calculations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'products:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = request.nextUrl;
    const lowStockThreshold = parseInt(
      searchParams.get('lowStockThreshold') || '5',
    );

    // Get low stock alerts
    const lowStockAlerts = await getLowStockAlerts(lowStockThreshold);

    // Get total stock statistics
    const totalStockStats = await db
      .select({
        totalProducts: sql<number>`COUNT(DISTINCT ${stockMovements.productId})`,
        totalWarehouses: sql<number>`COUNT(DISTINCT ${stockMovements.warehouseIdTo})`,
        totalMovements: sql<number>`COUNT(*)`,
        totalInbound: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE 0 END), 0)`,
        totalOutbound: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'out' THEN quantity ELSE 0 END), 0)`,
      })
      .from(stockMovements);

    const stats = totalStockStats[0];
    const currentTotalStock = stats.totalInbound - stats.totalOutbound;

    // Get recent stock movements (last 10)
    const recentMovements = await db
      .select({
        id: stockMovements.id,
        productId: stockMovements.productId,
        productCode: products.code,
        productName: products.name,
        warehouseIdFrom: stockMovements.warehouseIdFrom,
        warehouseIdTo: stockMovements.warehouseIdTo,
        warehouseName: warehouses.name,
        quantity: stockMovements.quantity,
        movementType: stockMovements.movementType,
        notes: stockMovements.notes,
        createdAt: stockMovements.createdAt,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .leftJoin(warehouses, eq(stockMovements.warehouseIdTo, warehouses.id))
      .orderBy(sql`${stockMovements.createdAt} DESC`)
      .limit(10);

    // Get warehouse stock summaries
    const warehouseStockSummaries = await db
      .select({
        warehouseId: stockMovements.warehouseIdTo,
        warehouseName: warehouses.name,
        totalProducts: sql<number>`COUNT(DISTINCT ${stockMovements.productId})`,
        totalQuantity: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE 0 END) - SUM(CASE WHEN movement_type = 'out' THEN quantity ELSE 0 END), 0)`,
      })
      .from(stockMovements)
      .leftJoin(warehouses, eq(stockMovements.warehouseIdTo, warehouses.id))
      .groupBy(stockMovements.warehouseIdTo, warehouses.name)
      .having(sql`totalQuantity > 0`);

    const overview = {
      summary: {
        totalProducts: stats.totalProducts,
        totalWarehouses: stats.totalWarehouses,
        totalMovements: stats.totalMovements,
        currentTotalStock,
        totalInbound: stats.totalInbound,
        totalOutbound: stats.totalOutbound,
        lowStockCount: lowStockAlerts.length,
      },
      lowStockAlerts: lowStockAlerts.slice(0, 10), // Limit to top 10 low stock items
      recentMovements,
      warehouseStockSummaries,
    };

    return NextResponse.json({ data: overview });
  } catch (error) {
    console.error('Error fetching stock overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock overview' },
      { status: 500 },
    );
  }
}
