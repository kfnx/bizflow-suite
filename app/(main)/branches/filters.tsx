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

export interface BranchesFilters {
  search: string;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface FiltersProps {
  onFiltersChange?: (filters: BranchesFilters) => void;
  initialFilters?: BranchesFilters;
}

export function Filters({ onFiltersChange, initialFilters }: FiltersProps) {
  const [filters, setFilters] = useState<BranchesFilters>(
    initialFilters || {
      search: '',
      sortBy: 'name-asc',
      page: 1,
      limit: 10,
    },
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<BranchesFilters>) => {
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

  const filterActive = useMemo(
    () =>
      filters.search ||
      filters.sortBy !== 'name-asc' ||
      filters.page !== 1 ||
      filters.limit !== 10,
    [filters],
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
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
              placeholder='Search branches...'
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
          <Select.Root value={filters.sortBy} onValueChange={handleSortChange}>
            <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiSortDesc} />
              <Select.Value placeholder='Sort by' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='name-asc'>Name (A-Z)</Select.Item>
              <Select.Item value='name-desc'>Name (Z-A)</Select.Item>
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
