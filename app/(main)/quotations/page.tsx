import { Suspense } from 'react';
import { RiHistoryLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import { ErrorBoundary } from '@/components/error-boundary';
import Header from '@/components/header';

import { QuotationsPageContent } from './content';

export default function PageQuotations() {
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
        <ErrorBoundary context='quotations'>
          <Suspense fallback={<div className='p-4 text-center text-text-sub-600'>Loading...</div>}>
            <QuotationsPageContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
