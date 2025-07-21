import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { branches, users } from '@/lib/db/schema';
import { canCreateRole } from '@/lib/permissions';
import { updateUserSchema } from '@/lib/validations/user';

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'users:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();

    const user = await db
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
        isAdmin: users.isAdmin,
        branchId: users.branchId,
        branchName: branches.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(branches, eq(users.branchId, branches.id))
      .where(eq(users.id, params.id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: user[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  }
}

// PUT /api/users/[id] - Update user (requires users:update permission)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'users:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();
    const body = await request.json();

    // Validate with Zod
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: parsed.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const validatedData = parsed.data;

    // Check if user can assign the specified role
    if (!canCreateRole(session.user.role, validatedData.role)) {
      return NextResponse.json(
        { error: 'You can only assign roles equal to or lower than your own' },
        { status: 403 },
      );
    }

    // Only admins can grant or revoke admin privileges
    if (validatedData.hasOwnProperty('isAdmin') && !session.user.isAdmin) {
      return NextResponse.json(
        {
          error: 'Only administrators can grant or revoke admin privileges',
        },
        { status: 403 },
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1);

    // Check if email already exists (if email is being updated)
    if (validatedData.email !== existingUser[0].email) {
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (emailExists.length > 0) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 },
        );
      }
    }

    // Check if NIK already exists (if NIK is being updated)
    if (validatedData.NIK !== existingUser[0].NIK) {
      const nikExists = await db
        .select()
        .from(users)
        .where(eq(users.NIK, validatedData.NIK))
        .limit(1);

      if (nikExists.length > 0) {
        return NextResponse.json(
          { error: 'User with this NIK already exists' },
          { status: 409 },
        );
      }
    }

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent users from updating their own role to a higher one
    if (validatedData.role && params.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 403 },
      );
    }

    // Prevent users from changing their own admin status
    if (
      validatedData.hasOwnProperty('isAdmin') &&
      params.id === session.user.id
    ) {
      return NextResponse.json(
        { error: 'You cannot change your own admin status' },
        { status: 403 },
      );
    }

    await db
      .update(users)
      .set({
        ...validatedData,
        joinDate: new Date(validatedData.joinDate),
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id));

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 },
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}
