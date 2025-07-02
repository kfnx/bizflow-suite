'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Customer = {
  id: string;
  code: string;
  name: string;
  type: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  createdAt: string;
};

export type CustomersResponse = {
  data: Customer[];
};

export type CustomersFilters = {
  search?: string;
  type?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchCustomers = async (
  filters: CustomersFilters = {},
): Promise<CustomersResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.type && filters.type !== 'all')
    params.append('type', filters.type);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/customers?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};

const deleteCustomer = async (customerId: string): Promise<void> => {
  const response = await fetch(`/api/customers/${customerId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete customer');
  }
};

export function useCustomers(filters: CustomersFilters = {}) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => fetchCustomers(filters),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      // Invalidate and refetch customers after successful deletion
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
