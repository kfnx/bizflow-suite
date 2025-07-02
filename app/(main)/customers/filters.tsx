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
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type CustomerType = 'all' | 'individual' | 'company';

export interface CustomersFilters {
  search: string;
  type: CustomerType;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface FiltersProps {
  onFiltersChange?: (filters: CustomersFilters) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [filters, setFilters] = useState<CustomersFilters>({
    search: '',
    type: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = useCallback(
    (newFilters: Partial<CustomersFilters>) => {
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

  const handleTypeChange = useCallback(
    (value: string) => {
      handleFiltersChange({ type: value as CustomerType, page: 1 });
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
    filters.type !== 'all' ||
    filters.sortBy !== 'newest-first' ||
    filters.page !== 1 ||
    filters.limit !== 10;

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
              placeholder='Search customers by code, name, contact person, or email...'
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
        {/* Type Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-paragraph-sm text-text-sub-600'>Type:</span>
          <SegmentedControl.Root
            value={filters.type}
            onValueChange={handleTypeChange}
            className='h-8'
          >
            <SegmentedControl.List>
              <SegmentedControl.Trigger value='all'>
                All
              </SegmentedControl.Trigger>
              <SegmentedControl.Trigger value='individual'>
                Individual
              </SegmentedControl.Trigger>
              <SegmentedControl.Trigger value='company'>
                Company
              </SegmentedControl.Trigger>
            </SegmentedControl.List>
          </SegmentedControl.Root>
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
              <Select.Item value='type-asc'>Type (A-Z)</Select.Item>
              <Select.Item value='type-desc'>Type (Z-A)</Select.Item>
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
              type: 'all' as CustomerType,
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
