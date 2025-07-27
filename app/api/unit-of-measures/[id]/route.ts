import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { unitOfMeasures } from '@/lib/db/schema';

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
    const { name, abbreviation } = body;

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Unit of measure name is required' },
        { status: 400 },
      );
    }

    if (!abbreviation?.trim()) {
      return NextResponse.json(
        { error: 'Unit of measure abbreviation is required' },
        { status: 400 },
      );
    }

    // Check if unit of measure exists
    const existingUom = await db
      .select()
      .from(unitOfMeasures)
      .where(eq(unitOfMeasures.id, params.id))
      .limit(1);

    if (existingUom.length === 0) {
      return NextResponse.json(
        { error: 'Unit of measure not found' },
        { status: 404 },
      );
    }

    // Update unit of measure
    const updatedUom = {
      name: name.trim(),
      abbreviation: abbreviation.trim(),
    };

    await db
      .update(unitOfMeasures)
      .set(updatedUom)
      .where(eq(unitOfMeasures.id, params.id));

    return NextResponse.json({
      message: 'Unit of measure updated successfully',
      data: { id: params.id, ...updatedUom },
    });
  } catch (error) {
    console.error('Error updating unit of measure:', error);
    return NextResponse.json(
      { error: 'Failed to update unit of measure' },
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
    // Check if unit of measure exists
    const existingUom = await db
      .select()
      .from(unitOfMeasures)
      .where(eq(unitOfMeasures.id, params.id))
      .limit(1);

    if (existingUom.length === 0) {
      return NextResponse.json(
        { error: 'Unit of measure not found' },
        { status: 404 },
      );
    }

    // Delete unit of measure
    await db.delete(unitOfMeasures).where(eq(unitOfMeasures.id, params.id));

    return NextResponse.json({
      message: 'Unit of measure deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting unit of measure:', error);
    return NextResponse.json(
      { error: 'Failed to delete unit of measure' },
      { status: 500 },
    );
  }
}
