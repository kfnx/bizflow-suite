import { Suspense } from 'react';
import { RiBillLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { ErrorBoundary } from '@/components/error-boundary';
import Header from '@/components/header';

import { InvoicesPageContent } from './content';

export default function PageInvoices() {
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
        <PermissionGate permission='invoices:create'>
          <ActionButton label='New Invoice' href='/invoices/new' />
        </PermissionGate>
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <ErrorBoundary context='invoices'>
          <Suspense fallback={<div className='p-4 text-center text-text-sub-600'>Loading...</div>}>
            <InvoicesPageContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
