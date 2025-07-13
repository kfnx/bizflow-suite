import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { products, stockMovements, warehouses } from '@/lib/db/schema';

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
    const warehouseIdFrom = searchParams.get('warehouseIdFrom') || undefined;
    const warehouseIdTo = searchParams.get('warehouseIdTo') || undefined;
    const productId = searchParams.get('productId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (movementType && movementType !== 'all') {
      conditions.push(eq(stockMovements.movementType, movementType));
    }

    if (warehouseIdFrom) {
      conditions.push(eq(stockMovements.warehouseIdFrom, warehouseIdFrom));
    }

    if (warehouseIdTo) {
      conditions.push(eq(stockMovements.warehouseIdTo, warehouseIdTo));
    }

    if (productId) {
      conditions.push(eq(stockMovements.productId, productId));
    }

    if (dateFrom) {
      conditions.push(
        sql`${stockMovements.createdAt} >= ${new Date(dateFrom)}`,
      );
    }

    if (dateTo) {
      conditions.push(sql`${stockMovements.createdAt} <= ${new Date(dateTo)}`);
    }

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(stockMovements.notes, `%${search}%`),
          like(stockMovements.invoiceId, `%${search}%`),
          like(stockMovements.deliveryId, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(stockMovements.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'date-asc':
          orderByClause = asc(stockMovements.createdAt);
          break;
        case 'date-desc':
          orderByClause = desc(stockMovements.createdAt);
          break;
        case 'movement-type-asc':
          orderByClause = asc(stockMovements.movementType);
          break;
        case 'movement-type-desc':
          orderByClause = desc(stockMovements.movementType);
          break;
        case 'product-asc':
          orderByClause = asc(products.name);
          break;
        case 'product-desc':
          orderByClause = desc(products.name);
          break;
        case 'quantity-asc':
          orderByClause = asc(stockMovements.quantity);
          break;
        case 'quantity-desc':
          orderByClause = desc(stockMovements.quantity);
          break;
        default:
          orderByClause = desc(stockMovements.createdAt);
      }
    }

    // Alias for warehouse tables to avoid conflicts
    const warehouseFrom = warehouses;
    const warehouseTo = warehouses;

    // Fetch stock movements with related data
    const stockMovementsData = await db
      .select({
        id: stockMovements.id,
        warehouseIdFrom: stockMovements.warehouseIdFrom,
        warehouseFromName: sql<string>`wf.name`,
        warehouseIdTo: stockMovements.warehouseIdTo,
        warehouseToName: sql<string>`wt.name`,
        productId: stockMovements.productId,
        name: products.name,
        quantity: stockMovements.quantity,
        movementType: stockMovements.movementType,
        invoiceId: stockMovements.invoiceId,
        deliveryId: stockMovements.deliveryId,
        notes: stockMovements.notes,
        createdAt: stockMovements.createdAt,
        updatedAt: stockMovements.updatedAt,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .leftJoin(
        sql`warehouses wf`,
        sql`${stockMovements.warehouseIdFrom} = wf.id`,
      )
      .leftJoin(
        sql`warehouses wt`,
        sql`${stockMovements.warehouseIdTo} = wt.id`,
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .leftJoin(
        sql`warehouses wf`,
        sql`${stockMovements.warehouseIdFrom} = wf.id`,
      )
      .leftJoin(
        sql`warehouses wt`,
        sql`${stockMovements.warehouseIdTo} = wt.id`,
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      data: stockMovementsData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
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
      warehouseIdFrom,
      warehouseIdTo,
      productId,
      quantity,
      movementType,
      invoiceId,
      deliveryId,
      notes,
    } = body;

    // Basic validation
    if (!warehouseIdFrom) {
      return NextResponse.json(
        { error: 'Source warehouse is required' },
        { status: 400 },
      );
    }

    if (!warehouseIdTo) {
      return NextResponse.json(
        { error: 'Destination warehouse is required' },
        { status: 400 },
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product is required' },
        { status: 400 },
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 },
      );
    }

    if (!movementType) {
      return NextResponse.json(
        { error: 'Movement type is required' },
        { status: 400 },
      );
    }

    // Create stock movement
    const newStockMovement = {
      warehouseIdFrom,
      warehouseIdTo,
      productId,
      quantity: parseInt(quantity),
      movementType,
      invoiceId: invoiceId || null,
      deliveryId: deliveryId || null,
      notes: notes?.trim() || null,
    };

    await db.insert(stockMovements).values(newStockMovement);

    // Get the created stock movement with related data
    const createdMovement = await db
      .select({
        id: stockMovements.id,
        warehouseIdFrom: stockMovements.warehouseIdFrom,
        warehouseFromName: sql<string>`wf.name`,
        warehouseIdTo: stockMovements.warehouseIdTo,
        warehouseToName: sql<string>`wt.name`,
        productId: stockMovements.productId,
        name: products.name,
        quantity: stockMovements.quantity,
        movementType: stockMovements.movementType,
        invoiceId: stockMovements.invoiceId,
        deliveryId: stockMovements.deliveryId,
        notes: stockMovements.notes,
        createdAt: stockMovements.createdAt,
        updatedAt: stockMovements.updatedAt,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .leftJoin(
        sql`warehouses wf`,
        sql`${stockMovements.warehouseIdFrom} = wf.id`,
      )
      .leftJoin(
        sql`warehouses wt`,
        sql`${stockMovements.warehouseIdTo} = wt.id`,
      )
      .where(
        and(
          eq(stockMovements.warehouseIdFrom, warehouseIdFrom),
          eq(stockMovements.warehouseIdTo, warehouseIdTo),
          eq(stockMovements.productId, productId),
        ),
      )
      .orderBy(desc(stockMovements.createdAt))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Stock movement created successfully',
        data: createdMovement[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating stock movement:', error);
    return NextResponse.json(
      { error: 'Failed to create stock movement' },
      { status: 500 },
    );
  }
}
