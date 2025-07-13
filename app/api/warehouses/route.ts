import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { users, warehouses } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'warehouses:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = request.nextUrl;

    // Parse query parameters
    const search = searchParams.get('search') || undefined;
    const isActive = searchParams.get('isActive') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (isActive && isActive !== 'all') {
      conditions.push(eq(warehouses.isActive, isActive === 'true'));
    }

    if (search) {
      conditions.push(
        or(
          like(warehouses.name, `%${search}%`),
          like(warehouses.address, `%${search}%`),
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(warehouses.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(warehouses.name);
          break;
        case 'name-desc':
          orderByClause = desc(warehouses.name);
          break;
        case 'manager-asc':
          orderByClause = asc(users.firstName);
          break;
        case 'manager-desc':
          orderByClause = desc(users.firstName);
          break;
        default:
          orderByClause = desc(warehouses.createdAt);
      }
    }

    // Fetch warehouses with manager data
    const warehousesData = await db
      .select({
        id: warehouses.id,
        name: warehouses.name,
        address: warehouses.address,
        managerId: warehouses.managerId,
        managerName: users.firstName,
        managerLastName: users.lastName,
        isActive: warehouses.isActive,
        createdAt: warehouses.createdAt,
        updatedAt: warehouses.updatedAt,
      })
      .from(warehouses)
      .leftJoin(users, eq(warehouses.managerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: warehouses.id })
      .from(warehouses)
      .leftJoin(users, eq(warehouses.managerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: warehousesData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouses' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'warehouses:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const { name, address, managerId } = body;

    // Basic validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Warehouse name is required' },
        { status: 400 },
      );
    }

    // Create warehouse
    const newWarehouse = {
      name: name.trim(),
      address: address?.trim() || null,
      managerId: managerId || null,
      isActive: true,
    };

    await db.insert(warehouses).values(newWarehouse);

    // Get the created warehouse with manager data
    const createdWarehouse = await db
      .select({
        id: warehouses.id,
        name: warehouses.name,
        address: warehouses.address,
        managerId: warehouses.managerId,
        managerName: users.firstName,
        managerLastName: users.lastName,
        isActive: warehouses.isActive,
        createdAt: warehouses.createdAt,
        updatedAt: warehouses.updatedAt,
      })
      .from(warehouses)
      .leftJoin(users, eq(warehouses.managerId, users.id))
      .where(eq(warehouses.name, name.trim()))
      .orderBy(desc(warehouses.createdAt))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Warehouse created successfully',
        data: createdWarehouse[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to create warehouse' },
      { status: 500 },
    );
  }
}
