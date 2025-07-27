import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { machineTypes } from '@/lib/db/schema';

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
      conditions.push(like(machineTypes.name, `%${search}%`));
    }

    // Build order by clause
    let orderByClause = desc(machineTypes.createdAt); // Default newest first
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(machineTypes.name);
          break;
        case 'name-desc':
          orderByClause = desc(machineTypes.name);
          break;
        case 'created-asc':
          orderByClause = asc(machineTypes.createdAt);
          break;
        case 'created-desc':
          orderByClause = desc(machineTypes.createdAt);
          break;
        default:
          orderByClause = desc(machineTypes.createdAt);
      }
    }

    // Fetch machine types
    const machineTypesData = await db
      .select({
        id: machineTypes.id,
        name: machineTypes.name,
      })
      .from(machineTypes)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: machineTypes.id })
      .from(machineTypes)
      .where(conditions.length > 0 ? or(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: machineTypesData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching machine types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch machine types' },
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
        { error: 'Machine type name is required' },
        { status: 400 },
      );
    }

    // Create machine type
    const newMachineType = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };

    await db.insert(machineTypes).values(newMachineType);

    return NextResponse.json(
      {
        message: 'Machine type created successfully',
        data: newMachineType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating machine type:', error);
    return NextResponse.json(
      { error: 'Failed to create machine type' },
      { status: 500 },
    );
  }
}
