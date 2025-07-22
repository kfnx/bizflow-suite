'use client';

import { useCallback, useState } from 'react';
import { RiArrowDownSLine, RiSearchLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';

interface FiltersProps {
  onFiltersChange: (filters: { search: string; sortBy: string }) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const handleApplyFilters = useCallback(() => {
    onFiltersChange({
      search,
      sortBy,
    });
  }, [search, sortBy, onFiltersChange]);

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setSortBy('name-asc');
    onFiltersChange({
      search: '',
      sortBy: 'name-asc',
    });
  }, [onFiltersChange]);

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-stroke-soft-200 p-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Search */}
        <div className='flex flex-col gap-2'>
          <label className='text-sm text-gray-700 font-medium'>Search</label>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                placeholder='Search branches...'
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        {/* Sort By */}
        <div className='flex flex-col gap-2'>
          <label className='text-sm text-gray-700 font-medium'>Sort By</label>
          <Select.Root value={sortBy} onValueChange={setSortBy}>
            <Select.Trigger>
              <Select.TriggerIcon as={RiArrowDownSLine} />
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='name-asc'>Name (A-Z)</Select.Item>
              <Select.Item value='name-desc'>Name (Z-A)</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      {/* Filter Actions */}
      <div className='flex gap-3'>
        <Button.Root
          onClick={handleApplyFilters}
          variant='primary'
          className='flex-1 sm:flex-none'
        >
          Apply Filters
        </Button.Root>
        <Button.Root
          onClick={handleResetFilters}
          variant='neutral'
          mode='ghost'
        >
          Reset
        </Button.Root>
      </div>
    </div>
  );
}
