'use client';

import * as React from 'react';
import { RiSearchLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';

interface WarehousesFiltersProps {
  filters: {
    search: string;
    isActive: 'all' | 'true' | 'false';
    sortBy: string;
    page: number;
    limit: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function WarehousesFilters({
  filters,
  onFiltersChange,
}: WarehousesFiltersProps) {
  const [localSearch, setLocalSearch] = React.useState(filters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: localSearch, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      isActive: 'all',
      sortBy: 'name-asc',
      page: 1,
      limit: filters.limit,
    });
  };

  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
      <form onSubmit={handleSearchSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Search
            </label>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder='Search warehouses, addresses, managers...'
                />
                <Input.Icon>
                  <RiSearchLine className='size-5 text-text-sub-600' />
                </Input.Icon>
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Status
            </label>
            <Select.Root
              value={filters.isActive}
              onValueChange={(value) => handleFilterChange('isActive', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder='All status' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='all'>All Status</Select.Item>
                <Select.Item value='true'>Active</Select.Item>
                <Select.Item value='false'>Inactive</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Sort By
            </label>
            <Select.Root
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <Select.Trigger>
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

          <div className='flex flex-col justify-end gap-2'>
            <div className='grid grid-cols-2 gap-2'>
              <Button.Root type='submit' variant='primary' size='small'>
                Search
              </Button.Root>
              <Button.Root
                type='button'
                variant='neutral'
                mode='ghost'
                size='small'
                onClick={clearFilters}
              >
                Clear
              </Button.Root>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
