'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Product = {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  model?: string;
  year?: number;
  condition: string;
  status: string;
  location?: string;
  unit: string;
  price: number;
  currency: string;
  engineModel?: string;
  enginePower?: string;
  operatingWeight?: string;
  supplierId?: string;
  supplierName?: string;
  supplierCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductsFilters = {
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  supplierId?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

const fetchProducts = async (
  filters: ProductsFilters = {},
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'all')
    params.append('status', filters.status);
  if (filters.category && filters.category !== 'all')
    params.append('category', filters.category);
  if (filters.brand && filters.brand !== 'all')
    params.append('brand', filters.brand);
  if (filters.supplierId && filters.supplierId !== 'all')
    params.append('supplierId', filters.supplierId);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete product');
  }
};

export function useProducts(filters: ProductsFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch products after successful deletion
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
