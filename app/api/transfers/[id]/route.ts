import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { products, stockMovements, warehouses } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'transfers:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const transfer = await db
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
      .where(eq(stockMovements.id, params.id))
      .limit(1);

    if (transfer.length === 0) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(transfer[0]);
  } catch (error) {
    console.error('Error fetching transfer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfer' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'transfers:update');

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

    // Check if transfer exists
    const existingTransfer = await db
      .select({ id: stockMovements.id })
      .from(stockMovements)
      .where(eq(stockMovements.id, params.id))
      .limit(1);

    if (existingTransfer.length === 0) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 },
      );
    }

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

    // Update transfer
    await db
      .update(stockMovements)
      .set({
        warehouseIdFrom,
        warehouseIdTo,
        productId,
        quantity: parseInt(quantity),
        movementType,
        invoiceId: invoiceId || null,
        deliveryId: deliveryId || null,
        notes: notes?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(stockMovements.id, params.id));

    return NextResponse.json({ message: 'Transfer updated successfully' });
  } catch (error) {
    console.error('Error updating transfer:', error);
    return NextResponse.json(
      { error: 'Failed to update transfer' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'transfers:delete');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    // Check if transfer exists
    const existingTransfer = await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.id, params.id))
      .limit(1);

    if (existingTransfer.length === 0) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 },
      );
    }

    // Hard delete the transfer
    await db.delete(stockMovements).where(eq(stockMovements.id, params.id));

    return NextResponse.json(
      { message: 'Transfer deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return NextResponse.json(
      { error: 'Failed to delete transfer' },
      { status: 500 },
    );
  }
}
