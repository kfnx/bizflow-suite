'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import {
  getUserRoles,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
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

        // TODO: Load available roles for creation once database is available
        setAvailableRoles([]);
      } catch (error) {
        console.error('Error loading user permissions data:', error);
        setUserRoles([]);
        setAvailableRoles([]);
      }
    }

    loadUserData();
  }, [user]);

  return {
    // TODO: Re-implement async permission checking functions once permissions are available in session
    can: async (_permission: Permission) => user?.isAdmin || false,

    canAny: async (_permissions: Permission[]) => user?.isAdmin || false,

    canAll: async (_permissions: Permission[]) => user?.isAdmin || false,

    // TODO: Re-implement async role checking
    hasRole: async (_role: string) => user?.isAdmin || false,

    // Sync data from state
    roles: userRoles,
    availableRoles,

    // Check if user is authenticated
    isAuthenticated: !!user,
  };
}
