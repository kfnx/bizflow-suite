import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { users, userRoles, rolePermissions, permissions, roles } from '@/lib/db/schema';

export type Permission = string;

// Get all permissions for a user
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const userPermissions = await db
      .select({
        permission: permissions.name,
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    return userPermissions.map(p => p.permission);
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

// Get all roles for a user
export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const userRolesList = await db
      .select({
        roleName: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return userRolesList.map(r => r.roleName);
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
}

// Check if user has a specific permission
export async function hasPermission(
  userId: string,
  permission: Permission,
  isAdmin: boolean = false,
): Promise<boolean> {
  // Admins have all permissions
  if (isAdmin) {
    return true;
  }

  try {
    const userPermissions = await getUserPermissions(userId);
    return userPermissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

// Check if user has any of the specified permissions
export async function hasAnyPermission(
  userId: string,
  permissions: Permission[],
  isAdmin: boolean = false,
): Promise<boolean> {
  // Admins have all permissions
  if (isAdmin) {
    return true;
  }

  try {
    const userPermissions = await getUserPermissions(userId);
    return permissions.some(permission => userPermissions.includes(permission));
  } catch (error) {
    console.error('Error checking any permission:', error);
    return false;
  }
}

// Check if user has all of the specified permissions
export async function hasAllPermissions(
  userId: string,
  permissions: Permission[],
  isAdmin: boolean = false,
): Promise<boolean> {
  // Admins have all permissions
  if (isAdmin) {
    return true;
  }

  try {
    const userPermissions = await getUserPermissions(userId);
    return permissions.every(permission => userPermissions.includes(permission));
  } catch (error) {
    console.error('Error checking all permissions:', error);
    return false;
  }
}

// Check if user has a specific role
export async function hasRole(
  userId: string,
  roleName: string,
  isAdmin: boolean = false,
): Promise<boolean> {
  // Admins have all roles
  if (isAdmin) {
    return true;
  }

  try {
    const userRolesList = await getUserRoles(userId);
    return userRolesList.includes(roleName);
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
}

// Check if user has any of the specified roles
export async function hasAnyRole(
  userId: string,
  roleNames: string[],
  isAdmin: boolean = false,
): Promise<boolean> {
  // Admins have all roles
  if (isAdmin) {
    return true;
  }

  try {
    const userRolesList = await getUserRoles(userId);
    return roleNames.some(roleName => userRolesList.includes(roleName));
  } catch (error) {
    console.error('Error checking any role:', error);
    return false;
  }
}