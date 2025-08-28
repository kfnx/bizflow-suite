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
        { error: 'Model number name is required' },
        { status: 400 },
      );
    }

    if (name.trim().length > 36) {
      return NextResponse.json(
        { error: 'Model number name must be 36 characters or less' },
        { status: 400 },
      );
    }

    // Check if model number exists
    const existingModelNumber = await db
      .select()
      .from(machineModel)
      .where(eq(machineModel.id, params.id))
      .limit(1);

    if (existingModelNumber.length === 0) {
      return NextResponse.json(
        { error: 'Model number not found' },
        { status: 404 },
      );
    }

    // Update model number
    const updatedModelNumber = {
      name: name.trim(),
    };

    await db
      .update(machineModel)
      .set(updatedModelNumber)
      .where(eq(machineModel.id, params.id));

    return NextResponse.json({
      message: 'Model number updated successfully',
      data: { id: params.id, ...updatedModelNumber },
    });
  } catch (error) {
    console.error('Error updating model number:', error);
    return NextResponse.json(
      { error: 'Failed to update model number' },
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
    // Check if model number exists
    const existingModelNumber = await db
      .select()
      .from(machineModel)
      .where(eq(machineModel.id, params.id))
      .limit(1);

    if (existingModelNumber.length === 0) {
      return NextResponse.json(
        { error: 'Model number not found' },
        { status: 404 },
      );
    }

    // Check if model number is referenced in products table
    const productsUsingModelNumber = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.modelNumber, params.id))
      .limit(1);

    if (productsUsingModelNumber.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete model number. It is being used by products.',
          details: `Model number is referenced by product: ${productsUsingModelNumber[0].name}`,
        },
        { status: 409 },
      );
    }

    // Check if model number is referenced in import items table
    const importItemsUsingModelNumber = await db
      .select({ id: importItems.id, name: importItems.name })
      .from(importItems)
      .where(eq(importItems.modelNumber, params.id))
      .limit(1);

    if (importItemsUsingModelNumber.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete model number. It is being used by import items.',
          details: `Model number is referenced by import item: ${importItemsUsingModelNumber[0].name}`,
        },
        { status: 409 },
      );
    }

    // Delete model number
    await db.delete(machineModel).where(eq(machineModel.id, params.id));

    return NextResponse.json({
      message: 'Model number deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting model number:', error);
    return NextResponse.json(
      { error: 'Failed to delete model number' },
      { status: 500 },
    );
  }
}
