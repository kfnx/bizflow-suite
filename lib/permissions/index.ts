import { eq, sql } from 'drizzle-orm';
import { User } from 'next-auth';

import { db } from '@/lib/db';
import { permissions, rolePermissions, roles, userRoles } from '@/lib/db/schema';

// Define permission types
export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'branches:read'
  | 'branches:create'
  | 'branches:update'
  | 'branches:delete'
  | 'quotations:read'
  | 'quotations:create'
  | 'quotations:update'
  | 'quotations:delete'
  | 'quotations:approve'
  | 'invoices:read'
  | 'invoices:create'
  | 'invoices:update'
  | 'invoices:delete'
  | 'deliveries:read'
  | 'deliveries:create'
  | 'deliveries:update'
  | 'deliveries:delete'
  | 'imports:read'
  | 'imports:create'
  | 'imports:update'
  | 'imports:delete'
  | 'imports:verify'
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'suppliers:read'
  | 'suppliers:create'
  | 'suppliers:update'
  | 'suppliers:delete'
  | 'customers:read'
  | 'customers:create'
  | 'customers:update'
  | 'customers:delete'
  | 'warehouses:read'
  | 'warehouses:create'
  | 'warehouses:update'
  | 'warehouses:delete'
  | 'transfers:read'
  | 'transfers:create'
  | 'transfers:update'
  | 'transfers:delete';

// Function to get permissions for a role from the database
export async function getRolePermissions(
  roleId: string,
): Promise<Permission[]> {
  const perms = await db
    .select({
      permissions: permissions.name,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(eq(rolePermissions.roleId, roleId));

  return perms.map((p) => p.permissions as Permission);
}
// Get role details from database
export async function getRoleDetails(roleId: string) {
  return await db.query.roles.findFirst({
    where: eq(roles.id, roleId),
  });
}

// Permission checking utilities
export async function hasPermission(user: User, permission: Permission): Promise<boolean> {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  // Get user's permissions from database through roles
  const userPermissions = await getUserPermissions(user.id);
  return userPermissions.includes(permission);
}

export async function hasAnyPermission(
  user: User,
  permissions: Permission[],
): Promise<boolean> {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  const userPermissions = await getUserPermissions(user.id);
  return permissions.some((permission) => userPermissions.includes(permission));
}

export async function hasAllPermissions(
  user: User,
  permissions: Permission[],
): Promise<boolean> {
  const isAdmin = user.isAdmin;
  if (isAdmin) return true;

  const userPermissions = await getUserPermissions(user.id);
  return permissions.every((permission) => userPermissions.includes(permission));
}

// Get all permissions for a user through their roles
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const userPerms = await db
    .select({
      permission: permissions.name,
    })
    .from(permissions)
    .innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))
    .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
    .innerJoin(userRoles, eq(roles.id, userRoles.roleId))
    .where(eq(userRoles.userId, userId));

  return Array.from(new Set(userPerms.map((p) => p.permission as Permission)));
}

// Get user's roles from database
export async function getUserRoles(userId: string): Promise<string[]> {
  const userRoleData = await db
    .select({
      roleName: roles.name,
    })
    .from(roles)
    .innerJoin(userRoles, eq(roles.id, userRoles.roleId))
    .where(eq(userRoles.userId, userId));

  return userRoleData.map((r) => r.roleName);
}

// Check if user has a specific role
export async function hasRole(user: User, roleName: string): Promise<boolean> {
  if (user.isAdmin) return true;
  
  const userRoleNames = await getUserRoles(user.id);
  return userRoleNames.includes(roleName);
}

// Check if user has any of the specified roles
export async function hasAnyRole(user: User, roleNames: string[]): Promise<boolean> {
  if (user.isAdmin) return true;
  
  const userRoleNames = await getUserRoles(user.id);
  return roleNames.some(roleName => userRoleNames.includes(roleName));
}
