import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, like, or } from 'drizzle-orm';

import { getDB } from '@/lib/db';
import { users } from '@/lib/db/schema';

// GET /api/users/approvers - Get all approvers (manager and director roles)
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'active'; // Default to active only
    const sortBy = searchParams.get('sortBy') || 'name-asc';

    // Build where conditions
    const conditions = [];

    // Only get manager and director roles
    conditions.push(or(eq(users.role, 'manager'), eq(users.role, 'director')));

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.phone, `%${search}%`),
        ),
      );
    }

    // Status filter - default to active only
    if (status === 'active') {
      conditions.push(eq(users.isActive, true));
    } else if (status === 'inactive') {
      conditions.push(eq(users.isActive, false));
    }
    // If status is 'all', don't add any status filter

    const whereCondition = and(...conditions);

    // Build order by condition
    let orderBy;
    switch (sortBy) {
      case 'name-asc':
        orderBy = users.firstName;
        break;
      case 'name-desc':
        orderBy = desc(users.firstName);
        break;
      case 'role-asc':
        orderBy = users.role;
        break;
      case 'role-desc':
        orderBy = desc(users.role);
        break;
      case 'date-asc':
        orderBy = users.createdAt;
        break;
      case 'date-desc':
        orderBy = desc(users.createdAt);
        break;
      default:
        orderBy = users.firstName;
    }

    const approvers = await db
      .select({
        id: users.id,
        code: users.code,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        avatar: users.avatar,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereCondition)
      .orderBy(orderBy);

    return NextResponse.json({
      approvers,
      total: approvers.length,
    });
  } catch (error) {
    console.error('Error fetching approvers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approvers' },
      { status: 500 },
    );
  }
}
