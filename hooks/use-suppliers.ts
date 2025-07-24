'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Supplier } from '@/lib/db/schema';

export type SupplierWithContactPersons = Supplier & {
  contactPersons: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
  }>;
};

export type SuppliersResponse = {
  data: SupplierWithContactPersons[];
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

  // Include inactive suppliers in table view
  params.append('includeInactive', 'true');

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

const fetchSupplierDetail = async (
  supplierId: string,
): Promise<SupplierWithContactPersons> => {
  const response = await fetch(`/api/suppliers/${supplierId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch supplier details');
  }
  return response.json();
};

export function useSupplierDetail(supplierId: string) {
  return useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => fetchSupplierDetail(supplierId),
    enabled: !!supplierId,
  });
}

const updateSupplier = async (
  supplierId: string,
  supplierData: any,
): Promise<void> => {
  const response = await fetch(`/api/suppliers/${supplierId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplierData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update supplier');
  }
};

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      supplierId,
      supplierData,
    }: {
      supplierId: string;
      supplierData: any;
    }) => updateSupplier(supplierId, supplierData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier'] });
    },
  });
}
