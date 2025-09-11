import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleFilters {
  search?: string;
  page?: number;
  limit?: number;
}

interface RolesResponse {
  data: Role[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchRoles(filters: RoleFilters = {}): Promise<RolesResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/roles?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  return response.json();
}

async function fetchRole(roleId: string): Promise<Role> {
  const response = await fetch(`/api/roles/${roleId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch role');
  }
  return response.json();
}

async function assignRolesToUser(userId: string, roleIds: string[]) {
  const response = await fetch(`/api/users/${userId}/roles`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roleIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to assign roles to user');
  }
  return response.json();
}

export function useRoles(filters: RoleFilters = {}) {
  return useQuery({
    queryKey: ['roles', filters],
    queryFn: () => fetchRoles(filters),
  });
}

export function useRole(roleId: string) {
  return useQuery({
    queryKey: ['role', roleId],
    queryFn: () => fetchRole(roleId),
    enabled: !!roleId,
  });
}

export function useAssignRolesToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      assignRolesToUser(userId, roleIds),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}