'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { Quotation } from '@/lib/db/schema';
import {
  QuotationFormData,
  QuotationResponse,
  UpdateQuotationRequest,
} from '@/lib/validations/quotation';

// Type for the actual API response from /api/quotations
export type QuotationListItem = {
  id: string;
  quotationNumber: string;
  quotationDate: Date;
  validUntil: Date;
  customerId: string | null;
  customerName: string | null;
  customerCode: string | null;
  customerType: string | null;
  customerAddress: string | null;
  customerContactPerson: string | null;
  customerContactPersonPrefix: string | null;
  customerContactPersonEmail: string | null;
  customerContactPersonPhone: string | null;
  branchId: string;
  branchName: string | null;
  subtotal: string | null;
  tax: string | null;
  total: string | null;
  status: string;
  notes: string | null;
  createdBy: string;
  createdByUserFirstName: string | null;
  createdByUserLastName: string | null;
  invoiceId: string | null;
  invoicedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type QuotationsResponse = {
  data: QuotationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// TODO: update, crosscheck with schema type
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

// TODO: update, crosscheck with schema type
export type QuotationDetail = Omit<Quotation, 'id' | 'tax'> & {
  id: string;
  approvedBy?: string;
  isIncludePPN: boolean;
  subtotal: number;
  tax: number;
  total: number;
  termsAndConditions?: string;
  branchName: string;
  customerName: string;
  customerCode: string;
  customerType: string;
  customerAddress?: string;
  customerContactPerson?: string;
  customerContactPersonPrefix?: string;
  customerContactPersonEmail?: string;
  customerContactPersonPhone?: string;
  customerResponseDate?: string;
  customerResponseNotes?: string;
  customerAcceptanceInfo?: string;
  rejectionReason?: string;
  revisionReason?: string;
  invoicedAt?: string;
  invoiceId?: string;
  items: QuotationItem[];
  revisionVersion: number;
  createdByUser: string;
  createdByUserPrefix?: string;
  createdByUserFirstName?: string;
  createdByUserLastName?: string;
  createdByUserPhone?: string;
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

const createQuotation = async (
  data: QuotationFormData,
): Promise<{ data: QuotationDetail }> => {
  const response = await fetch('/api/quotations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create quotation');
  }

  return response.json();
};

const createQuotationDraft = async (
  data: QuotationFormData,
): Promise<{ data: QuotationDetail }> => {
  const response = await fetch('/api/quotations/save-draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create quotation draft');
  }

  return response.json();
};

const deleteQuotation = async (quotationId: string): Promise<void> => {
  const response = await fetch(`/api/quotations/${quotationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete quotation');
  }
};

const editQuotation = async (
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

const reviseQuotation = async (
  quotationId: string,
  data: UpdateQuotationRequest,
): Promise<any> => {
  // First, update the quotation data
  const updateResponse = await fetch(`/api/quotations/${quotationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!updateResponse.ok) {
    const errorData = await updateResponse.json();
    throw new Error(errorData.error || 'Failed to revise quotation');
  }

  return updateResponse.json();
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

export function useQuotation(quotationId: string | null) {
  return useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: () => fetchQuotationDetail(quotationId!),
    enabled: !!quotationId,
  });
}

export function useEditQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: UpdateQuotationRequest;
    }) => editQuotation(quotationId, data),
    onSuccess: () => {
      // Invalidate and refetch quotations after successful update
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update quotation');
    },
  });
}

export function useReviseQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quotationId,
      data,
    }: {
      quotationId: string;
      data: UpdateQuotationRequest;
    }) => reviseQuotation(quotationId, data),
    onSuccess: () => {
      // Invalidate and refetch quotations after successful revise
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation revised successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revise quotation');
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
      toast.success('Quotation sent successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send quotation');
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
      toast.success('Quotation submitted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit quotation');
    },
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      // Invalidate and refetch quotations after successful creation
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create quotation');
    },
  });
}

export function useCreateQuotationDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuotationDraft,
    onSuccess: () => {
      // Invalidate and refetch quotations after successful draft creation
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation draft saved successfully');
    },
    onError: (error) => {
      console.error('🚀 ~ useCreateQuotationDraft ~ error:', error);
      toast.error(error.message || 'Failed to save quotation draft');
    },
  });
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuotation,
    onSuccess: () => {
      // Invalidate and refetch quotations after successful deletion
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete quotation');
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
      toast.success('Quotation marked as invoiced successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark quotation as invoiced');
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
