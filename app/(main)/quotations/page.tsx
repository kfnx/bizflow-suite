'use client';

import { useCallback, useState } from 'react';
import { RiHistoryLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import {
  QuotationsTable,
  QuotationTablePagination,
} from '@/components/quotations-table';

import { Filters, type QuotationsFilters } from './filters';

export default function PageQuotations() {
  const [filters, setFilters] = useState<QuotationsFilters>({
    search: '',
    status: 'all',
    sortBy: '',
  });

  const handleFiltersChange = useCallback((newFilters: QuotationsFilters) => {
    setFilters(newFilters);
  }, []);

  const HeaderComponent = () => {
    return (
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiHistoryLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Quotations'
        description='Track your quotations to stay in control of your business proposals.'
      >
        <ActionButton
          className='hidden lg:flex'
          label='New Quotation'
          href='/quotations/new'
        />
      </Header>
    );
  };

  return (
    <>
      <HeaderComponent />

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters onFiltersChange={handleFiltersChange} />
        <QuotationsTable filters={filters} />
      </div>
    </>
  );
}
