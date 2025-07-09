'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RiFilter3Fill,
  RiFilterLine,
  RiSearch2Line,
  RiSortDesc,
} from '@remixicon/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type QuotationStatusFilters = 'all' | QUOTATION_STATUS;

type QuotationStatus = 'all' | QUOTATION_STATUS;

export interface QuotationsFilters {
  search: string;
  status: QuotationStatus;
  sortBy: string;
  page?: number;
  limit?: number;
}

interface FiltersProps {
  onFiltersChange?: (filters: QuotationsFilters) => void;
  initialFilters?: QuotationsFilters;
}

export function Filters({ onFiltersChange, initialFilters }: FiltersProps) {
  const [filters, setFilters] = useState<QuotationsFilters>(
    initialFilters || {
      search: '',
      status: 'all',
      sortBy: 'newest-first',
      page: 1,
      limit: 10,
    },
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<QuotationsFilters>) => {
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
      handleFiltersChange({ status: value as QuotationStatusFilters, page: 1 });
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
      filters.status !== 'all' ||
      filters.sortBy !== 'newest-first' ||
      filters.page !== 1 ||
      filters.limit !== 10,
    [filters],
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      status: 'all' as QuotationStatusFilters,
      sortBy: 'newest-first',
      page: 1,
      limit: 10,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  }, [onFiltersChange]);

  return (
    <div className='flex justify-between gap-4'>
      {/* Search Bar */}
      <div className='relative flex-1'>
        <Input.Root>
          <Input.Wrapper>
            <RiSearch2Line className='size-4' />
            <Input.Input
              id='search-input'
              type='text'
              placeholder='Search quotations by number, customer, or notes...'
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
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
              <Select.TriggerIcon as={RiFilterLine} />
              <Select.Value placeholder='Status' />
            </Select.Trigger>
            <Select.Content className='h-full'>
              <Select.Item value='all'>All Status</Select.Item>
              <Select.Item value='draft'>Draft</Select.Item>
              <Select.Item value='submitted'>Submitted</Select.Item>
              <Select.Item value='approved'>Approved</Select.Item>
              <Select.Item value='sent'>Sent</Select.Item>
              <Select.Item value='accepted'>Accepted</Select.Item>
              <Select.Item value='rejected'>Rejected</Select.Item>
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
              <Select.Item value='newest-first'>Newest First</Select.Item>
              <Select.Item value='oldest-first'>Oldest First</Select.Item>
              <Select.Item value='number-asc'>Number (A-Z)</Select.Item>
              <Select.Item value='number-desc'>Number (Z-A)</Select.Item>
              <Select.Item value='quotation-date-asc'>
                Quotation Date (Earliest)
              </Select.Item>
              <Select.Item value='quotation-date-desc'>
                Quotation Date (Latest)
              </Select.Item>
              <Select.Item value='valid-until-asc'>
                Valid Until (Earliest)
              </Select.Item>
              <Select.Item value='valid-until-desc'>
                Valid Until (Latest)
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
