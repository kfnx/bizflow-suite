import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { and, desc, eq, like, or } from 'drizzle-orm';

import { requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { DEFAULT_PASSWORD } from '@/lib/db/constants';
import { users } from '@/lib/db/schema';
import { canCreateRole } from '@/lib/permissions';
import { createUserSchema } from '@/lib/validations/user';

export const dynamic = 'force-dynamic';

// GET /api/users - Get all users (open to any authenticated user)
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const roles = searchParams.getAll('role'); // Get all role parameters
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'date-desc';
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.phone, `%${search}%`),
          like(users.code, `%${search}%`),
          like(users.NIK, `%${search}%`),
          like(users.jobTitle, `%${search}%`),
        ),
      );
    }

    // Role filter - handle multiple roles
    if (roles.length > 0 && !roles.includes('all')) {
      if (roles.length === 1) {
        conditions.push(eq(users.role, roles[0]));
      } else {
        conditions.push(or(...roles.map((role) => eq(users.role, role))));
      }
    }

    // Status filter
    if (status && status !== 'all') {
      const isActive = status === 'active';
      conditions.push(eq(users.isActive, isActive));
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by condition
    let orderBy;
    switch (sortBy) {
      case 'date-asc':
        orderBy = users.createdAt;
        break;
      case 'date-desc':
        orderBy = desc(users.createdAt);
        break;
      case 'name-asc':
        orderBy = users.firstName;
        break;
      case 'name-desc':
        orderBy = desc(users.firstName);
        break;
      case 'email-asc':
        orderBy = users.email;
        break;
      case 'email-desc':
        orderBy = desc(users.email);
        break;
      default:
        orderBy = desc(users.createdAt);
    }

    const allUsers = await db
      .select({
        id: users.id,
        code: users.code,
        firstName: users.firstName,
        lastName: users.lastName,
        NIK: users.NIK,
        email: users.email,
        jobTitle: users.jobTitle,
        joinDate: users.joinDate,
        type: users.type,
        phone: users.phone,
        avatar: users.avatar,
        role: users.role,
        signature: users.signature,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count with same filters
    const totalUsers = await db
      .select({ count: users.id })
      .from(users)
      .where(whereCondition);

    return NextResponse.json({
      users: allUsers,
      pagination: {
        page,
        limit,
        total: totalUsers.length,
        totalPages: Math.ceil(totalUsers.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

// POST /api/users - Create a new user (requires users:create permission)
export async function POST(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();
    const body = await request.json();

    // Validate with Zod
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }
    const validatedData = parsed.data;

    // Check if user can create the specified role
    if (!canCreateRole(session.user.role, validatedData.role)) {
      return NextResponse.json(
        {
          error:
            'You can only create users with roles equal to or lower than your own',
        },
        { status: 403 },
      );
    }

    // Check if user already exists (email)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 },
      );
    }

    // Check if NIK already exists
    const existingNIK = await db
      .select()
      .from(users)
      .where(eq(users.NIK, validatedData.NIK))
      .limit(1);

    if (existingNIK.length > 0) {
      return NextResponse.json(
        { error: 'User with this NIK already exists' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    // Generate user code (USR-XXXX format)
    const userCount = await db.select({ count: users.id }).from(users);
    const userCode = `USR-${(userCount.length + 1).toString().padStart(4, '0')}`;

    // Create user
    await db.insert(users).values({
      code: userCode,
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      NIK: validatedData.NIK,
      joinDate: new Date(validatedData.joinDate),
      phone: validatedData.phone,
      role: validatedData.role,
      jobTitle: validatedData.jobTitle,
      type: validatedData.type || 'full-time',
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 },
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
