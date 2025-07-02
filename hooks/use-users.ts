'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export type UsersResponse = {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UsersFilters = {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchUsers = async (
  filters: UsersFilters = {},
): Promise<UsersResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/users?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const deleteUser = async (userId: string): Promise<void> => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete user');
  }
};

export function useUsers(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch users after successful deletion
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Hook to fetch users with manager or director roles for approver selection
export function useApprovers() {
  return useQuery({
    queryKey: ['approvers'],
    queryFn: async (): Promise<User[]> => {
      const params = new URLSearchParams();
      params.append('role', 'manager');
      params.append('role', 'director');
      params.append('limit', '100');

      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch approvers');
      }
      const data = await response.json();
      return data.users || [];
    },
  });
}
