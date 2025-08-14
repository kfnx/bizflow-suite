'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Invoice = {
  id: string;
  invoiceNumber: string;
  quotationId?: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  branchId?: string;
  branchName?: string;
  subtotal: string;
  tax: string;
  total: string;
  currency: string;
  status: string;
  paymentTerms?: string;
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
  quotation?: {
    id: string;
    quotationNumber: string;
  };
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type InvoicesResponse = {
  data: Invoice[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type InvoicesFilters = {
  search?: string;
  status?: string;
  branch?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type InvoiceDetail = {
  id: string;
  invoiceNumber: string;
  quotationId?: string;
  invoiceDate: string;
  contractNumber?: string;
  customerPoNumber?: string;
  dueDate: string;
  customerId: string;
  branchId?: string;
  branchName?: string;
  subtotal: string;
  tax: string;
  total: string;
  currency: string;
  status: string;
  paymentTerms?: string;
  isIncludePPN: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  customerName?: string;
  quotationNumber?: string;
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  salesmanUserId?: string;
  salesmanUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: string;
    unitPrice: string;
    total: string;
    serialNumber?: string;
    partNumber?: string;
    category?: string;
    additionalSpecs?: string;
  }[];
};

const fetchInvoices = async (
  filters?: InvoicesFilters,
): Promise<InvoicesResponse> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.status && filters.status !== 'all')
    params.append('status', filters.status);
  if (filters?.branch) params.append('branch', filters.branch);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/invoices?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }
  return response.json();
};

const fetchInvoiceDetail = async (
  invoiceId: string,
): Promise<{ data: InvoiceDetail }> => {
  const response = await fetch(`/api/invoices/${invoiceId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Invoice not found');
    }
    throw new Error('Failed to fetch invoice detail');
  }
  return response.json();
};

const deleteInvoice = async (invoiceId: string): Promise<void> => {
  const response = await fetch(`/api/invoices/${invoiceId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }
};

export function useInvoices(filters?: InvoicesFilters) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => fetchInvoices(filters),
  });
}

export function useInvoiceDetail(invoiceId: string) {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => fetchInvoiceDetail(invoiceId),
    enabled: !!invoiceId,
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
