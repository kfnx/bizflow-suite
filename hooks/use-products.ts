'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Product } from '@/lib/db/schema';

// Extended Product type that includes joined data from API responses
export type ProductWithRelations = Product & {
  brandName?: string | null;
  supplierName?: string | null;
  supplierCode?: string | null;
  machineTypeName?: string | null;
  unitOfMeasureName?: string | null;
  unitOfMeasureAbbreviation?: string | null;
  warehouseName?: string | null;
};

export type ProductsResponse = {
  data: ProductWithRelations[];
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
  brandId?: string;
  supplierId?: string;
  warehouseId?: string;
  condition?: string;
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
  if (filters.brandId && filters.brandId !== 'all')
    params.append('brandId', filters.brandId);
  if (filters.supplierId && filters.supplierId !== 'all')
    params.append('supplierId', filters.supplierId);
  if (filters.warehouseId && filters.warehouseId !== 'all')
    params.append('warehouseId', filters.warehouseId);
  if (filters.condition && filters.condition !== 'all')
    params.append('condition', filters.condition);
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
