'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type QuotationStatus } from '@/lib/db/schema';
import { UpdateQuotationRequest } from '@/lib/validations/quotation';

export type Quotation = {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: QuotationStatus;
  notes?: string;
  createdBy: string;
  createdByUser: string;
  createdAt: string;
  updatedAt: string;
};

export type QuotationsResponse = {
  data: Quotation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type QuotationsFilters = {
  search?: string;
  status?: string;
  customerId?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchQuotations = async (
  filters: QuotationsFilters = {},
): Promise<QuotationsResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'all')
    params.append('status', filters.status);
  if (filters.customerId) params.append('customerId', filters.customerId);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/quotations?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quotations');
  }
  return response.json();
};

const deleteQuotation = async (quotationId: string): Promise<void> => {
  const response = await fetch(`/api/quotations/${quotationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete quotation');
  }
};

const updateQuotation = async (quotationId: string, data: UpdateQuotationRequest): Promise<any> => {
  const response = await fetch(`/api/quotations/${quotationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update quotation');
  }

  return response.json();
};

export function useQuotations(filters: QuotationsFilters = {}) {
  return useQuery({
    queryKey: ['quotations', filters],
    queryFn: () => fetchQuotations(filters),
  });
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuotation,
    onSuccess: () => {
      // Invalidate and refetch quotations after successful deletion
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotationId, data }: { quotationId: string; data: UpdateQuotationRequest }) => 
      updateQuotation(quotationId, data),
    onSuccess: () => {
      // Invalidate and refetch quotations after successful update
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}
