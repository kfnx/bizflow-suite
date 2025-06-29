'use client';

import { useState, useCallback, useEffect } from 'react';
import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type ProductStatus = 'all' | 'in_stock' | 'out_of_stock' | 'discontinued';
type ProductCategory = 'all' | 'excavator' | 'bulldozer' | 'wheel_loader' | 'backhoe_loader' | 'compactor' | 'forklift';
type ProductBrand = 'all' | 'Shantui' | 'Caterpillar' | 'Komatsu' | 'Hitachi' | 'Volvo' | 'JCB';

export interface ProductsFilters {
  search: string;
  status: ProductStatus;
  category: ProductCategory;
  brand: ProductBrand;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface FiltersProps {
  onFiltersChange?: (filters: ProductsFilters) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [filters, setFilters] = useState<ProductsFilters>({
    search: '',
    status: 'all',
    category: 'all',
    brand: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ProductsFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFiltersChange?.(updatedFilters);
    },
    [filters, onFiltersChange],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleFiltersChange({ search: value, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      handleFiltersChange({ status: value as ProductStatus, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      handleFiltersChange({ category: value as ProductCategory, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleBrandChange = useCallback(
    (value: string) => {
      handleFiltersChange({ brand: value as ProductBrand, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      handleFiltersChange({ sortBy: value, page: 1 });
    },
    [handleFiltersChange],
  );

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterActive = filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.brand !== 'all' || filters.sortBy !== 'newest-first' || filters.page !== 1 || filters.limit !== 10;

  return (
    <div className='flex flex-col gap-4'>
      {/* Search Bar */}
      <div className='relative'>
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              id='search-input'
              type='text'
              placeholder='Search products by code, name, description, model, or supplier...'
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Kbd.Root>
              <IconCmd className='size-3' />
              K
            </Kbd.Root>
          </Input.Wrapper>
        </Input.Root>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {/* Status Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Status:</span>
          <SegmentedControl.Root
            value={filters.status}
            onValueChange={handleStatusChange}
            className='h-8'
          >
            <SegmentedControl.List>
              <SegmentedControl.Trigger value='all'>All</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value='in_stock'>In Stock</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value='out_of_stock'>Out of Stock</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value='discontinued'>Discontinued</SegmentedControl.Trigger>
            </SegmentedControl.List>
          </SegmentedControl.Root>
        </div>

        {/* Category Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Category:</span>
          <Select.Root value={filters.category} onValueChange={handleCategoryChange}>
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiSortDesc} />
              <Select.Value placeholder='Category' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Categories</Select.Item>
              <Select.Item value='excavator'>Excavator</Select.Item>
              <Select.Item value='bulldozer'>Bulldozer</Select.Item>
              <Select.Item value='wheel_loader'>Wheel Loader</Select.Item>
              <Select.Item value='backhoe_loader'>Backhoe Loader</Select.Item>
              <Select.Item value='compactor'>Compactor</Select.Item>
              <Select.Item value='forklift'>Forklift</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Brand Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Brand:</span>
          <Select.Root value={filters.brand} onValueChange={handleBrandChange}>
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiSortDesc} />
              <Select.Value placeholder='Sort by' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Brands</Select.Item>
              <Select.Item value='Shantui'>Shantui</Select.Item>
              <Select.Item value='Caterpillar'>Caterpillar</Select.Item>
              <Select.Item value='Komatsu'>Komatsu</Select.Item>
              <Select.Item value='Hitachi'>Hitachi</Select.Item>
              <Select.Item value='Volvo'>Volvo</Select.Item>
              <Select.Item value='JCB'>JCB</Select.Item>
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