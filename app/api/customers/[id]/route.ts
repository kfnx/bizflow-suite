import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customerContactPersons, customers } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
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
        { status: 404 },
      );
    }

    // Fetch contact persons for this customer
    const contactPersonsData = await db
      .select({
        id: customerContactPersons.id,
        prefix: customerContactPersons.prefix,
        name: customerContactPersons.name,
        email: customerContactPersons.email,
        phone: customerContactPersons.phone,
      })
      .from(customerContactPersons)
      .where(eq(customerContactPersons.customerId, params.id));

    return NextResponse.json({
      ...customer[0],
      contactPersons: contactPersonsData,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
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
      type,
      npwp,
      npwp16,
      billingAddress,
      shippingAddress,
      address,
      city,
      province,
      country,
      postalCode,
      contactPersons: contactPersonsData,
      paymentTerms,
      isActive,
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
        { status: 404 },
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
        address,
        city,
        province,
        country,
        postalCode,
        paymentTerms,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, params.id));

    // Handle contact persons update
    if (contactPersonsData && Array.isArray(contactPersonsData)) {
      // Delete existing contact persons
      await db
        .delete(customerContactPersons)
        .where(eq(customerContactPersons.customerId, params.id));

      // Add new contact persons
      for (const contactPersonData of contactPersonsData) {
        await db.insert(customerContactPersons).values({
          customerId: params.id,
          prefix: contactPersonData.prefix,
          name: contactPersonData.name,
          email: contactPersonData.email,
          phone: contactPersonData.phone,
        });
      }
    }

    return NextResponse.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if customer exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, params.id))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 },
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(customers)
      .set({ isActive: false })
      .where(eq(customers.id, params.id));

    return NextResponse.json(
      { message: 'Successfully set customer to inactive' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error setting customer to inactive:', error);
    return NextResponse.json(
      { error: 'Failed to set customer to inactive' },
      { status: 500 },
    );
  }
}
