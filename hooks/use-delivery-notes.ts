'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type DeliveryNote = {
  id: string;
  deliveryNumber: string;
  invoiceId?: string;
  customerId: string;
  deliveryDate: string;
  deliveryMethod?: string;
  driverName?: string;
  vehicleNumber?: string;
  status: string;
  deliveredBy?: string;
  receivedBy?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  customer?: {
    id: string;
    code: string;
    name: string;
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
  deliveredByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  receivedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
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
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/delivery-notes?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch delivery notes');
  }
  return response.json();
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

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeliveryNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-notes'] });
    },
  });
}
