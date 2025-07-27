'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateBranchData,
  UpdateBranchData,
} from '@/lib/validations/branch';

export type Branch = {
  id: string;
  name: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
  createdAt: string;
};

export type BranchesFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
};

export type BranchesResponse = {
  data: Branch[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type BranchResponse = {
  branch: Branch;
};

const fetchBranches = async (
  filters: BranchesFilters = {},
): Promise<BranchesResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  const response = await fetch(`/api/branches?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch branches');
  }
  return response.json();
};

const fetchBranch = async (id: string): Promise<BranchResponse> => {
  const response = await fetch(`/api/branches/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch branch');
  }
  return response.json();
};

const createBranch = async (
  data: CreateBranchData,
): Promise<{ message: string; id: string }> => {
  const response = await fetch('/api/branches', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create branch');
  }

  return response.json();
};

const updateBranch = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateBranchData;
}): Promise<{ message: string }> => {
  const response = await fetch(`/api/branches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update branch');
  }

  return response.json();
};

const deleteBranch = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`/api/branches/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete branch');
  }

  return response.json();
};

export function useBranches(filters: BranchesFilters = {}) {
  return useQuery({
    queryKey: ['branches', filters],
    queryFn: () => fetchBranches(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => fetchBranch(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBranch,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', variables.id] });
      toast.success('Branch updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update branch');
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete branch');
    },
  });
}
