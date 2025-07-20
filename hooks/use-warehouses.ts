'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type Warehouse = {
  id: string;
  name: string;
  address?: string;
  managerId?: string;
  managerFirstName?: string;
  managerLastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WarehousesResponse = {
  data: Warehouse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type WarehousesFilters = {
  search?: string;
  isActive?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type CreateWarehouseData = {
  name: string;
  address?: string;
  managerId?: string;
};

export type UpdateWarehouseData = {
  name: string;
  address?: string;
  managerId?: string;
  isActive: boolean;
};

const fetchWarehouses = async (
  filters: WarehousesFilters = {},
): Promise<WarehousesResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.isActive && filters.isActive !== 'all')
    params.append('isActive', filters.isActive);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/warehouses?${params.toString()}`);
  if (!response.ok) {
    let errorMessage = 'Failed to fetch warehouses';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

const fetchWarehouse = async (warehouseId: string): Promise<Warehouse> => {
  const response = await fetch(`/api/warehouses/${warehouseId}`);
  if (!response.ok) {
    let errorMessage = 'Failed to fetch warehouse';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status === 404) {
        errorMessage = 'Warehouse not found';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

const createWarehouse = async (
  data: CreateWarehouseData,
): Promise<Warehouse> => {
  const response = await fetch('/api/warehouses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create warehouse';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.data;
};

const updateWarehouse = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateWarehouseData;
}): Promise<void> => {
  const response = await fetch(`/api/warehouses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update warehouse';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status === 404) {
        errorMessage = 'Warehouse not found';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
};

const deleteWarehouse = async (warehouseId: string): Promise<void> => {
  const response = await fetch(`/api/warehouses/${warehouseId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let errorMessage = 'Failed to delete warehouse';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status === 404) {
        errorMessage = 'Warehouse not found';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
};

export function useWarehouses(filters: WarehousesFilters = {}) {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: () => fetchWarehouses(filters),
  });
}

export function useWarehouse(warehouseId: string | null) {
  return useQuery({
    queryKey: ['warehouse', warehouseId],
    queryFn: () => fetchWarehouse(warehouseId!),
    enabled: !!warehouseId,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success('Warehouse created successfully!', {
        description: 'The warehouse has been added to your system.',
      });
    },
    onError: (error) => {
      toast.error('Failed to create warehouse', {
        description: error.message,
      });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWarehouse,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', variables.id] });
      toast.success('Warehouse updated successfully!', {
        description: 'The warehouse changes have been saved.',
      });
    },
    onError: (error) => {
      toast.error('Failed to update warehouse', {
        description: error.message,
      });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success('Warehouse deactivated successfully!', {
        description: 'The warehouse has been set to inactive.',
      });
    },
    onError: (error) => {
      toast.error('Failed to deactivate warehouse', {
        description: error.message,
      });
    },
  });
}
