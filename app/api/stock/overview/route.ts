import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import {
  products,
  transferItems,
  transfers,
  warehouses,
} from '@/lib/db/schema';
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

    // Get total stock statistics from transfers
    const totalStockStats = await db
      .select({
        totalProducts: sql<number>`COUNT(DISTINCT ${transferItems.productId})`,
        totalWarehouses: sql<number>`COUNT(DISTINCT ${transfers.warehouseIdTo})`,
        totalTransfers: sql<number>`COUNT(DISTINCT ${transfers.id})`,
        totalInbound: sql<number>`COALESCE(SUM(CASE WHEN ${transfers.movementType} = 'in' THEN ${transferItems.quantity} ELSE 0 END), 0)`,
        totalOutbound: sql<number>`COALESCE(SUM(CASE WHEN ${transfers.movementType} = 'out' THEN ${transferItems.quantity} ELSE 0 END), 0)`,
      })
      .from(transfers)
      .leftJoin(transferItems, eq(transfers.id, transferItems.transferId));

    const stats = totalStockStats[0];
    const currentTotalStock = stats.totalInbound - stats.totalOutbound;

    // Get recent transfers (last 10)
    const recentTransfers = await db
      .select({
        id: transfers.id,
        transferNumber: transfers.transferNumber,
        warehouseIdFrom: transfers.warehouseIdFrom,
        warehouseIdTo: transfers.warehouseIdTo,
        warehouseToName: sql<string>`wt.name`,
        movementType: transfers.movementType,
        status: transfers.status,
        transferDate: transfers.transferDate,
        notes: transfers.notes,
        createdAt: transfers.createdAt,
        itemCount: sql<number>`(
          SELECT COUNT(*) 
          FROM transfer_items ti 
          WHERE ti.transfer_id = ${transfers.id}
        )`,
        totalQuantity: sql<number>`(
          SELECT COALESCE(SUM(ti.quantity), 0) 
          FROM transfer_items ti 
          WHERE ti.transfer_id = ${transfers.id}
        )`,
      })
      .from(transfers)
      .leftJoin(sql`warehouses wt`, sql`${transfers.warehouseIdTo} = wt.id`)
      .orderBy(sql`${transfers.createdAt} DESC`)
      .limit(10);

    // Get warehouse stock summaries
    const warehouseStockSummaries = await db
      .select({
        warehouseId: transfers.warehouseIdTo,
        warehouseName: sql<string>`wt.name`,
        totalProducts: sql<number>`COUNT(DISTINCT ${transferItems.productId})`,
        totalQuantity: sql<number>`COALESCE(SUM(CASE WHEN ${transfers.movementType} = 'in' THEN ${transferItems.quantity} ELSE 0 END) - SUM(CASE WHEN ${transfers.movementType} = 'out' THEN ${transferItems.quantity} ELSE 0 END), 0)`,
      })
      .from(transfers)
      .leftJoin(transferItems, eq(transfers.id, transferItems.transferId))
      .leftJoin(sql`warehouses wt`, sql`${transfers.warehouseIdTo} = wt.id`)
      .groupBy(transfers.warehouseIdTo, sql`wt.name`)
      .having(sql`totalQuantity > 0`);

    const overview = {
      summary: {
        totalProducts: stats.totalProducts,
        totalWarehouses: stats.totalWarehouses,
        totalTransfers: stats.totalTransfers,
        currentTotalStock,
        totalInbound: stats.totalInbound,
        totalOutbound: stats.totalOutbound,
        lowStockCount: lowStockAlerts.length,
      },
      lowStockAlerts: lowStockAlerts.slice(0, 10), // Limit to top 10 low stock items
      recentTransfers,
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
