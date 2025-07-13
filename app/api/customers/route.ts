import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { customerContactPersons, customers } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const sortBy = searchParams.get('sortBy') || 'newest-first';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions: any[] = [];

    // By default, only include active customers unless explicitly requested
    if (!includeInactive) {
      conditions.push(eq(customers.isActive, true));
    }

    if (search) {
      conditions.push(
        or(
          like(customers.code, `%${search}%`),
          like(customers.name, `%${search}%`),
          like(customers.city, `%${search}%`),
          like(customers.country, `%${search}%`),
        ),
      );
    }

    if (type && type !== 'all') {
      conditions.push(eq(customers.type, type));
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: customers.id })
      .from(customers)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Fetch customers with pagination
    const customersData = await db
      .select({
        id: customers.id,
        code: customers.code,
        name: customers.name,
        type: customers.type,
        city: customers.city,
        country: customers.country,
        isPPN: customers.isPPN,
        isActive: customers.isActive,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        sortBy === 'name-asc'
          ? asc(customers.name)
          : sortBy === 'name-desc'
            ? desc(customers.name)
            : sortBy === 'code-asc'
              ? asc(customers.code)
              : sortBy === 'code-desc'
                ? desc(customers.code)
                : sortBy === 'type-asc'
                  ? asc(customers.type)
                  : sortBy === 'type-desc'
                    ? desc(customers.type)
                    : desc(customers.createdAt), // newest-first default
      )
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      data: customersData,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
      isPPN,
    } = body;

    // Validate required fields
    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 },
      );
    }

    // Check if customer code already exists
    const existingCustomer = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.code, code))
      .limit(1);

    if (existingCustomer.length > 0) {
      return NextResponse.json(
        { error: 'Customer code already exists' },
        { status: 409 },
      );
    }

    // Create new customer
    const newCustomerId = uuidv4();
    await db.insert(customers).values({
      id: newCustomerId,
      code,
      name,
      type: type || 'individual',
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
      isPPN: isPPN || false,
    });

    // Handle contact persons if provided
    if (
      contactPersonsData &&
      Array.isArray(contactPersonsData) &&
      contactPersonsData.length > 0
    ) {
      for (const contactPersonData of contactPersonsData) {
        // Create contact person directly in customerContactPersons table
        await db.insert(customerContactPersons).values({
          customerId: newCustomerId,
          name: contactPersonData.name,
          email: contactPersonData.email,
          phone: contactPersonData.phone,
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Customer created successfully',
        data: { id: newCustomerId },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 },
    );
  }
}
