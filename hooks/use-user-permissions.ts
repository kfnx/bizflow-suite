'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

import { Permission } from '@/lib/permissions/client';

// Placeholder hook for user permissions
// This will be implemented once the backend provides user permissions in the session or via API
export function useUserPermissions() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['user-permissions', session?.user?.id],
    queryFn: async (): Promise<Permission[]> => {
      if (!session?.user?.id) return [];

      try {
        const response = await fetch('/api/users/me/permissions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.permissions as Permission[];
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        return [];
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}