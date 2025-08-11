import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, eq, like, or } from 'drizzle-orm';

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
    let orderByClause = desc(unitOfMeasures.createdAt); // Default newest first
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
        case 'created-asc':
          orderByClause = asc(unitOfMeasures.createdAt);
          break;
        case 'created-desc':
          orderByClause = desc(unitOfMeasures.createdAt);
          break;
        default:
          orderByClause = desc(unitOfMeasures.createdAt);
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

    // Check if unit of measure with same name already exists
    const existingUomByName = await db
      .select({ id: unitOfMeasures.id, name: unitOfMeasures.name })
      .from(unitOfMeasures)
      .where(eq(unitOfMeasures.name, name.trim()))
      .limit(1);

    if (existingUomByName.length > 0) {
      return NextResponse.json(
        {
          error: 'Unit of measure with this name already exists',
          details: `A unit of measure named "${existingUomByName[0].name}" already exists`,
        },
        { status: 409 },
      );
    }

    // Check if unit of measure with same abbreviation already exists
    const existingUomByAbbreviation = await db
      .select({
        id: unitOfMeasures.id,
        abbreviation: unitOfMeasures.abbreviation,
      })
      .from(unitOfMeasures)
      .where(eq(unitOfMeasures.abbreviation, abbreviation.trim()))
      .limit(1);

    if (existingUomByAbbreviation.length > 0) {
      return NextResponse.json(
        {
          error: 'Unit of measure with this abbreviation already exists',
          details: `A unit of measure with abbreviation "${existingUomByAbbreviation[0].abbreviation}" already exists`,
        },
        { status: 409 },
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
