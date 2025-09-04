import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { importItems, machineModel, products } from '@/lib/db/schema';

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
        { error: 'Machine model name is required' },
        { status: 400 },
      );
    }

    if (name.trim().length > 36) {
      return NextResponse.json(
        { error: 'Machine model name must be 36 characters or less' },
        { status: 400 },
      );
    }

    // Check if machine model exists
    const existingMachineModel = await db
      .select()
      .from(machineModel)
      .where(eq(machineModel.id, params.id))
      .limit(1);

    if (existingMachineModel.length === 0) {
      return NextResponse.json(
        { error: 'Machine model not found' },
        { status: 404 },
      );
    }

    // Update machine model
    const updatedMachineModel = {
      name: name.trim(),
    };

    await db
      .update(machineModel)
      .set(updatedMachineModel)
      .where(eq(machineModel.id, params.id));

    return NextResponse.json({
      message: 'Machine model updated successfully',
      data: { id: params.id, ...updatedMachineModel },
    });
  } catch (error) {
    console.error('Error updating machine model:', error);
    return NextResponse.json(
      { error: 'Failed to update machine model' },
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
    // Check if machine model exists
    const existingMachineModel = await db
      .select()
      .from(machineModel)
      .where(eq(machineModel.id, params.id))
      .limit(1);

    if (existingMachineModel.length === 0) {
      return NextResponse.json(
        { error: 'Machine model not found' },
        { status: 404 },
      );
    }

    // Check if machine model is referenced in products table
    const productsUsingMachineModel = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.machineModel, params.id))
      .limit(1);

    if (productsUsingMachineModel.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete machine model. It is being used by products.',
          details: `Machine model is referenced by product: ${productsUsingMachineModel[0].name}`,
        },
        { status: 409 },
      );
    }

    // Check if machine model is referenced in import items table
    const importItemsUsingMachineModel = await db
      .select({ id: importItems.id, name: importItems.name })
      .from(importItems)
      .where(eq(importItems.machineModel, params.id))
      .limit(1);

    if (importItemsUsingMachineModel.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete machine model. It is being used by import items.',
          details: `Machine model is referenced by import item: ${importItemsUsingMachineModel[0].name}`,
        },
        { status: 409 },
      );
    }

    // Delete machine model
    await db.delete(machineModel).where(eq(machineModel.id, params.id));

    return NextResponse.json({
      message: 'Machine model deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting machine model:', error);
    return NextResponse.json(
      { error: 'Failed to delete machine model' },
      { status: 500 },
    );
  }
}
