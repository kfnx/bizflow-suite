import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { roles, rolePermissions, permissions, userRoles } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
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

    const { id } = await params;

    const role = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
        updatedAt: roles.updatedAt,
      })
      .from(roles)
      .where(eq(roles.id, id))
      .then(result => result[0]);

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Get role permissions
    const rolePerms = await db
      .select({
        permissionId: permissions.id,
        permissionName: permissions.name,
        permissionDescription: permissions.description,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, id));

    return NextResponse.json({
      ...role,
      permissions: rolePerms,
    });
  } catch (error) {
    console.error('Error fetching role:', error);
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

    const { id } = await params;
    const body = await request.json();
    const validatedData = roleSchema.parse(body);

    const existingRole = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.id, id))
      .then(result => result[0]);

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    await db
      .update(roles)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(roles.id, id));

    return NextResponse.json({ message: 'Role updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const existingRole = await db
      .select({ id: roles.id, name: roles.name })
      .from(roles)
      .where(eq(roles.id, id))
      .then(result => result[0]);

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check if any users are assigned to this role
    const assignedUsers = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userRoles)
      .where(eq(userRoles.roleId, id))
      .then(result => result[0]?.count || 0);

    if (assignedUsers > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete role',
          message: `Cannot delete role "${existingRole.name}" because it is assigned to ${assignedUsers} user${assignedUsers === 1 ? '' : 's'}. Please reassign or remove these users from the role first.`,
          assignedUsers,
        },
        { status: 400 }
      );
    }

    // Delete role permissions first
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));

    // Delete the role
    await db.delete(roles).where(eq(roles.id, id));

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}