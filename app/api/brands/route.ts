import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { brands } from '@/lib/db/schema';

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
      conditions.push(like(brands.name, `%${search}%`));
    }

    // Build order by clause
    let orderByClause = asc(brands.name); // Default alphabetical order
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(brands.name);
          break;
        case 'name-desc':
          orderByClause = desc(brands.name);
          break;
        default:
          orderByClause = asc(brands.name);
      }
    }

    // Fetch brands
    const brandsData = await db
      .select({
        id: brands.id,
        name: brands.name,
      })
      .from(brands)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: brands.id })
      .from(brands)
      .where(conditions.length > 0 ? or(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: brandsData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
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
        { error: 'Brand name is required' },
        { status: 400 },
      );
    }

    // Create brand
    const newBrand = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };

    await db.insert(brands).values(newBrand);

    return NextResponse.json(
      {
        message: 'Brand created successfully',
        data: newBrand,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 },
    );
  }
}
