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
  status: string;
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
    status: 'all',
    sortBy: 'date-desc',
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
    filters.status !== 'all' ||
    filters.sortBy !== 'date-desc' ||
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
        {/* Sort Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Sort by:</span>
          <Select.Root value={filters.sortBy} onValueChange={handleSortChange}>
            <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiSortDesc} />
              <Select.Value placeholder='Sort by' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='date-desc'>Newest First</Select.Item>
              <Select.Item value='date-asc'>Oldest First</Select.Item>
              <Select.Item value='status-asc'>Status (A-Z)</Select.Item>
              <Select.Item value='status-desc'>Status (Z-A)</Select.Item>
              <Select.Item value='supplier-asc'>Supplier (A-Z)</Select.Item>
              <Select.Item value='supplier-desc'>Supplier (Z-A)</Select.Item>
              <Select.Item value='total-asc'>Amount (Low-High)</Select.Item>
              <Select.Item value='total-desc'>Amount (High-Low)</Select.Item>
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
              status: 'all',
              sortBy: 'date-desc',
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
