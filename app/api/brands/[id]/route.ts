import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { brands } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

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
    const { name, type } = body;

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 },
      );
    }

    if (!type || !['machine', 'sparepart'].includes(type)) {
      return NextResponse.json(
        {
          error:
            'Brand type is required and must be either "machine" or "sparepart"',
        },
        { status: 400 },
      );
    }

    // Check if brand exists
    const existingBrand = await db
      .select()
      .from(brands)
      .where(eq(brands.id, params.id))
      .limit(1);

    if (existingBrand.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Update brand
    const updatedBrand = {
      type: type,
      name: name.trim(),
    };

    await db.update(brands).set(updatedBrand).where(eq(brands.id, params.id));

    return NextResponse.json({
      message: 'Brand updated successfully',
      data: { id: params.id, ...updatedBrand },
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
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
    // Check if brand exists
    const existingBrand = await db
      .select()
      .from(brands)
      .where(eq(brands.id, params.id))
      .limit(1);

    if (existingBrand.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Delete brand
    await db.delete(brands).where(eq(brands.id, params.id));

    return NextResponse.json({
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 },
    );
  }
}
