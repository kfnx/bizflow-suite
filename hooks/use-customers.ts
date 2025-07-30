'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Customer = {
  id: string;
  code: string;
  name: string;
  type: string;
  npwp?: string;
  npwp16?: string;
  billingAddress?: string;
  shippingAddress?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  paymentTerms?: string;
  isActive?: boolean;
  contactPersons?: Array<{
    id: string;
    prefix?: string;
    name: string;
    email?: string;
    phone?: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type CustomersResponse = {
  data: Customer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

  // Include inactive customers in table view
  params.append('includeInactive', 'true');

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

const fetchCustomerDetail = async (customerId: string): Promise<Customer> => {
  const response = await fetch(`/api/customers/${customerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch customer details');
  }
  return response.json();
};

export function useCustomerDetail(customerId: string) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerDetail(customerId),
    enabled: !!customerId,
  });
}

const updateCustomer = async (
  customerId: string,
  customerData: any,
): Promise<void> => {
  const response = await fetch(`/api/customers/${customerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update customer');
  }
};

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      customerData,
    }: {
      customerId: string;
      customerData: any;
    }) => updateCustomer(customerId, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
  });
}
