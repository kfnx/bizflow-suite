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

  const userRole = session?.user?.role || 'guest';

  return {
    // Check single permission
    can: (permission: Permission) => hasPermission(userRole, permission),

    // Check if user has any of the permissions
    canAny: (permissions: Permission[]) =>
      hasAnyPermission(userRole, permissions),

    // Check if user has all permissions
    canAll: (permissions: Permission[]) =>
      hasAllPermissions(userRole, permissions),

    // Check role
    hasRole: (role: string) => userRole === role,

    // Get user role
    role: userRole,

    // Check if user is authenticated
    isAuthenticated: !!session?.user,

    // Check if user can create a specific role
    canCreateRole: (targetRole: string) => canCreateRole(userRole, targetRole),

    // Get available roles for creation
    getAvailableRolesForCreation: () => getAvailableRolesForCreation(userRole),
  };
}
