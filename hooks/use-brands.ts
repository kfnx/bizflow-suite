'use client';

import { useQuery } from '@tanstack/react-query';

export type Brand = {
  id: string;
  name: string;
  type: 'machine' | 'sparepart';
};

export type BrandsFilters = {
  search?: string;
  type?: 'machine' | 'sparepart';
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type BrandsResponse = {
  data: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const fetchBrands = async (
  filters: BrandsFilters = {},
): Promise<BrandsResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.type) params.append('type', filters.type);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/brands?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch brands');
  }
  return response.json();
};

export function useBrands(filters: BrandsFilters = {}) {
  return useQuery({
    queryKey: ['brands', filters],
    queryFn: () => fetchBrands(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
