import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Delete the product
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
