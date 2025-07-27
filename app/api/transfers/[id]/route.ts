import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import {
  products,
  transferItems,
  transfers,
  users,
  warehouses,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'transfers:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;

    // Get transfer with related data
    const transferData = await db
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
      .where(eq(transfers.id, id))
      .limit(1);

    if (transferData.length === 0) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 },
      );
    }

    // Get transfer items
    const items = await db
      .select({
        id: transferItems.id,
        productId: transferItems.productId,
        productName: products.name,
        productCode: products.code,
        quantity: transferItems.quantity,
        quantityTransferred: transferItems.quantityTransferred,
        notes: transferItems.notes,
        createdAt: transferItems.createdAt,
      })
      .from(transferItems)
      .leftJoin(products, eq(transferItems.productId, products.id))
      .where(eq(transferItems.transferId, id));

    const transfer = {
      ...transferData[0],
      items,
      itemCount: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    return NextResponse.json(transfer);
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
    const { id } = params;
    const body = await request.json();

    // Check if transfer exists
    const existingTransfer = await db
      .select()
      .from(transfers)
      .where(eq(transfers.id, id))
      .limit(1);

    if (existingTransfer.length === 0) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 },
      );
    }

    const {
      transferNumber,
      warehouseIdFrom,
      warehouseIdTo,
      movementType,
      status,
      transferDate,
      invoiceId,
      deliveryId,
      notes,
      approvedBy,
      approvedAt,
      completedAt,
      items = [],
    } = body;

    // Update transfer
    const updateData: any = {};

    if (transferNumber !== undefined)
      updateData.transferNumber = transferNumber?.trim();
    if (warehouseIdFrom !== undefined)
      updateData.warehouseIdFrom = warehouseIdFrom;
    if (warehouseIdTo !== undefined) updateData.warehouseIdTo = warehouseIdTo;
    if (movementType !== undefined) updateData.movementType = movementType;
    if (status !== undefined) updateData.status = status;
    if (transferDate !== undefined)
      updateData.transferDate = new Date(transferDate);
    if (invoiceId !== undefined)
      updateData.invoiceId = invoiceId?.trim() || null;
    if (deliveryId !== undefined)
      updateData.deliveryId = deliveryId?.trim() || null;
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    if (approvedBy !== undefined) updateData.approvedBy = approvedBy;
    if (approvedAt !== undefined)
      updateData.approvedAt = approvedAt ? new Date(approvedAt) : null;
    if (completedAt !== undefined)
      updateData.completedAt = completedAt ? new Date(completedAt) : null;

    await db.update(transfers).set(updateData).where(eq(transfers.id, id));

    // Update transfer items if provided
    if (items && items.length > 0) {
      // Delete existing items
      await db.delete(transferItems).where(eq(transferItems.transferId, id));

      // Insert new items
      const transferItemsData = items.map((item: any) => ({
        transferId: id,
        productId: item.productId,
        quantity: item.quantity,
        quantityTransferred: item.quantityTransferred || 0,
        notes: item.notes?.trim() || null,
      }));

      await db.insert(transferItems).values(transferItemsData);
    }

    // Get updated transfer with related data
    const updatedTransfer = await db
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
      .where(eq(transfers.id, id))
      .limit(1);

    return NextResponse.json({
      message: 'Transfer updated successfully',
      data: updatedTransfer[0],
    });
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
    const { id } = params;

    // Check if transfer exists
    const existingTransfer = await db
      .select()
      .from(transfers)
      .where(eq(transfers.id, id))
      .limit(1);

    if (existingTransfer.length === 0) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 },
      );
    }

    // Delete transfer items first (due to foreign key constraint)
    await db.delete(transferItems).where(eq(transferItems.transferId, id));

    // Delete transfer
    await db.delete(transfers).where(eq(transfers.id, id));

    return NextResponse.json({
      message: 'Transfer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return NextResponse.json(
      { error: 'Failed to delete transfer' },
      { status: 500 },
    );
  }
}
