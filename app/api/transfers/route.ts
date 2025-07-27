import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { transferItems, transfers, users, warehouses } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'transfers:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = request.nextUrl;

    // Parse query parameters
    const search = searchParams.get('search') || undefined;
    const movementType = searchParams.get('movementType') || undefined;
    const warehouseFrom = searchParams.get('warehouseFrom') || undefined;
    const warehouseTo = searchParams.get('warehouseTo') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (movementType && movementType !== 'all') {
      conditions.push(eq(transfers.movementType, movementType));
    }

    if (warehouseFrom) {
      conditions.push(eq(transfers.warehouseIdFrom, warehouseFrom));
    }

    if (warehouseTo) {
      conditions.push(eq(transfers.warehouseIdTo, warehouseTo));
    }

    if (dateFrom) {
      conditions.push(sql`${transfers.transferDate} >= ${dateFrom}`);
    }

    if (dateTo) {
      conditions.push(sql`${transfers.transferDate} <= ${dateTo}`);
    }

    if (search) {
      conditions.push(
        or(
          like(transfers.transferNumber, `%${search}%`),
          like(transfers.notes, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(transfers.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'transferNumber-asc':
          orderByClause = asc(transfers.transferNumber);
          break;
        case 'transferNumber-desc':
          orderByClause = desc(transfers.transferNumber);
          break;
        case 'transferDate-asc':
          orderByClause = asc(transfers.transferDate);
          break;
        case 'transferDate-desc':
          orderByClause = desc(transfers.transferDate);
          break;
        default:
          orderByClause = desc(transfers.createdAt);
      }
    }

    // Fetch transfers with related data
    const transfersData = await db
      .select({
        id: transfers.id,
        transferNumber: transfers.transferNumber,
        warehouseIdFrom: transfers.warehouseIdFrom,
        warehouseFromName: sql<string>`${warehouses}.name`.as(
          'warehouseFromName',
        ),
        warehouseIdTo: transfers.warehouseIdTo,
        warehouseToName: sql<string>`w2.name`.as('warehouseToName'),
        movementType: transfers.movementType,
        status: transfers.status,
        transferDate: transfers.transferDate,
        invoiceId: transfers.invoiceId,
        deliveryId: transfers.deliveryId,
        notes: transfers.notes,
        createdBy: transfers.createdBy,
        createdByName:
          sql<string>`CONCAT(${users}.first_name, ' ', COALESCE(${users}.last_name, ''))`.as(
            'createdByName',
          ),
        approvedBy: transfers.approvedBy,
        approvedByName:
          sql<string>`CONCAT(u2.first_name, ' ', COALESCE(u2.last_name, ''))`.as(
            'approvedByName',
          ),
        approvedAt: transfers.approvedAt,
        completedAt: transfers.completedAt,
        createdAt: transfers.createdAt,
        updatedAt: transfers.updatedAt,
        itemCount: sql<number>`COUNT(${transferItems}.id)`.as('itemCount'),
        totalQuantity: sql<number>`SUM(${transferItems}.quantity)`.as(
          'totalQuantity',
        ),
      })
      .from(transfers)
      .leftJoin(warehouses, eq(transfers.warehouseIdFrom, warehouses.id))
      .leftJoin(
        sql`${warehouses} AS w2`,
        sql`${transfers.warehouseIdTo} = w2.id`,
      )
      .leftJoin(users, eq(transfers.createdBy, users.id))
      .leftJoin(sql`${users} AS u2`, sql`${transfers.approvedBy} = u2.id`)
      .leftJoin(transferItems, eq(transfers.id, transferItems.transferId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(transfers.id)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${transfers.id})`.as('count'),
      })
      .from(transfers)
      .leftJoin(warehouses, eq(transfers.warehouseIdFrom, warehouses.id))
      .leftJoin(
        sql`${warehouses} AS w2`,
        sql`${transfers.warehouseIdTo} = w2.id`,
      )
      .leftJoin(users, eq(transfers.createdBy, users.id))
      .leftJoin(sql`${users} AS u2`, sql`${transfers.approvedBy} = u2.id`)
      .leftJoin(transferItems, eq(transfers.id, transferItems.transferId))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      data: transfersData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'transfers:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const {
      transferNumber,
      warehouseIdFrom,
      warehouseIdTo,
      movementType,
      transferDate,
      invoiceId,
      deliveryId,
      notes,
      items = [],
    } = body;

    // Basic validation
    if (!transferNumber?.trim()) {
      return NextResponse.json(
        { error: 'Transfer number is required' },
        { status: 400 },
      );
    }

    if (!warehouseIdTo) {
      return NextResponse.json(
        { error: 'Destination warehouse is required' },
        { status: 400 },
      );
    }

    if (!movementType) {
      return NextResponse.json(
        { error: 'Movement type is required' },
        { status: 400 },
      );
    }

    if (!transferDate) {
      return NextResponse.json(
        { error: 'Transfer date is required' },
        { status: 400 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 },
      );
    }

    // Create transfer
    const newTransfer = {
      transferNumber: transferNumber.trim(),
      warehouseIdFrom: warehouseIdFrom || null,
      warehouseIdTo,
      movementType,
      status: 'pending',
      transferDate: new Date(transferDate),
      invoiceId: invoiceId?.trim() || null,
      deliveryId: deliveryId?.trim() || null,
      notes: notes?.trim() || null,
      createdBy: session.user.id,
    };

    await db.insert(transfers).values(newTransfer);

    // Get the created transfer to obtain the auto-generated ID
    const createdTransferRecord = await db
      .select({ id: transfers.id })
      .from(transfers)
      .where(eq(transfers.transferNumber, transferNumber.trim()))
      .orderBy(desc(transfers.createdAt))
      .limit(1);

    if (createdTransferRecord.length === 0) {
      throw new Error('Failed to retrieve created transfer');
    }

    const transferId = createdTransferRecord[0].id;

    // Create transfer items
    const transferItemsData = items.map((item: any) => ({
      transferId,
      productId: item.productId,
      quantity: item.quantity,
      quantityTransferred: 0,
      notes: item.notes?.trim() || null,
    }));

    await db.insert(transferItems).values(transferItemsData);

    // Get the created transfer with related data
    const createdTransferData = await db
      .select({
        id: transfers.id,
        transferNumber: transfers.transferNumber,
        warehouseIdFrom: transfers.warehouseIdFrom,
        warehouseFromName: warehouses.name,
        warehouseIdTo: transfers.warehouseIdTo,
        warehouseToName: sql<string>`w2.name`.as('warehouseToName'),
        movementType: transfers.movementType,
        status: transfers.status,
        transferDate: transfers.transferDate,
        invoiceId: transfers.invoiceId,
        deliveryId: transfers.deliveryId,
        notes: transfers.notes,
        createdBy: transfers.createdBy,
        createdByName:
          sql<string>`CONCAT(${users}.first_name, ' ', COALESCE(${users}.last_name, ''))`.as(
            'createdByName',
          ),
        approvedBy: transfers.approvedBy,
        approvedByName:
          sql<string>`CONCAT(u2.first_name, ' ', COALESCE(u2.last_name, ''))`.as(
            'approvedByName',
          ),
        approvedAt: transfers.approvedAt,
        completedAt: transfers.completedAt,
        createdAt: transfers.createdAt,
        updatedAt: transfers.updatedAt,
      })
      .from(transfers)
      .leftJoin(warehouses, eq(transfers.warehouseIdFrom, warehouses.id))
      .leftJoin(
        sql`${warehouses} AS w2`,
        sql`${transfers.warehouseIdTo} = w2.id`,
      )
      .leftJoin(users, eq(transfers.createdBy, users.id))
      .leftJoin(sql`${users} AS u2`, sql`${transfers.approvedBy} = u2.id`)
      .where(eq(transfers.transferNumber, transferNumber.trim()))
      .orderBy(desc(transfers.createdAt))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Transfer created successfully',
        data: createdTransferData[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating transfer:', error);
    return NextResponse.json(
      { error: 'Failed to create transfer' },
      { status: 500 },
    );
  }
}
