import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { modelNumbers } from '@/lib/db/schema';

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
      conditions.push(like(modelNumbers.name, `%${search}%`));
    }

    // Build order by clause
    let orderByClause = desc(modelNumbers.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(modelNumbers.name);
          break;
        case 'name-desc':
          orderByClause = desc(modelNumbers.name);
          break;
        case 'created-asc':
          orderByClause = asc(modelNumbers.createdAt);
          break;
        case 'created-desc':
          orderByClause = desc(modelNumbers.createdAt);
          break;
        default:
          orderByClause = desc(modelNumbers.createdAt);
      }
    }

    // Fetch model numbers
    const modelNumbersData = await db
      .select({
        id: modelNumbers.id,
        name: modelNumbers.name,
      })
      .from(modelNumbers)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: modelNumbers.id })
      .from(modelNumbers)
      .where(conditions.length > 0 ? or(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: modelNumbersData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching model numbers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model numbers' },
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
    const { name } = body;

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Model number name is required' },
        { status: 400 },
      );
    }

    if (name.trim().length > 36) {
      return NextResponse.json(
        { error: 'Model number name must be 36 characters or less' },
        { status: 400 },
      );
    }

    // Check if model number with same name already exists
    const existingModelNumber = await db
      .select({ id: modelNumbers.id, name: modelNumbers.name })
      .from(modelNumbers)
      .where(like(modelNumbers.name, name.trim()))
      .limit(1);

    if (existingModelNumber.length > 0) {
      return NextResponse.json(
        {
          error: 'Model number with this name already exists',
          details: `A model number named "${existingModelNumber[0].name}" already exists`,
        },
        { status: 409 },
      );
    }

    // Create model number with slugified ID
    const modelNumberId = createSlug(name.trim());
    const newModelNumber = {
      id: modelNumberId,
      name: name.trim(),
    };

    await db.insert(modelNumbers).values(newModelNumber);

    return NextResponse.json(
      {
        message: 'Model number created successfully',
        data: newModelNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating model number:', error);
    return NextResponse.json(
      { error: 'Failed to create model number' },
      { status: 500 },
    );
  }
}
