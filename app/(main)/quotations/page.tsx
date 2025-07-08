'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RiHistoryLine } from '@remixicon/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';

import { QuotationsErrorBoundary } from './error-boundary';
import { QuotationsClient } from './quotations-client';

export default function PageQuotations() {
  const searchParams = useSearchParams();
  const [initialFilters, setInitialFilters] = useState({
    search: '',
    status: 'all' as 'all' | QUOTATION_STATUS,
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setInitialFilters({
      search: searchParams?.get('search') || '',
      status: (searchParams?.get('status') || 'all') as
        | 'all'
        | QUOTATION_STATUS,
      sortBy: searchParams?.get('sortBy') || 'newest-first',
      page: parseInt(searchParams?.get('page') || '1'),
      limit: parseInt(searchParams?.get('limit') || '10'),
    });
  }, [searchParams]);

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiHistoryLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Quotations'
        description='Track your quotations to stay in control of your business proposals.'
      >
        <ActionButton label='New Quotation' href='/quotations/new' />
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <QuotationsErrorBoundary>
          <QuotationsClient initialFilters={initialFilters} />
        </QuotationsErrorBoundary>
      </div>
    </>
  );
}
