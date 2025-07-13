import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { supplierContactPersons, suppliers } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const country = searchParams.get('country');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const sortBy = searchParams.get('sortBy') || 'newest-first';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // By default, only include active suppliers unless explicitly requested
    if (!includeInactive) {
      whereConditions.push(eq(suppliers.isActive, true));
    }

    if (search) {
      whereConditions.push(
        or(
          like(suppliers.code, `%${search}%`),
          like(suppliers.name, `%${search}%`),
          like(suppliers.city, `%${search}%`),
          like(suppliers.country, `%${search}%`),
        ),
      );
    }

    if (country && country !== 'all') {
      whereConditions.push(eq(suppliers.country, country));
    }

    // Build order by
    let orderBy;
    switch (sortBy) {
      case 'name-asc':
        orderBy = asc(suppliers.name);
        break;
      case 'name-desc':
        orderBy = desc(suppliers.name);
        break;
      case 'code-asc':
        orderBy = asc(suppliers.code);
        break;
      case 'code-desc':
        orderBy = desc(suppliers.code);
        break;
      case 'country-asc':
        orderBy = asc(suppliers.country);
        break;
      case 'country-desc':
        orderBy = desc(suppliers.country);
        break;
      default:
        orderBy = desc(suppliers.createdAt);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: suppliers.id })
      .from(suppliers)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .then((result) => result.length);

    // Get suppliers with pagination
    const suppliersData = await db
      .select()
      .from(suppliers)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: suppliersData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
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
      country,
      address,
      city,
      province,
      transactionCurrency,
      postalCode,
      contactPersons: contactPersonsData,
    } = body;

    // Validate required fields
    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 },
      );
    }

    // Check if supplier code already exists
    const existingSupplier = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.code, code))
      .limit(1);

    if (existingSupplier.length > 0) {
      return NextResponse.json(
        { error: 'Supplier code already exists' },
        { status: 409 },
      );
    }

    // Create new supplier
    const newSupplierId = uuidv4();
    await db.insert(suppliers).values({
      id: newSupplierId,
      code,
      name,
      country,
      address,
      city,
      province,
      transactionCurrency: transactionCurrency || 'USD',
      postalCode,
      isActive: true,
    });

    // Handle contact persons if provided
    if (
      contactPersonsData &&
      Array.isArray(contactPersonsData) &&
      contactPersonsData.length > 0
    ) {
      for (const contactPersonData of contactPersonsData) {
        // Create contact person directly in supplierContactPersons table
        await db.insert(supplierContactPersons).values({
          supplierId: newSupplierId,
          name: contactPersonData.name,
          email: contactPersonData.email,
          phone: contactPersonData.phone,
        });
      }
    }

    return NextResponse.json(
      { message: 'Supplier created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 },
    );
  }
}
