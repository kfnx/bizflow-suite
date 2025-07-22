import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, like } from 'drizzle-orm';

import { requireAuth, requirePermission } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { branches } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

// GET /api/branches - Get all branches
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name-asc';
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(like(branches.name, `%${search}%`));
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by condition
    let orderBy;
    switch (sortBy) {
      case 'name-asc':
        orderBy = branches.name;
        break;
      case 'name-desc':
        orderBy = desc(branches.name);
        break;
      default:
        orderBy = branches.name;
    }

    const branchesData = await db
      .select({
        id: branches.id,
        name: branches.name,
      })
      .from(branches)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count with same filters
    const totalBranches = await db
      .select({ count: branches.id })
      .from(branches)
      .where(whereCondition);

    return NextResponse.json({
      data: branchesData,
      pagination: {
        page,
        limit,
        total: totalBranches.length,
        totalPages: Math.ceil(totalBranches.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 },
    );
  }
}

// POST /api/branches - Create a new branch (requires branches:create permission)
export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'branches:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();
    const body = await request.json();

    // Validate input
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Branch name is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    const name = body.name.trim();

    // Check if branch already exists
    const existingBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.name, name))
      .limit(1);

    if (existingBranch.length > 0) {
      return NextResponse.json(
        { error: 'Branch with this name already exists' },
        { status: 409 },
      );
    }

    // Create branch
    await db.insert(branches).values({
      name: name,
    });

    const createdBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.name, name))
      .limit(1);

    return NextResponse.json(
      { message: 'Branch created successfully', ...createdBranch[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 },
    );
  }
}
