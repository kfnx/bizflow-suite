'use client';

import { useCallback, useEffect, useState } from 'react';
import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type QuotationStatus = 'all' | 'draft' | 'sent' | 'accepted' | 'rejected';

export interface QuotationsFilters {
  search: string;
  status: QuotationStatus;
  sortBy: string;
}

interface FiltersProps {
  onFiltersChange?: (filters: QuotationsFilters) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<QuotationStatus>('all');
  const [sortBy, setSortBy] = useState('');

  const handleFiltersChange = useCallback(() => {
    onFiltersChange?.({
      search,
      status,
      sortBy,
    });
  }, [search, status, sortBy, onFiltersChange]);

  useEffect(() => {
    handleFiltersChange();
  }, [handleFiltersChange]);

  return (
    <div className='flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3'>
      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder='Search quotations...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type='button'>
            <RiFilter3Fill className='size-5 text-text-soft-400' />
          </button>
        </Input.Wrapper>
      </Input.Root>

      <SegmentedControl.Root
        value={status}
        onValueChange={(v) => setStatus(v as QuotationStatus)}
        className='lg:w-96'
      >
        <SegmentedControl.List className='w-full'>
          <SegmentedControl.Trigger value='all'>All</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='draft'>
            Draft
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='sent'>Sent</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='accepted'>
            Accepted
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='rejected'>
            Rejected
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='hidden flex-wrap gap-3 min-[560px]:flex-nowrap lg:flex'>
        <Input.Root size='small' className='w-[300px]'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              placeholder='Search quotations...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Kbd.Root>
              <IconCmd className='size-2.5' />1
            </Kbd.Root>
          </Input.Wrapper>
        </Input.Root>

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='flex-1 min-[560px]:flex-none'
        >
          <Button.Icon as={RiFilter3Fill} />
          Filter
        </Button.Root>

        <Select.Root size='small' value={sortBy} onValueChange={setSortBy}>
          <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
            <Select.TriggerIcon as={RiSortDesc} />
            <Select.Value placeholder='Sort by' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='date-asc'>Date (Oldest)</Select.Item>
            <Select.Item value='date-desc'>Date (Newest)</Select.Item>
            <Select.Item value='number-asc'>Number (A-Z)</Select.Item>
            <Select.Item value='number-desc'>Number (Z-A)</Select.Item>
            <Select.Item value='total-asc'>Total (Low-High)</Select.Item>
            <Select.Item value='total-desc'>Total (High-Low)</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
