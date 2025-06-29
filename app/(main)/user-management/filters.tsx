'use client';

import { useState, useCallback, useEffect } from 'react';
import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';
import { atom, useAtom } from 'jotai';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

type UserStatus = 'all' | 'staff' | 'manager' | 'director';
type UserActiveStatus = 'all' | 'active' | 'inactive';

export const filteredUserStatusAtom = atom<UserStatus>('all');

interface FiltersProps {
  onFiltersChange?: (filters: {
    search: string;
    role: UserStatus;
    status: UserActiveStatus;
    sortBy: string;
  }) => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [filteredUserStatus, setFilteredUserStatus] = useAtom(
    filteredUserStatusAtom,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserActiveStatus>('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange?.({
        search: searchQuery,
        role: filteredUserStatus,
        status: statusFilter,
        sortBy,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filteredUserStatus, statusFilter, sortBy, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleRoleChange = useCallback((value: string) => {
    setFilteredUserStatus(value as UserStatus);
  }, [setFilteredUserStatus]);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value as UserActiveStatus);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  return (
    <div className='flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3'>
      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button type='button'>
            <RiFilter3Fill className='size-5 text-text-soft-400' />
          </button>
        </Input.Wrapper>
      </Input.Root>

      <SegmentedControl.Root
        value={filteredUserStatus}
        onValueChange={handleRoleChange}
        className='lg:w-96'
      >
        <SegmentedControl.List className='w-full'>
          <SegmentedControl.Trigger value='all'>All</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='staff'>
            Staff
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='manager'>
            Manager
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='director'>
            Director
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='hidden flex-wrap gap-3 min-[560px]:flex-nowrap lg:flex'>
        <Input.Root size='small' className='w-[300px]'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input
              placeholder='Search users...'
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Kbd.Root>
              <IconCmd className='size-2.5' />1
            </Kbd.Root>
          </Input.Wrapper>
        </Input.Root>

        <Select.Root size='small' value={statusFilter} onValueChange={handleStatusChange}>
          <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
            <Select.TriggerIcon as={RiSortDesc} />
            <Select.Value placeholder='Status' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='all'>All Status</Select.Item>
            <Select.Item value='active'>Active</Select.Item>
            <Select.Item value='inactive'>Inactive</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root size='small' value={sortBy} onValueChange={handleSortChange}>
          <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
            <Select.TriggerIcon as={RiSortDesc} />
            <Select.Value placeholder='Sort by' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='date-asc'>Date (Oldest)</Select.Item>
            <Select.Item value='date-desc'>Date (Newest)</Select.Item>
            <Select.Item value='name-asc'>Name (A-Z)</Select.Item>
            <Select.Item value='name-desc'>Name (Z-A)</Select.Item>
            <Select.Item value='email-asc'>Email (A-Z)</Select.Item>
            <Select.Item value='email-desc'>Email (Z-A)</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
