'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type DeliveryNote = {
  id: string;
  deliveryNumber: string;
  invoiceId?: string;
  customerId: string;
  branchId?: string;
  branchName?: string;
  deliveryDate: string;
  deliveryMethod?: string;
  driverName?: string;
  vehicleNumber?: string;
  status: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  customer?: {
    id: string;
    code: string;
    name: string;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    postalCode?: string;
    contactPersons?: Array<{
      id: string;
      prefix?: string;
      name: string;
      email?: string;
      phone?: string;
    }>;
  };
  invoice?: {
    id: string;
    invoiceNumber: string;
  };
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type DeliveryNoteDetail = DeliveryNote & {
  items: {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    product?: {
      id: string;
      name: string;
      code: string;
      category?: string;
      partNumber?: string;
      machineModel?: string;
      engineNumber?: string;
      serialNumber?: string;
      additionalSpecs?: string;
      machineTypeId?: string;
      unitOfMeasureId?: string;
    };
  }[];
};

export type DeliveryNotesResponse = {
  data: DeliveryNote[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DeliveryNotesFilters = {
  search?: string;
  status?: string;
  branch?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchDeliveryNotes = async (
  filters?: DeliveryNotesFilters,
): Promise<DeliveryNotesResponse> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.status && filters.status !== 'all')
    params.append('status', filters.status);
  if (filters?.branch) params.append('branch', filters.branch);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/delivery-notes?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch delivery notes');
  }
  return response.json();
};

const createDeliveryNote = async (data: any): Promise<{ id: string; deliveryNumber: string; message: string }> => {
  const response = await fetch('/api/delivery-notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create delivery note');
  }
  return response.json();
};

const updateDeliveryNote = async (
  deliveryNoteId: string,
  data: any,
): Promise<void> => {
  const response = await fetch(`/api/delivery-notes/${deliveryNoteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update delivery note');
  }
};

const fetchDeliveryNoteDetail = async (
  deliveryNoteId: string,
): Promise<DeliveryNoteDetail> => {
  const response = await fetch(`/api/delivery-notes/${deliveryNoteId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch delivery note details');
  }
  const data = await response.json();
  return data.data;
};

const deleteDeliveryNote = async (deliveryNoteId: string): Promise<void> => {
  const response = await fetch(`/api/delivery-notes/${deliveryNoteId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete delivery note');
  }
};

export function useDeliveryNotes(filters?: DeliveryNotesFilters) {
  return useQuery({
    queryKey: ['delivery-notes', filters],
    queryFn: () => fetchDeliveryNotes(filters),
  });
}

export function useDeliveryNoteDetail(deliveryNoteId: string) {
  return useQuery({
    queryKey: ['delivery-note', deliveryNoteId],
    queryFn: () => fetchDeliveryNoteDetail(deliveryNoteId),
    enabled: !!deliveryNoteId,
  });
}

export function useCreateDeliveryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeliveryNote,
    onSuccess: () => {
      // Invalidate all delivery notes queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
      // Also invalidate the delivery note number cache
      queryClient.invalidateQueries({ queryKey: ['delivery-note-number'] });
      console.log('Cache invalidated for delivery notes after creation');
    },
    onError: (error) => {
      console.error('Failed to create delivery note:', error);
    },
  });
}

export function useUpdateDeliveryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deliveryNoteId,
      data,
    }: {
      deliveryNoteId: string;
      data: any;
    }) => updateDeliveryNote(deliveryNoteId, data),
    onSuccess: (_, variables) => {
      // Invalidate delivery notes list
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
      // Invalidate specific delivery note detail
      queryClient.invalidateQueries({
        queryKey: ['delivery-note', variables.deliveryNoteId],
      });
      // Also invalidate all delivery note queries as fallback
      queryClient.invalidateQueries({ queryKey: ['delivery-note'] });
      console.log(
        'Cache invalidated for delivery note after update:',
        variables.deliveryNoteId,
      );
    },
    onError: (error) => {
      console.error('Failed to update delivery note:', error);
    },
  });
}

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
    },
  });
}

// Execute delivery note (change status from pending to delivered)
const executeDeliveryNote = async (deliveryNoteId: string): Promise<void> => {
  const response = await fetch(`/api/delivery-notes/${deliveryNoteId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to execute delivery note');
  }

  return response.json();
};

export function useExecuteDeliveryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeDeliveryNote,
    onSuccess: (_, deliveryNoteId) => {
      // Invalidate delivery notes list
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
      // Invalidate specific delivery note detail
      queryClient.invalidateQueries({
        queryKey: ['delivery-note', deliveryNoteId],
      });
      // Also invalidate all delivery note queries as fallback
      queryClient.invalidateQueries({ queryKey: ['delivery-note'] });
      // Invalidate products queries since warehouse stocks have been updated
      queryClient.invalidateQueries({ queryKey: ['products'] });
      console.log(
        'Cache invalidated for delivery note after execution:',
        deliveryNoteId,
      );
    },
    onError: (error) => {
      console.error('Failed to execute delivery note:', error);
    },
  });
}

// Cancel delivery note (change status from pending to cancelled)
const cancelDeliveryNote = async (deliveryNoteId: string): Promise<void> => {
  const response = await fetch(`/api/delivery-notes/${deliveryNoteId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to cancel delivery note');
  }

  return response.json();
};

export function useCancelDeliveryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelDeliveryNote,
    onSuccess: (_, deliveryNoteId) => {
      // Invalidate delivery notes list
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
      // Invalidate specific delivery note detail
      queryClient.invalidateQueries({
        queryKey: ['delivery-note', deliveryNoteId],
      });
      // Also invalidate all delivery note queries as fallback
      queryClient.invalidateQueries({ queryKey: ['delivery-note'] });
      console.log(
        'Cache invalidated for delivery note after cancellation:',
        deliveryNoteId,
      );
    },
    onError: (error) => {
      console.error('Failed to cancel delivery note:', error);
    },
  });
}
