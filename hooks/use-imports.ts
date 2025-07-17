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
  exchangeRateRMBtoIDR: number;
  total: number;
  status: string;
  notes?: string;
  createdBy: string;
  createdByUser: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: ImportItem[];
};

export type ImportItem = {
  id?: string;
  productId?: string; // nullable - only set if updating existing product

  // Pricing & Quantity
  priceRMB: string;
  quantity: number;
  notes?: string;

  // Product Creation Data - Core fields
  category: 'serialized' | 'non_serialized' | 'bulk';
  name: string;
  description?: string;
  brandId?: string;
  brand?: string; // for display purposes
  condition: 'new' | 'used' | 'refurbished';
  year?: number;

  // Category-specific fields
  machineTypeId?: string; // for serialized
  unitOfMeasureId?: string; // for non-serialized/bulk
  modelOrPartNumber?: string;
  machineNumber?: string;
  engineNumber?: string;
  serialNumber?: string;
  model?: string;
  engineModel?: string;
  enginePower?: string;
  operatingWeight?: string;
  batchOrLotNumber?: string;
  modelNumber?: string;
};

export type CreateImportData = {
  supplierId: string;
  warehouseId: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  exchangeRateRMBtoIDR: string;
  notes: string;
  items: ImportItem[];
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
  const result = await response.json();
  return result.data; // Extract data from the response
};

const createImport = async (data: CreateImportData): Promise<Import> => {
  const response = await fetch('/api/imports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create import');
  }

  return response.json();
};

const updateImport = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}): Promise<Import> => {
  const response = await fetch(`/api/imports/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update import');
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

export type PendingImport = {
  id: string;
  supplierName: string;
  supplierCode: string;
  warehouseName: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  exchangeRateRMBtoIDR: number;
  itemCount: number;
  totalRMB: number;
  totalIDR: number;
  notes?: string;
  createdAt: string;
};

const fetchPendingImports = async (): Promise<PendingImport[]> => {
  const response = await fetch('/api/imports/pending');
  if (!response.ok) {
    throw new Error('Failed to fetch pending imports');
  }
  const result = await response.json();
  return result.data;
};

const verifyImport = async (importId: string): Promise<Import> => {
  const response = await fetch(`/api/imports/${importId}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to verify import');
  }

  const result = await response.json();
  return result.data;
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

export function useCreateImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createImport,
    onSuccess: () => {
      // Invalidate and refetch imports after successful creation
      queryClient.invalidateQueries({ queryKey: ['imports'] });
    },
  });
}

export function useUpdateImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateImport,
    onSuccess: (data, variables) => {
      // Invalidate and refetch imports after successful update
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      // Update the specific import cache
      queryClient.invalidateQueries({ queryKey: ['import', variables.id] });
    },
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

export function usePendingImports() {
  return useQuery({
    queryKey: ['imports', 'pending'],
    queryFn: fetchPendingImports,
  });
}

export function useVerifyImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyImport,
    onSuccess: () => {
      // Invalidate and refetch imports after successful verification
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      queryClient.invalidateQueries({ queryKey: ['imports', 'pending'] });
    },
  });
}
