'use client';

import {
  RiErrorWarningLine,
  RiFileSearchLine,
  RiTruckLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useDeliveryNoteDetail } from '@/hooks/use-delivery-notes';
import { BackButton } from '@/components/back-button';
import { DeliveryNoteHeader } from '@/components/delivery-notes/delivery-note-header';
import { DeliveryNotePDF } from '@/components/delivery-notes/pdf';
import Header from '@/components/header';
import { SimplePageLoading } from '@/components/simple-page-loading';

interface DeliveryNoteDetailProps {
  id: string;
}

export function DeliveryNoteDetail({ id }: DeliveryNoteDetailProps) {
  const { data, isLoading, error } = useDeliveryNoteDetail(id);

  if (isLoading) {
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center'>
        <SimplePageLoading>Loading delivery note details...</SimplePageLoading>
      </div>
    );
  }

  if (error) {
    // Handle 404 case specifically
    if (error.message === 'Delivery note not found') {
      return (
        <div className='flex min-h-[400px] flex-1 items-center justify-center'>
          <div className='max-w-md text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200'>
                <RiFileSearchLine className='size-6 text-text-sub-600' />
              </div>
            </div>
            <h3 className='text-lg mb-2 font-semibold text-text-strong-950'>
              404 - Delivery Note Not Found
            </h3>
            <p className='mb-4 text-text-sub-600'>
              The delivery note you&apos;re looking for doesn&apos;t exist or
              may have been deleted.
            </p>
            <a
              href='/delivery-notes'
              className='text-primary-600 hover:text-primary-700 text-sm font-medium'
            >
              Back to Delivery Notes
            </a>
          </div>
        </div>
      );
    }

    // Handle other errors
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center'>
        <div className='max-w-md text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='bg-error-50 ring-error-100 flex size-12 items-center justify-center rounded-full ring-1'>
              <RiErrorWarningLine className='text-error-600 size-6' />
            </div>
          </div>
          <h3 className='text-lg mb-2 font-semibold text-text-strong-950'>
            Error Loading Delivery Note
          </h3>
          <p className='mb-4 text-text-sub-600'>
            {error.message || 'Failed to load delivery note details'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='text-primary-600 hover:text-primary-700 text-sm font-medium'
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null; // This should not happen since we handle errors above
  }

  const deliveryNote = data;

  return (
    <div className='min-h-screen'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiTruckLine className='size-6' />
          </div>
        }
        title={deliveryNote.deliveryNumber}
        description={`${deliveryNote.customer?.name || 'Unknown Customer'} • ${formatDate(deliveryNote.deliveryDate)}`}
      >
        <BackButton href='/delivery-notes' label='Back to Delivery Notes' />
      </Header>
      {/* Main Content */}
      <div className='mx-auto max-w-5xl space-y-6 p-6'>
        <DeliveryNoteHeader deliveryNote={deliveryNote} />
        <DeliveryNotePDF deliveryNote={deliveryNote} />
      </div>
    </div>
  );
}
