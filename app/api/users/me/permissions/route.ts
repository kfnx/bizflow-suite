import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from '@/lib/db/schema';

// GET /api/users/me/permissions - Get current user's permissions
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    // Get user's permissions through their roles
    const userPermissions = await db
      .select({
        permission: permissions.name,
        description: permissions.description,
        resources: permissions.resources,
        actions: permissions.actions,
      })
      .from(users)
      .innerJoin(userRoles, eq(users.id, userRoles.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(users.id, session.user.id));

    // Extract unique permission names
    const permissionNames = Array.from(
      new Set(userPermissions.map((p) => p.permission)),
    );

    return NextResponse.json({
      permissions: permissionNames,
      details: userPermissions,
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user permissions' },
      { status: 500 },
    );
  }
}
