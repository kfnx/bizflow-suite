import { Suspense } from 'react';
import { RiHistoryLine } from '@remixicon/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';

import { QuotationsErrorBoundary } from './error-boundary';
import { QuotationsClient } from './quotations-client';
import { QuotationsTableSkeleton } from './quotations-skeleton';

interface PageProps {
  searchParams?: {
    search?: string;
    status?: string;
    sortBy?: string;
    page?: string;
    limit?: string;
  };
}

export default function PageQuotations({ searchParams }: PageProps) {
  const initialFilters = {
    search: searchParams?.search || '',
    status: (searchParams?.status || 'all') as 'all' | QUOTATION_STATUS,
    sortBy: searchParams?.sortBy || 'newest-first',
    page: parseInt(searchParams?.page || '1'),
    limit: parseInt(searchParams?.limit || '10'),
  };

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
          <Suspense fallback={<QuotationsTableSkeleton />}>
            <QuotationsClient initialFilters={initialFilters} />
          </Suspense>
        </QuotationsErrorBoundary>
      </div>
    </>
  );
}
