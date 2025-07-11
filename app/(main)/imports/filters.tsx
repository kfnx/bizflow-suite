'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiFilter3Fill,
  RiFilterLine,
  RiSearch2Line,
  RiSortDesc,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

export interface ImportsFilters {
  search: string;
  supplierId: string;
  warehouseId: string;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface FiltersProps {
  onFiltersChange?: (filters: ImportsFilters) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [filters, setFilters] = useState<ImportsFilters>({
    search: '',
    supplierId: 'all',
    warehouseId: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ImportsFilters>) => {
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

  const handleSupplierChange = useCallback(
    (value: string) => {
      handleFiltersChange({ supplierId: value, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleWarehouseChange = useCallback(
    (value: string) => {
      handleFiltersChange({ warehouseId: value, page: 1 });
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

  const filterActive =
    filters.search ||
    filters.supplierId !== 'all' ||
    filters.warehouseId !== 'all' ||
    filters.sortBy !== 'newest-first' ||
    filters.page !== 1 ||
    filters.limit !== 10;

  return (
    <div className='flex flex-col gap-4 lg:flex-row lg:justify-between'>
      {/* Search Bar */}
      <div className='relative flex-1'>
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              id='search-input'
              type='text'
              placeholder='Search imports by invoice number, product name, or supplier...'
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Kbd.Root>
              <IconCmd className='size-3' />K
            </Kbd.Root>
          </Input.Wrapper>
        </Input.Root>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {/* Supplier Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Supplier:</span>
          <Select.Root
            value={filters.supplierId}
            onValueChange={handleSupplierChange}
          >
            <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
              <Select.Value placeholder='All Suppliers' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Suppliers</Select.Item>
              {/* TODO: Add dynamic supplier options */}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Warehouse Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>
            Warehouse:
          </span>
          <Select.Root
            value={filters.warehouseId}
            onValueChange={handleWarehouseChange}
          >
            <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
              <Select.Value placeholder='All Warehouses' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Warehouses</Select.Item>
              {/* TODO: Add dynamic warehouse options */}
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
              <Select.Item value='oldest-first'>Oldest First</Select.Item>
              <Select.Item value='invoice-asc'>
                Invoice Number (A-Z)
              </Select.Item>
              <Select.Item value='invoice-desc'>
                Invoice Number (Z-A)
              </Select.Item>
              <Select.Item value='supplier-asc'>Supplier (A-Z)</Select.Item>
              <Select.Item value='supplier-desc'>Supplier (Z-A)</Select.Item>
              <Select.Item value='amount-asc'>Amount (Low-High)</Select.Item>
              <Select.Item value='amount-desc'>Amount (High-Low)</Select.Item>
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
              supplierId: 'all',
              warehouseId: 'all',
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
