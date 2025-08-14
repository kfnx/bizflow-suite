'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

export interface WarehousesFilters {
  search: string;
  isActive: 'all' | 'true' | 'false';
  sortBy: string;
  page?: number;
  limit?: number;
}

interface WarehousesFiltersProps {
  onFiltersChange?: (filters: WarehousesFilters) => void;
  initialFilters?: WarehousesFilters;
}

export function WarehousesFilters({
  onFiltersChange,
  initialFilters,
}: WarehousesFiltersProps) {
  const [filters, setFilters] = useState<WarehousesFilters>(
    initialFilters || {
      search: '',
      isActive: 'all',
      sortBy: 'name-asc',
      page: 1,
      limit: 10,
    },
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<WarehousesFilters>) => {
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
      handleFiltersChange({
        isActive: value as 'all' | 'true' | 'false',
        page: 1,
      });
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
      filters.isActive !== 'all' ||
      filters.sortBy !== 'name-asc' ||
      filters.page !== 1 ||
      filters.limit !== 10,
    [filters],
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      isActive: 'all' as const,
      sortBy: 'name-asc',
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
              placeholder='Search warehouses, addresses, managers...'
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
        {/* Status Filter */}
        <div className='flex items-center gap-2'>
          <Select.Root
            value={filters.isActive}
            onValueChange={handleStatusChange}
          >
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Status' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All Status</Select.Item>
              <Select.Item value='true'>Active</Select.Item>
              <Select.Item value='false'>Inactive</Select.Item>
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
              <Select.Item value='name-asc'>Name (A-Z)</Select.Item>
              <Select.Item value='name-desc'>Name (Z-A)</Select.Item>
              <Select.Item value='manager-asc'>Manager (A-Z)</Select.Item>
              <Select.Item value='manager-desc'>Manager (Z-A)</Select.Item>
              <Select.Item value='created-desc'>Recently Created</Select.Item>
              <Select.Item value='created-asc'>Oldest First</Select.Item>
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
