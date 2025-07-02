import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, params.id))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      code,
      name,
      type,
      npwp,
      npwp16,
      billingAddress,
      shippingAddress,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      paymentTerms,
      isPPN,
    } = body;

    // Check if customer exists
    const existingCustomer = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.id, params.id))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Update customer
    await db
      .update(customers)
      .set({
        code,
        name,
        type,
        npwp,
        npwp16,
        billingAddress,
        shippingAddress,
        contactPersonName,
        contactPersonEmail,
        contactPersonPhone,
        paymentTerms,
        isPPN,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, params.id));

    return NextResponse.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if customer exists
    const existingCustomer = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.id, params.id))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Delete customer
    await db.delete(customers).where(eq(customers.id, params.id));

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}