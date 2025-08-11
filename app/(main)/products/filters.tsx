'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  RiFilter3Fill,
  RiFilterLine,
  RiSearchLine,
  RiSortDesc,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import { useWarehouses } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';

type ProductStatus = 'all' | 'in_stock' | 'out_of_stock' | 'discontinued';
type ProductCategory = 'all' | 'serialized' | 'non_serialized' | 'bulk';
type ProductBrand =
  | 'all'
  | 'shantui'
  | 'caterpillar'
  | 'komatsu'
  | 'hitachi'
  | 'volvo'
  | 'jcb'
  | 'oliolio'
  | 'spare_xyz'
  | 'sparepart_abc';

export interface ProductsFilters {
  search: string;
  status: ProductStatus;
  category: ProductCategory;
  brand: ProductBrand;
  location: string;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface FiltersProps {
  onFiltersChange?: (filters: ProductsFilters) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: warehousesData } = useWarehouses({ limit: 100 });

  const [filters, setFilters] = useState<ProductsFilters>({
    search: searchParams.get('search') || '',
    status: (searchParams.get('status') as ProductStatus) || 'all',
    category: (searchParams.get('category') as ProductCategory) || 'all',
    brand: (searchParams.get('brand') as ProductBrand) || 'all',
    location: searchParams.get('location') || 'all',
    sortBy: searchParams.get('sortBy') || 'newest-first',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  });

  const updateURL = useCallback(
    (newFilters: ProductsFilters) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.status !== 'all') params.set('status', newFilters.status);
      if (newFilters.category !== 'all')
        params.set('category', newFilters.category);
      if (newFilters.brand !== 'all') params.set('brand', newFilters.brand);
      if (newFilters.location !== 'all')
        params.set('location', newFilters.location);
      if (newFilters.sortBy !== 'newest-first')
        params.set('sortBy', newFilters.sortBy);
      if (newFilters.page && newFilters.page > 1)
        params.set('page', newFilters.page.toString());
      if (newFilters.limit && newFilters.limit !== 10)
        params.set('limit', newFilters.limit.toString());

      const newURL = params.toString() ? `?${params.toString()}` : '';
      router.push(`/products${newURL}`);
    },
    [router],
  );

  useEffect(() => {
    updateURL(filters);
    onFiltersChange?.(filters);
  }, [filters, updateURL, onFiltersChange]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: ProductStatus) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));
  };

  const handleCategoryChange = (value: ProductCategory) => {
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  };

  const handleBrandChange = (value: ProductBrand) => {
    setFilters((prev) => ({ ...prev, brand: value, page: 1 }));
  };

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, location: value, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value, page: 1 }));
  };

  // Check if any filter is active (not default)
  const filterActive =
    filters.search ||
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.location !== 'all' ||
    filters.sortBy !== 'newest-first';

  // Handle Enter key press in search input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        handleSearchChange(value);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='flex flex-col gap-4 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      {/* Search Bar */}
      <div className='relative'>
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon as={RiSearchLine} />
            <Input.Input
              placeholder='Search products by name, code, or description...'
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pl-10'
            />
          </Input.Wrapper>
        </Input.Root>
      </div>

      {/* Filters Row */}
      <div className='flex flex-wrap items-center gap-4'>
        {/* Status Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Status:</span>
          <Select.Root
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Status' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Status</Select.Item>
              <Select.Item value='in_stock'>In Stock</Select.Item>
              <Select.Item value='out_of_stock'>Out of Stock</Select.Item>
              <Select.Item value='discontinued'>Discontinued</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Category Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Category:</span>
          <Select.Root
            value={filters.category}
            onValueChange={handleCategoryChange}
          >
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Category' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Categories</Select.Item>
              <Select.Item value='serialized'>Serialized</Select.Item>
              <Select.Item value='non_serialized'>Non-Serialized</Select.Item>
              <Select.Item value='bulk'>Bulk</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Brand Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Brand:</span>
          <Select.Root value={filters.brand} onValueChange={handleBrandChange}>
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Brand' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Brands</Select.Item>
              <Select.Item value='shantui'>Shantui</Select.Item>
              <Select.Item value='caterpillar'>Caterpillar</Select.Item>
              <Select.Item value='komatsu'>Komatsu</Select.Item>
              <Select.Item value='hitachi'>Hitachi</Select.Item>
              <Select.Item value='volvo'>Volvo</Select.Item>
              <Select.Item value='jcb'>JCB</Select.Item>
              <Select.Item value='oliolio'>Oliolio</Select.Item>
              <Select.Item value='spare_xyz'>Spare XYZ</Select.Item>
              <Select.Item value='sparepart_abc'>Sparepart ABC</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Location Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Location:</span>
          <Select.Root
            value={filters.location}
            onValueChange={handleLocationChange}
          >
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Location' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Locations</Select.Item>
              {warehousesData?.data?.map((warehouse) => (
                <Select.Item key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </Select.Item>
              )) || []}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Sort Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Sort by:</span>
          <Select.Root value={filters.sortBy} onValueChange={handleSortChange}>
            <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiSortDesc} />
              <Select.Value placeholder='Sort by' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='newest-first'>Newest First</Select.Item>
              <Select.Item value='name-asc'>Name (A-Z)</Select.Item>
              <Select.Item value='name-desc'>Name (Z-A)</Select.Item>
              <Select.Item value='code-asc'>Code (A-Z)</Select.Item>
              <Select.Item value='code-desc'>Code (Z-A)</Select.Item>
              <Select.Item value='price-asc'>Price (Low to High)</Select.Item>
              <Select.Item value='price-desc'>Price (High to Low)</Select.Item>
              <Select.Item value='category-asc'>Category (A-Z)</Select.Item>
              <Select.Item value='category-desc'>Category (Z-A)</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Clear Filters Button */}
        <Button.Root
          mode='ghost'
          size='xsmall'
          onClick={() => {
            const clearedFilters = {
              search: '',
              status: 'all' as ProductStatus,
              category: 'all' as ProductCategory,
              brand: 'all' as ProductBrand,
              location: 'all',
              sortBy: 'newest-first',
              page: 1,
              limit: 10,
            };
            setFilters(clearedFilters);
            onFiltersChange?.(clearedFilters);
          }}
          className={cn(
            'transition-opacity',
            filterActive ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <RiFilter3Fill className='size-4' />
          Clear filters
        </Button.Root>
      </div>
    </div>
  );
}
