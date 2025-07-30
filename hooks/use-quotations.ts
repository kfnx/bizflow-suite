'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { UpdateQuotationRequest } from '@/lib/validations/quotation';

export type Quotation = {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  branchId?: string;
  branchName?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: QUOTATION_STATUS;
  notes?: string;
  createdBy: string;
  createdByUser: string;
  invoiceId?: string;
  invoicedAt?: string;
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

export type QuotationItem = {
  id: string;
  productId: string;
  productCode: string;
  name: string;
  quantity: string;
  unitPrice: string;
  total: string;
  notes?: string;
};

export type QuotationDetail = Omit<
  Quotation,
  'id' | 'subtotal' | 'tax' | 'total'
> & {
  id: string;
  approvedBy?: string;
  isIncludePPN: boolean;
  subtotal: string;
  tax: string;
  total: string;
  termsAndConditions?: string;
  customerResponseDate?: string;
  customerResponseNotes?: string;
  customerAcceptanceInfo?: string;
  rejectionReason?: string;
  revisionReason?: string;
  invoicedAt?: string;
  invoiceId?: string;
  items: QuotationItem[];
};

export type QuotationsFilters = {
  search?: string;
  status?: string;
  customerId?: string;
  branch?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  ready_for_invoice?: string;
};

const fetchQuotations = async (
  filters: QuotationsFilters = {},
): Promise<QuotationsResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'all')
    params.append('status', filters.status);
  if (filters.customerId) params.append('customerId', filters.customerId);
  if (filters.branch) params.append('branch', filters.branch);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/quotations?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quotations');
  }
  return response.json();
};

const fetchQuotationDetail = async (
  id: string,
): Promise<{ data: QuotationDetail }> => {
  const response = await fetch(`/api/quotations/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Quotation not found');
    }
    throw new Error('Failed to fetch quotation details');
  }
  return response.json();
};

const updateQuotation = async (
  quotationId: string,
  data: UpdateQuotationRequest,
): Promise<any> => {
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

const sendQuotation = async (quotationId: string): Promise<void> => {
  const response = await fetch(`/api/quotations/${quotationId}/send`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send quotation');
  }
};

const submitQuotation = async (quotationId: string): Promise<void> => {
  const response = await fetch(`/api/quotations/${quotationId}/submit`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit quotation');
  }
};

export function useQuotations(filters: QuotationsFilters = {}) {
  return useQuery({
    queryKey: ['quotations', filters],
    queryFn: () => fetchQuotations(filters),
  });
}

export function useQuotationDetail(id: string) {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: () => fetchQuotationDetail(id),
    enabled: !!id,
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: UpdateQuotationRequest;
    }) => updateQuotation(quotationId, data),
    onSuccess: () => {
      // Invalidate and refetch quotations after successful update
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useSendQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendQuotation,
    onSuccess: () => {
      // Invalidate and refetch quotations after successful send
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation'] });
    },
  });
}

export function useSubmitQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQuotation,
    onSuccess: () => {
      // Invalidate and refetch quotations after successful submit
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation'] });
    },
  });
}

// Utility functions for invoice status
export const isQuotationInvoiced = (
  quotation: QuotationDetail | Quotation,
): boolean => {
  return 'invoicedAt' in quotation ? !!quotation.invoicedAt : false;
};

export const canCreateInvoice = (
  quotation: QuotationDetail | Quotation,
): boolean => {
  return (
    quotation.status === QUOTATION_STATUS.ACCEPTED &&
    !isQuotationInvoiced(quotation)
  );
};

// Mark quotation as invoiced
const markQuotationAsInvoiced = async (
  quotationId: string,
  invoiceId?: string,
): Promise<void> => {
  const response = await fetch(`/api/quotations/${quotationId}/mark-invoiced`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invoiceId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to mark quotation as invoiced');
  }
};

export function useMarkQuotationAsInvoiced() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      invoiceId,
    }: {
      quotationId: string;
      invoiceId?: string;
    }) => markQuotationAsInvoiced(quotationId, invoiceId),
    onSuccess: () => {
      // Invalidate and refetch quotations after marking as invoiced
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation'] });
    },
  });
}

// Get quotations ready for invoicing (accepted but not yet invoiced)
export function useQuotationsReadyForInvoicing() {
  return useQuery({
    queryKey: ['quotations', 'ready-for-invoicing'],
    queryFn: () =>
      fetchQuotations({
        status: QUOTATION_STATUS.ACCEPTED,
        // Add a special parameter to filter non-invoiced quotations
        ready_for_invoice: 'true',
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
