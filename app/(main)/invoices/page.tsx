'use client';

import { useCallback, useState } from 'react';
import { RiBillLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import { InvoicesTable } from '@/components/invoices-table';

import { Filters, type InvoicesFilters } from './filters';

export default function PageInvoices() {
  const [filters, setFilters] = useState<InvoicesFilters>({
    search: '',
    status: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = useCallback((newFilters: InvoicesFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBillLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Invoices'
        description='Manage your invoices and track payment status.'
      >
        <ActionButton label='New Invoice' href='/invoices/new' />
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters onFiltersChange={handleFiltersChange} />
        <InvoicesTable
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </>
  );
}
