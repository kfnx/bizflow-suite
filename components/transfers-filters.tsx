'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RiFilter3Fill,
  RiFilterLine,
  RiSearch2Line,
  RiSortDesc,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import { useProducts } from '@/hooks/use-products';
import { useWarehouses } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

export interface TransfersFilters {
  search: string;
  movementType: 'all' | 'in' | 'out' | 'transfer' | 'adjustment';
  warehouseFrom: string;
  warehouseTo: string;
  productId: string;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface TransfersFiltersProps {
  onFiltersChange?: (filters: TransfersFilters) => void;
  initialFilters?: TransfersFilters;
}

export function TransfersFilters({
  onFiltersChange,
  initialFilters,
}: TransfersFiltersProps) {
  const [filters, setFilters] = useState<TransfersFilters>(
    initialFilters || {
      search: '',
      movementType: 'all',
      warehouseFrom: 'all',
      warehouseTo: 'all',
      productId: 'all',
      sortBy: 'date-desc',
      page: 1,
      limit: 10,
    },
  );

  // Fetch reference data
  const { data: warehousesData } = useWarehouses({ limit: 100 });
  const { data: productsData } = useProducts({ limit: 100 });

  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const handleFiltersChange = useCallback(
    (newFilters: Partial<TransfersFilters>) => {
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

  const handleMovementTypeChange = useCallback(
    (value: string) => {
      handleFiltersChange({
        movementType: value as 'all' | 'in' | 'out' | 'transfer' | 'adjustment',
        page: 1,
      });
    },
    [handleFiltersChange],
  );

  const handleWarehouseFromChange = useCallback(
    (value: string) => {
      handleFiltersChange({ warehouseFrom: value, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleWarehouseToChange = useCallback(
    (value: string) => {
      handleFiltersChange({ warehouseTo: value, page: 1 });
    },
    [handleFiltersChange],
  );

  const handleProductChange = useCallback(
    (value: string) => {
      handleFiltersChange({ productId: value, page: 1 });
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

  const filterActive = useMemo(
    () =>
      filters.search ||
      filters.movementType !== 'all' ||
      filters.warehouseFrom !== 'all' ||
      filters.warehouseTo !== 'all' ||
      filters.productId !== 'all' ||
      filters.sortBy !== 'date-desc' ||
      filters.page !== 1 ||
      filters.limit !== 10,
    [filters],
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      movementType: 'all' as const,
      warehouseFrom: 'all',
      warehouseTo: 'all',
      productId: 'all',
      sortBy: 'date-desc',
      page: 1,
      limit: 10,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange]);

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
              placeholder='Search products, notes, invoices...'
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
        {/* Movement Type Filter */}
        <div className='flex items-center gap-2'>
          <Select.Root
            value={filters.movementType}
            onValueChange={handleMovementTypeChange}
          >
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Movement Type' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Types</Select.Item>
              <Select.Item value='in'>In</Select.Item>
              <Select.Item value='out'>Out</Select.Item>
              <Select.Item value='transfer'>Transfer</Select.Item>
              <Select.Item value='adjustment'>Adjustment</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Sort Filter */}
        <div className='flex items-center gap-2'>
          <Select.Root value={filters.sortBy} onValueChange={handleSortChange}>
            <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiSortDesc} />
              <Select.Value placeholder='Sort by' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='date-desc'>Latest First</Select.Item>
              <Select.Item value='date-asc'>Oldest First</Select.Item>
              <Select.Item value='product-asc'>Product (A-Z)</Select.Item>
              <Select.Item value='product-desc'>Product (Z-A)</Select.Item>
              <Select.Item value='movement-type-asc'>Type (A-Z)</Select.Item>
              <Select.Item value='movement-type-desc'>Type (Z-A)</Select.Item>
              <Select.Item value='quantity-asc'>
                Quantity (Low-High)
              </Select.Item>
              <Select.Item value='quantity-desc'>
                Quantity (High-Low)
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Clear Filters Button */}
        <Button.Root
          mode='ghost'
          size='xsmall'
          onClick={handleClearFilters}
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
