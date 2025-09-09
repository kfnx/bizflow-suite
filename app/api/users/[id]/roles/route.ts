import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { userRoles, users, roles } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

const assignRolesSchema = z.object({
  roleIds: z.array(z.string()),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: userId } = await params;

    // Get user roles
    const userRoleData = await db
      .select({
        roleId: roles.id,
        roleName: roles.name,
        roleDescription: roles.description,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return NextResponse.json({ roles: userRoleData });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { roleIds } = assignRolesSchema.parse(body);

    // Verify user exists
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .then(result => result[0]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify all roles exist
    const existingRoles = await db
      .select({ id: roles.id })
      .from(roles);
    
    const existingRoleIds = existingRoles.map(r => r.id);
    const invalidRoleIds = roleIds.filter(
      id => !existingRoleIds.includes(id)
    );

    if (invalidRoleIds.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid role IDs',
          invalidIds: invalidRoleIds,
        },
        { status: 400 }
      );
    }

    // Remove existing user roles
    await db.delete(userRoles).where(eq(userRoles.userId, userId));

    // Add new user roles
    if (roleIds.length > 0) {
      const newUserRoles = roleIds.map(roleId => ({
        userId,
        roleId,
      }));

      await db.insert(userRoles).values(newUserRoles);
    }

    return NextResponse.json({
      message: 'User roles updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating user roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}