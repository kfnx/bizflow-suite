import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requirePermission } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { canCreateRole } from '@/lib/permissions';

// Validation schemas
const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.enum(['staff', 'manager', 'director']).optional(),
});

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
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
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
    const validatedData = updateUserSchema.parse(body);

    // If role is being updated, check if user can assign that role
    if (
      validatedData.role &&
      !canCreateRole(session.user.role, validatedData.role)
    ) {
      return NextResponse.json(
        { error: 'You can only assign roles equal to or lower than your own' },
        { status: 403 },
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1);

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

    await db.update(users).set(validatedData).where(eq(users.id, params.id));

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
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

// DELETE /api/users/[id] - Delete user (requires users:delete permission)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'users:delete');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent users from deleting themselves
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 403 },
      );
    }

    // Check if user can delete the target user based on role hierarchy
    const targetUser = existingUser[0];
    if (!canCreateRole(session.user.role, targetUser.role)) {
      return NextResponse.json(
        {
          error:
            'You can only delete users with roles equal to or lower than your own',
        },
        { status: 403 },
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, params.id));

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    );
  }
}
