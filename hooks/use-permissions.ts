'use client';

import { useSession } from 'next-auth/react';

import {
  canCreateRole,
  getAvailableRolesForCreation,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  Permission,
} from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();

  const user = session?.user;
  const userRole = user?.role || 'guest';

  return {
    // Check single permission
    can: (permission: Permission) =>
      user ? hasPermission(user, permission) : false,

    // Check if user has any of the permissions
    canAny: (permissions: Permission[]) =>
      user ? hasAnyPermission(user, permissions) : false,

    // Check if user has all permissions
    canAll: (permissions: Permission[]) =>
      user ? hasAllPermissions(user, permissions) : false,

    // Check role
    hasRole: (role: string) => userRole === role,

    // Get user role
    role: userRole,

    // Check if user is authenticated
    isAuthenticated: !!user,

    // Check if user can create a specific role
    canCreateRole: (targetRole: string) =>
      user ? canCreateRole(user, targetRole) : false,

    // Get available roles for creation
    getAvailableRolesForCreation: () =>
      getAvailableRolesForCreation(userRole, !!user?.isAdmin),
  };
}
