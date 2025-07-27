import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { machineTypes } from '@/lib/db/schema';

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
