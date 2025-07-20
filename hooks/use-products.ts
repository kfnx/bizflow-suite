'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Product } from '@/lib/db/schema';

// Extended Product type that includes joined data from API responses
export type ProductWithRelations = Product & {
  brandId?: string | null;
  brandName?: string | null;
  machineTypeId?: string | null;
  machineTypeName?: string | null;
  unitOfMeasureId?: string | null;
  unitOfMeasureName?: string | null;
  unitOfMeasureAbbreviation?: string | null;
  modelOrPartNumber?: string | null;
  machineNumber?: string | null;
  engineNumber?: string | null;
  batchOrLotNumber?: string | null;
  serialNumber?: string | null;
  warehouseId?: string | null;
  warehouseName?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  supplierCode?: string | null;
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
    let errorMessage = 'Failed to fetch products';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

const fetchProduct = async (
  productId: string,
): Promise<ProductWithRelations> => {
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) {
    let errorMessage = 'Failed to fetch product';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status === 404) {
        errorMessage = 'Product not found';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data.data;
};

export type UpdateProductData = Partial<ProductWithRelations>;

const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateProductData;
}): Promise<ProductWithRelations> => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update product';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status === 404) {
        errorMessage = 'Product not found';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.data;
};

const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let errorMessage = 'Failed to delete product';

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      if (response.status === 403) {
        errorMessage = 'Forbidden - Insufficient permissions';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized - Please log in again';
      } else if (response.status === 404) {
        errorMessage = 'Product not found';
      } else if (response.status >= 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new Error(errorMessage);
  }
};

export function useProducts(filters: ProductsFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(productId: string | null) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: !!productId,
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data, variables) => {
      // Invalidate and refetch products after successful update
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Update the specific product cache
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product updated successfully!', {
        description: 'The product changes have been saved.',
      });
    },
    onError: (error) => {
      toast.error('Failed to update product', {
        description: error.message,
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch products after successful deletion
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!', {
        description: 'The product has been permanently removed.',
      });
    },
    onError: (error) => {
      toast.error('Failed to delete product', {
        description: error.message,
      });
    },
  });
}
