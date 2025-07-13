'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Import = {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  warehouseId: string;
  warehouseName: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  exchangeRateRMB: number;
  subtotal: number;
  total: number;
  status: string;
  notes?: string;
  createdBy: string;
  createdByUser: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ImportsResponse = {
  data: Import[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ImportsFilters = {
  search?: string;
  status?: string;
  supplierId?: string;
  warehouseId?: string;
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchImports = async (
  filters: ImportsFilters = {},
): Promise<ImportsResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'all')
    params.append('status', filters.status);
  if (filters.supplierId && filters.supplierId !== 'all')
    params.append('supplierId', filters.supplierId);
  if (filters.warehouseId && filters.warehouseId !== 'all')
    params.append('warehouseId', filters.warehouseId);
  if (filters.productId) params.append('productId', filters.productId);
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/imports?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch imports');
  }
  return response.json();
};

const fetchImport = async (importId: string): Promise<Import> => {
  const response = await fetch(`/api/imports/${importId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch import details');
  }
  return response.json();
};

const deleteImport = async (importId: string): Promise<void> => {
  const response = await fetch(`/api/imports/${importId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete import');
  }
};

export function useImports(filters: ImportsFilters = {}) {
  return useQuery({
    queryKey: ['imports', filters],
    queryFn: () => fetchImports(filters),
  });
}

export function useImport(importId: string | null) {
  return useQuery({
    queryKey: ['import', importId],
    queryFn: () => fetchImport(importId!),
    enabled: !!importId,
  });
}

export function useDeleteImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteImport,
    onSuccess: () => {
      // Invalidate and refetch imports after successful deletion
      queryClient.invalidateQueries({ queryKey: ['imports'] });
    },
  });
}
