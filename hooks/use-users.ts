'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CreateUserRequest, UpdateUserRequest } from '@/lib/validations/user';

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

  branchId?: string;
  branchName?: string;
  signature?: string;
  isActive: boolean;
  isAdmin: boolean;
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
  branch?: string;
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
  if (filters.branch) params.append('branch', filters.branch);
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

const fetchCurrentUser = async (): Promise<{ user: User }> => {
  const response = await fetch('/api/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
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
  const response = await fetch('/api/users/update-password', {
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

const createUser = async (userData: CreateUserRequest): Promise<void> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to create user');
  }
};

const updateUser = async (
  userId: string,
  userData: UpdateUserRequest,
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

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
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
      toast.success('Password reset successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users after successful creation
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
    },
    onError: (error: Error) => {
      console.error('User creation error:', error);
      toast.error(error.message || 'Failed to create user');
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
      toast.success('User updated successfully!');
    },
    onError: (error: Error) => {
      console.error('User update error:', error);
      toast.error(error.message || 'Failed to update user');
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
