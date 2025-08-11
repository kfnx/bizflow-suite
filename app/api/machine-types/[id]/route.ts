import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { importItems, machineTypes, products } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'products:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const { name } = body;

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Machine type name is required' },
        { status: 400 },
      );
    }

    // Check if machine type exists
    const existingMachineType = await db
      .select()
      .from(machineTypes)
      .where(eq(machineTypes.id, params.id))
      .limit(1);

    if (existingMachineType.length === 0) {
      return NextResponse.json(
        { error: 'Machine type not found' },
        { status: 404 },
      );
    }

    // Update machine type
    const updatedMachineType = {
      name: name.trim(),
    };

    await db
      .update(machineTypes)
      .set(updatedMachineType)
      .where(eq(machineTypes.id, params.id));

    return NextResponse.json({
      message: 'Machine type updated successfully',
      data: { id: params.id, ...updatedMachineType },
    });
  } catch (error) {
    console.error('Error updating machine type:', error);
    return NextResponse.json(
      { error: 'Failed to update machine type' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'products:delete');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    // Check if machine type exists
    const existingMachineType = await db
      .select()
      .from(machineTypes)
      .where(eq(machineTypes.id, params.id))
      .limit(1);

    if (existingMachineType.length === 0) {
      return NextResponse.json(
        { error: 'Machine type not found' },
        { status: 404 },
      );
    }

    // Check if machine type is referenced in products table
    const productsUsingMachineType = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.machineTypeId, params.id))
      .limit(1);

    if (productsUsingMachineType.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete machine type. It is being used by products.',
          details: `Machine type is referenced by product: ${productsUsingMachineType[0].name}`,
        },
        { status: 409 },
      );
    }

    // Check if machine type is referenced in import items table
    const importItemsUsingMachineType = await db
      .select({ id: importItems.id, name: importItems.name })
      .from(importItems)
      .where(eq(importItems.machineTypeId, params.id))
      .limit(1);

    if (importItemsUsingMachineType.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete machine type. It is being used by import items.',
          details: `Machine type is referenced by import item: ${importItemsUsingMachineType[0].name}`,
        },
        { status: 409 },
      );
    }

    // Delete machine type
    await db.delete(machineTypes).where(eq(machineTypes.id, params.id));

    return NextResponse.json({
      message: 'Machine type deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting machine type:', error);
    return NextResponse.json(
      { error: 'Failed to delete machine type' },
      { status: 500 },
    );
  }
}
