import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { brands, products, importItems } from '@/lib/db/schema';

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

    // Check if brand is referenced in products table
    const productsUsingBrand = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.brandId, params.id))
      .limit(1);

    if (productsUsingBrand.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete brand. It is being used by products.',
          details: `Brand is referenced by product: ${productsUsingBrand[0].name}`
        },
        { status: 409 }
      );
    }

    // Check if brand is referenced in import items table
    const importItemsUsingBrand = await db
      .select({ id: importItems.id, name: importItems.name })
      .from(importItems)
      .where(eq(importItems.brandId, params.id))
      .limit(1);

    if (importItemsUsingBrand.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete brand. It is being used by import items.',
          details: `Brand is referenced by import item: ${importItemsUsingBrand[0].name}`
        },
        { status: 409 }
      );
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
