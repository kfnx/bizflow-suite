'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Supplier = {
  id: string;
  code: string;
  name: string;
  country?: string;
  address?: string;
  transactionCurrency?: string;
  postalCode?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SuppliersResponse = {
  data: Supplier[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SuppliersFilters = {
  search?: string;
  country?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchSuppliers = async (
  filters?: SuppliersFilters,
): Promise<SuppliersResponse> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.country && filters.country !== 'all')
    params.append('country', filters.country);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/suppliers?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers');
  }
  return response.json();
};

const deleteSupplier = async (supplierId: string): Promise<void> => {
  const response = await fetch(`/api/suppliers/${supplierId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete supplier');
  }
};

export function useSuppliers(filters?: SuppliersFilters) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => fetchSuppliers(filters),
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}
