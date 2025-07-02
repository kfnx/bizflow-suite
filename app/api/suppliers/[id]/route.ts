import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { suppliers } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supplier = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, params.id))
      .limit(1);

    if (supplier.length === 0) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(supplier[0]);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supplier' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    const {
      code,
      name,
      country,
      address,
      transactionCurrency,
      postalCode,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      isActive,
    } = body;

    // Validate required fields
    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 },
      );
    }

    // Check if supplier exists
    const existingSupplier = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, params.id))
      .limit(1);

    if (existingSupplier.length === 0) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 },
      );
    }

    // Check if code is being changed and if it already exists
    if (code !== existingSupplier[0].code) {
      const codeExists = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.code, code))
        .limit(1);

      if (codeExists.length > 0) {
        return NextResponse.json(
          { error: 'Supplier code already exists' },
          { status: 409 },
        );
      }
    }

    // Update supplier
    await db
      .update(suppliers)
      .set({
        code,
        name,
        country,
        address,
        transactionCurrency,
        postalCode,
        contactPersonName,
        contactPersonEmail,
        contactPersonPhone,
        isActive:
          isActive !== undefined ? isActive : existingSupplier[0].isActive,
      })
      .where(eq(suppliers.id, params.id));

    return NextResponse.json(
      { message: 'Supplier updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if supplier exists
    const existingSupplier = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, params.id))
      .limit(1);

    if (existingSupplier.length === 0) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 },
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(suppliers)
      .set({ isActive: false })
      .where(eq(suppliers.id, params.id));

    return NextResponse.json(
      { message: 'Supplier deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json(
      { error: 'Failed to delete supplier' },
      { status: 500 },
    );
  }
}
