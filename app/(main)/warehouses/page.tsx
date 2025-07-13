import { Suspense } from 'react';
import { RiStoreLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import { ErrorBoundary } from '@/components/error-boundary';
import Header from '@/components/header';

import { WarehousesPageContent } from './content';

export default function PageWarehouses() {
  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiStoreLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Warehouses'
        description='Manage warehouse locations and inventory.'
      >
        <ActionButton label='New Warehouse' href='/warehouses/new' />
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <ErrorBoundary context='warehouses'>
          <Suspense
            fallback={
              <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
                Loading...
              </div>
            }
          >
            <WarehousesPageContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
