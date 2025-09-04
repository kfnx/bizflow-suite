import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { machineModel } from '@/lib/db/schema';

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
      conditions.push(like(machineModel.name, `%${search}%`));
    }

    // Build order by clause
    let orderByClause = desc(machineModel.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(machineModel.name);
          break;
        case 'name-desc':
          orderByClause = desc(machineModel.name);
          break;
        case 'created-asc':
          orderByClause = asc(machineModel.createdAt);
          break;
        case 'created-desc':
          orderByClause = desc(machineModel.createdAt);
          break;
        default:
          orderByClause = desc(machineModel.createdAt);
      }
    }

    // Fetch machine model
    const machineModelsData = await db
      .select({
        id: machineModel.id,
        name: machineModel.name,
      })
      .from(machineModel)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: machineModel.id })
      .from(machineModel)
      .where(conditions.length > 0 ? or(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: machineModelsData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching machine model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch machine model' },
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
        { error: 'Machine model name is required' },
        { status: 400 },
      );
    }

    if (name.trim().length > 36) {
      return NextResponse.json(
        { error: 'Machine model name must be 36 characters or less' },
        { status: 400 },
      );
    }

    // Check if machine model with same name already exists
    const existingMachineModel = await db
      .select({ id: machineModel.id, name: machineModel.name })
      .from(machineModel)
      .where(like(machineModel.name, name.trim()))
      .limit(1);

    if (existingMachineModel.length > 0) {
      return NextResponse.json(
        {
          error: 'Machine model with this name already exists',
          details: `A machine model named "${existingMachineModel[0].name}" already exists`,
        },
        { status: 409 },
      );
    }

    // Create machine model with slugified ID
    const machineModelId = createSlug(name.trim());
    const newMachineModel = {
      id: machineModelId,
      name: name.trim(),
    };

    await db.insert(machineModel).values(newMachineModel);

    return NextResponse.json(
      {
        message: 'Machine model created successfully',
        data: newMachineModel,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating machine model:', error);
    return NextResponse.json(
      { error: 'Failed to create machine model' },
      { status: 500 },
    );
  }
}
