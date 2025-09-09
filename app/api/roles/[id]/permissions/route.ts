import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { rolePermissions, roles, permissions } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

const assignPermissionsSchema = z.object({
  permissionIds: z.array(z.string()),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: roleId } = await params;
    const body = await request.json();
    const { permissionIds } = assignPermissionsSchema.parse(body);

    // Verify role exists
    const role = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.id, roleId))
      .then(result => result[0]);

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Verify all permissions exist
    const existingPermissions = await db
      .select({ id: permissions.id })
      .from(permissions);
    
    const existingPermissionIds = existingPermissions.map(p => p.id);
    const invalidPermissionIds = permissionIds.filter(
      id => !existingPermissionIds.includes(id)
    );

    if (invalidPermissionIds.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid permission IDs',
          invalidIds: invalidPermissionIds,
        },
        { status: 400 }
      );
    }

    // Remove existing role permissions
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    // Add new role permissions
    if (permissionIds.length > 0) {
      const newRolePermissions = permissionIds.map(permissionId => ({
        roleId,
        permissionId,
      }));

      await db.insert(rolePermissions).values(newRolePermissions);
    }

    return NextResponse.json({
      message: 'Role permissions updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating role permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}