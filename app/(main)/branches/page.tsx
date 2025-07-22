'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine } from '@remixicon/react';

import type { BranchesFilters } from '@/hooks/use-branches';
import { Root as Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';

import { BranchesTable } from './branches-table';
import { Filters } from './filters';

export default function BranchesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<BranchesFilters>({});

  const handleFiltersChange = useCallback(
    (newFilters: { search: string; sortBy: string }) => {
      const apiFilters: BranchesFilters = {};

      if (newFilters.search) apiFilters.search = newFilters.search;
      if (newFilters.sortBy) apiFilters.sortBy = newFilters.sortBy;

      setFilters(apiFilters);
    },
    [],
  );

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl text-gray-900 font-semibold'>Branches</h1>
          <p className='text-sm text-gray-600'>
            Manage company branches and locations
          </p>
        </div>
        <PermissionGate permission='branches:create'>
          <Button
            className='flex items-center gap-2'
            onClick={() => router.push('/branches/new')}
          >
            <RiAddLine className='size-4' />
            Add Branch
          </Button>
        </PermissionGate>
      </div>

      {/* Branches Table */}
      <PermissionGate permission='branches:read'>
        <Filters onFiltersChange={handleFiltersChange} />
        <BranchesTable filters={filters} />
      </PermissionGate>
    </div>
  );
}
