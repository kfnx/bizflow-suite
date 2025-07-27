'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface TransferItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  quantityTransferred?: number;
  notes?: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  warehouseIdFrom?: string;
  warehouseFromName?: string;
  warehouseIdTo: string;
  warehouseToName: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  status: string;
  transferDate: string;
  invoiceId?: string;
  deliveryId?: string;
  notes?: string;
  createdBy: string;
  createdByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  // For V2 transfers with multiple products
  items?: TransferItem[];
  itemCount?: number;
  totalQuantity?: number;
  // Legacy fields for backward compatibility with single-product transfers
  productId?: string;
  name?: string;
  productCode?: string;
  quantity?: number;
}

interface TransfersResponse {
  data: Transfer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TransfersFilters {
  search?: string;
  movementType?: 'all' | 'in' | 'out' | 'transfer' | 'adjustment';
  warehouseFrom?: string;
  warehouseTo?: string;
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

const buildQueryParams = (filters: TransfersFilters) => {
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

export const useTransfers = (filters: TransfersFilters = {}) => {
  const queryParams = buildQueryParams(filters);

  return useQuery<TransfersResponse>({
    queryKey: ['transfers', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/transfers?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transfers');
      }
      return response.json();
    },
  });
};

export const useTransfer = (id: string | null) => {
  return useQuery<Transfer>({
    queryKey: ['transfer', id],
    queryFn: async () => {
      if (!id) throw new Error('Transfer ID is required');
      const response = await fetch(`/api/transfers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transfer');
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Transfer>) => {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create transfer');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
};

export interface UpdateTransferData {
  transferNumber?: string;
  warehouseIdFrom?: string;
  warehouseIdTo?: string;
  movementType?: 'in' | 'out' | 'transfer' | 'adjustment';
  status?: string;
  transferDate?: string;
  invoiceId?: string;
  deliveryId?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
  items?: {
    productId: string;
    quantity: number;
    quantityTransferred?: number;
    notes?: string;
  }[];
}

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTransferData;
    }) => {
      const response = await fetch(`/api/transfers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update transfer');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['transfer', id] });
    },
  });
};

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transfers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete transfer');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
};
