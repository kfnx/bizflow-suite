'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type User = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  NIK: string;
  email: string;
  jobTitle?: string;
  joinDate: string;
  type: string;
  phone?: string;
  avatar?: string;
  role: string;
  signature?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

const fetchUser = async (userId: string): Promise<{ user: User }> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

const resetUserPassword = async (userId: string): Promise<void> => {
  const response = await fetch(`/api/users/${userId}/reset-password`, {
    method: 'POST',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to reset password');
  }
};

const updatePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  const response = await fetch('/api/update-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update password');
  }
};

const updateUser = async (
  userId: string,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    NIK: string;
    jobTitle?: string;
    joinDate: string;
    type?: 'full-time' | 'contract' | 'resigned';
    role: 'staff' | 'manager' | 'director';
    isActive?: boolean;
  },
): Promise<void> => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update user');
  }
};

export function useUsers(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
}

export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetUserPassword,
    onSuccess: () => {
      // Invalidate and refetch users after successful password reset
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
    onError: (error) => {
      console.error('Password update error:', error);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Parameters<typeof updateUser>[1];
    }) => updateUser(userId, userData),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch users after successful update
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
    onError: (error) => {
      console.error('User update error:', error);
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
