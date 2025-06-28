'use client';

import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';
import { atom, useAtom } from 'jotai';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type QuotationStatus = 'all' | 'draft' | 'sent' | 'accepted' | 'rejected';

export const filteredQuotationStatusAtom = atom<QuotationStatus>('all');

export function Filters() {
  const [filteredQuotationStatus, setFilteredQuotationStatus] = useAtom(
    filteredQuotationStatusAtom,
  );

  return (
    <div className='flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3'>
      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input placeholder='Search quotations...' />
          <button type='button'>
            <RiFilter3Fill className='size-5 text-text-soft-400' />
          </button>
        </Input.Wrapper>
      </Input.Root>

      <SegmentedControl.Root
        value={filteredQuotationStatus}
        onValueChange={(v) => setFilteredQuotationStatus(v as QuotationStatus)}
        className='lg:w-96'
      >
        <SegmentedControl.List className='w-full'>
          <SegmentedControl.Trigger value='all'>All</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='draft'>
            Draft
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='sent'>
            Sent
          </SegmentedControl.Trigger>
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
            <Input.Input placeholder='Search quotations...' />
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

        <Select.Root size='small'>
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
