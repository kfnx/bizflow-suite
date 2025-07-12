import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { unitOfMeasures } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

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
    const limit = parseInt(searchParams.get('limit') || '100'); // Default higher limit for dropdown usage

    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(unitOfMeasures.name, `%${search}%`),
          like(unitOfMeasures.abbreviation, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = asc(unitOfMeasures.name); // Default alphabetical order
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(unitOfMeasures.name);
          break;
        case 'name-desc':
          orderByClause = desc(unitOfMeasures.name);
          break;
        case 'abbreviation-asc':
          orderByClause = asc(unitOfMeasures.abbreviation);
          break;
        case 'abbreviation-desc':
          orderByClause = desc(unitOfMeasures.abbreviation);
          break;
        default:
          orderByClause = asc(unitOfMeasures.name);
      }
    }

    // Fetch unit of measures
    const unitOfMeasuresData = await db
      .select({
        id: unitOfMeasures.id,
        name: unitOfMeasures.name,
        abbreviation: unitOfMeasures.abbreviation,
      })
      .from(unitOfMeasures)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: unitOfMeasures.id })
      .from(unitOfMeasures)
      .where(conditions.length > 0 ? or(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: unitOfMeasuresData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching unit of measures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unit of measures' },
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
    const { name, abbreviation } = body;

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Unit of measure name is required' },
        { status: 400 },
      );
    }

    if (!abbreviation?.trim()) {
      return NextResponse.json(
        { error: 'Unit of measure abbreviation is required' },
        { status: 400 },
      );
    }

    // Create unit of measure
    const newUnitOfMeasure = {
      id: crypto.randomUUID(),
      name: name.trim(),
      abbreviation: abbreviation.trim(),
    };

    await db.insert(unitOfMeasures).values(newUnitOfMeasure);

    return NextResponse.json(
      {
        message: 'Unit of measure created successfully',
        data: newUnitOfMeasure,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating unit of measure:', error);
    return NextResponse.json(
      { error: 'Failed to create unit of measure' },
      { status: 500 },
    );
  }
}
