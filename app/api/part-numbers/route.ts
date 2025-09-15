import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { partNumbers } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'products:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = request.nextUrl;

    // Parse query parameters
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(partNumbers.number, `%${search}%`),
          like(partNumbers.name, `%${search}%`)
        )
      );
    }

    // Build order by clause
    let orderByClause = desc(partNumbers.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(partNumbers.name);
          break;
        case 'name-desc':
          orderByClause = desc(partNumbers.name);
          break;
        case 'created-asc':
          orderByClause = asc(partNumbers.createdAt);
          break;
        case 'created-desc':
          orderByClause = desc(partNumbers.createdAt);
          break;
        default:
          orderByClause = desc(partNumbers.createdAt);
      }
    }

    // Fetch part numbers
    const partNumbersData = await db
      .select({
        id: partNumbers.id,
        number: partNumbers.number,
        name: partNumbers.name,
      })
      .from(partNumbers)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: partNumbers.id })
      .from(partNumbers)
      .where(conditions.length > 0 ? or(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: partNumbersData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching part numbers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch part numbers' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'products:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const { number, name } = body;

    // Basic validation
    if (!number?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'Both part number and name are required' },
        { status: 400 },
      );
    }

    if (number.trim().length > 100 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Part number and name must be 100 characters or less' },
        { status: 400 },
      );
    }

    // Check if part number with same number already exists
    const existingPartNumber = await db
      .select({ id: partNumbers.id, number: partNumbers.number })
      .from(partNumbers)
      .where(like(partNumbers.number, number.trim()))
      .limit(1);

    if (existingPartNumber.length > 0) {
      return NextResponse.json(
        {
          error: 'Part number already exists',
          details: `A part number "${existingPartNumber[0].number}" already exists`,
        },
        { status: 409 },
      );
    }

    // Create part number with slugified ID
    const partNumberId = createSlug(number.trim());
    const newPartNumber = {
      id: partNumberId,
      number: number.trim(),
      name: name.trim(),
    };

    await db.insert(partNumbers).values(newPartNumber);

    return NextResponse.json(
      {
        message: 'Part number created successfully',
        data: newPartNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating part number:', error);
    return NextResponse.json(
      { error: 'Failed to create part number' },
      { status: 500 },
    );
  }
}
