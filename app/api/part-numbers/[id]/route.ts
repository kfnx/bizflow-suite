import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { importItems, partNumbers, products } from '@/lib/db/schema';

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
        { error: 'Part number name is required' },
        { status: 400 },
      );
    }

    if (name.trim().length > 36) {
      return NextResponse.json(
        { error: 'Part number name must be 36 characters or less' },
        { status: 400 },
      );
    }

    // Check if part number exists
    const existingPartNumber = await db
      .select()
      .from(partNumbers)
      .where(eq(partNumbers.id, params.id))
      .limit(1);

    if (existingPartNumber.length === 0) {
      return NextResponse.json(
        { error: 'Part number not found' },
        { status: 404 },
      );
    }

    // Update part number
    const updatedPartNumber = {
      name: name.trim(),
    };

    await db
      .update(partNumbers)
      .set(updatedPartNumber)
      .where(eq(partNumbers.id, params.id));

    return NextResponse.json({
      message: 'Part number updated successfully',
      data: { id: params.id, ...updatedPartNumber },
    });
  } catch (error) {
    console.error('Error updating part number:', error);
    return NextResponse.json(
      { error: 'Failed to update part number' },
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
    // Check if part number exists
    const existingPartNumber = await db
      .select()
      .from(partNumbers)
      .where(eq(partNumbers.id, params.id))
      .limit(1);

    if (existingPartNumber.length === 0) {
      return NextResponse.json(
        { error: 'Part number not found' },
        { status: 404 },
      );
    }

    // Check if part number is referenced in products table
    const productsUsingPartNumber = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.partNumber, params.id))
      .limit(1);

    if (productsUsingPartNumber.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete part number. It is being used by products.',
          details: `Part number is referenced by product: ${productsUsingPartNumber[0].name}`,
        },
        { status: 409 },
      );
    }

    // Check if part number is referenced in import items table
    const importItemsUsingPartNumber = await db
      .select({ id: importItems.id, name: importItems.name })
      .from(importItems)
      .where(eq(importItems.partNumber, params.id))
      .limit(1);

    if (importItemsUsingPartNumber.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete part number. It is being used by import items.',
          details: `Part number is referenced by import item: ${importItemsUsingPartNumber[0].name}`,
        },
        { status: 409 },
      );
    }

    // Delete part number
    await db.delete(partNumbers).where(eq(partNumbers.id, params.id));

    return NextResponse.json({
      message: 'Part number deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting part number:', error);
    return NextResponse.json(
      { error: 'Failed to delete part number' },
      { status: 500 },
    );
  }
}
