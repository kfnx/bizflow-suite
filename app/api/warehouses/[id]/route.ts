import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { users, warehouses } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'warehouses:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const warehouse = await db
      .select({
        id: warehouses.id,
        name: warehouses.name,
        address: warehouses.address,
        managerId: warehouses.managerId,
        managerFirstName: users.firstName,
        managerLastName: users.lastName,
        isActive: warehouses.isActive,
        createdAt: warehouses.createdAt,
        updatedAt: warehouses.updatedAt,
      })
      .from(warehouses)
      .leftJoin(users, eq(warehouses.managerId, users.id))
      .where(eq(warehouses.id, params.id))
      .limit(1);

    if (warehouse.length === 0) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(warehouse[0]);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'warehouses:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const { name, address, managerId, isActive } = body;

    // Check if warehouse exists
    const existingWarehouse = await db
      .select({ id: warehouses.id })
      .from(warehouses)
      .where(eq(warehouses.id, params.id))
      .limit(1);

    if (existingWarehouse.length === 0) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 },
      );
    }

    // Update warehouse
    await db
      .update(warehouses)
      .set({
        name,
        address,
        managerId,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(warehouses.id, params.id));

    return NextResponse.json({ message: 'Warehouse updated successfully' });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to update warehouse' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'warehouses:delete');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    // Check if warehouse exists
    const existingWarehouse = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.id, params.id))
      .limit(1);

    if (existingWarehouse.length === 0) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 },
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(warehouses)
      .set({ isActive: false })
      .where(eq(warehouses.id, params.id));

    return NextResponse.json(
      { message: 'Successfully set warehouse to inactive' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error setting warehouse to inactive:', error);
    return NextResponse.json(
      { error: 'Failed to set warehouse to inactive' },
      { status: 500 },
    );
  }
}
