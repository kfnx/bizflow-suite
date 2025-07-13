'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WarehousesResponse {
  data: Warehouse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface WarehousesFilters {
  search?: string;
  isActive?: 'all' | 'true' | 'false';
  sortBy?: string;
  page?: number;
  limit?: number;
}

const buildQueryParams = (filters: WarehousesFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all'
    ) {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

export const useWarehouses = (filters: WarehousesFilters = {}) => {
  const queryParams = buildQueryParams(filters);

  return useQuery<WarehousesResponse>({
    queryKey: ['warehouses', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/warehouses?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch warehouses');
      }
      return response.json();
    },
  });
};

export const useWarehouse = (id: string | null) => {
  return useQuery<Warehouse>({
    queryKey: ['warehouse', id],
    queryFn: async () => {
      if (!id) throw new Error('Warehouse ID is required');
      const response = await fetch(`/api/warehouses/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch warehouse');
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Warehouse>) => {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create warehouse');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Warehouse>;
    }) => {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update warehouse');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', id] });
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete warehouse');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};
