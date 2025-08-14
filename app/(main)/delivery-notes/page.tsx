import { Suspense } from 'react';
import { RiTruckLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import { ErrorBoundary } from '@/components/error-boundary';
import Header from '@/components/header';
import { DeliveryNotesPageContent } from '@/app/(main)/delivery-notes/content';

export default function PageDeliveryNotes() {
  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiTruckLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Delivery Notes'
        description='Track your delivery notes and manage shipping status.'
      >
        <ActionButton
          className='hidden lg:flex'
          label='New Delivery Note'
          href='/delivery-notes/new'
        />
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <ErrorBoundary context='delivery-notes'>
          <Suspense
            fallback={
              <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
                Loading...
              </div>
            }
          >
            <DeliveryNotesPageContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
