'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
  getUserRoles,
  Permission,
} from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  const user = session?.user;

  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setUserRoles([]);
        setAvailableRoles([]);
        return;
      }

      try {
        // Load user roles
        const roles = await getUserRoles(user.id);
        setUserRoles(roles);

        // Load available roles for creation
        const available = await getAvailableRolesForCreation(user);
        setAvailableRoles(available);
      } catch (error) {
        console.error('Error loading user permissions data:', error);
        setUserRoles([]);
        setAvailableRoles([]);
      }
    }

    loadUserData();
  }, [user]);

  return {
    // Async permission checking functions
    can: async (permission: Permission) =>
      user ? await hasPermission(user, permission) : false,

    canAny: async (permissions: Permission[]) =>
      user ? await hasAnyPermission(user, permissions) : false,

    canAll: async (permissions: Permission[]) =>
      user ? await hasAllPermissions(user, permissions) : false,

    // Async role checking
    hasRole: async (role: string) =>
      user ? await hasRole(user, role) : false,

    // Sync data from state
    roles: userRoles,
    availableRoles,

    // Check if user is authenticated
    isAuthenticated: !!user,


  };
}
