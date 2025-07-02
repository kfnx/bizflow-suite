'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type PendingQuotationItem = {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
};

export type PendingQuotation = {
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
  status: 'sent';
  notes?: string;
  termsAndConditions?: string;
  createdBy: string;
  createdByUser: string;
  approverId: string;
  createdAt: string;
  updatedAt: string;
  items: PendingQuotationItem[];
};

export type PendingQuotationsResponse = {
  data: PendingQuotation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const fetchPendingQuotations = async (
  page: number = 1,
  limit: number = 10,
): Promise<PendingQuotationsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(`/api/quotations/pending?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pending quotations');
  }
  return response.json();
};

const approveQuotation = async (quotationId: string): Promise<any> => {
  const response = await fetch(`/api/quotations/${quotationId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to approve quotation');
  }

  return response.json();
};

const rejectQuotation = async (
  quotationId: string,
  reason: string,
): Promise<any> => {
  const response = await fetch(`/api/quotations/${quotationId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reject quotation');
  }

  return response.json();
};

export function usePendingQuotations(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['pending-quotations', page, limit],
    queryFn: () => fetchPendingQuotations(page, limit),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useApproveQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveQuotation,
    onSuccess: (data) => {
      toast.success('Quotation approved successfully');
      // Invalidate and refetch pending quotations
      queryClient.invalidateQueries({ queryKey: ['pending-quotations'] });
      // Also invalidate regular quotations to update the main list
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve quotation');
    },
  });
}

export function useRejectQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      reason,
    }: {
      quotationId: string;
      reason: string;
    }) => rejectQuotation(quotationId, reason),
    onSuccess: (data) => {
      toast.success('Quotation rejected successfully');
      // Invalidate and refetch pending quotations
      queryClient.invalidateQueries({ queryKey: ['pending-quotations'] });
      // Also invalidate regular quotations to update the main list
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject quotation');
    },
  });
}
