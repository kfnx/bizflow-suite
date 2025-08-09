'use client';

import {
  RiErrorWarningLine,
  RiFileAddLine,
  RiFileSearchLine,
} from '@remixicon/react';

import { useQuotationDetail } from '@/hooks/use-quotations';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { QuotationPDF } from '@/components/quotations/pdf';
import { QuotationHeader } from '@/components/quotations/quotation-header';
import { SimplePageLoading } from '@/components/simple-page-loading';

interface QuotationDetailProps {
  id: string;
}

export function QuotationDetail({ id }: QuotationDetailProps) {
  const { data, isLoading, error } = useQuotationDetail(id);

  if (isLoading) {
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center'>
        <SimplePageLoading>Loading quotation details...</SimplePageLoading>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center'>
        <div className='max-w-md text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='bg-error-50 ring-error-100 flex size-12 items-center justify-center rounded-full ring-1'>
              <RiErrorWarningLine className='text-error-600 size-6' />
            </div>
          </div>
          <h3 className='text-lg mb-2 font-semibold text-text-strong-950'>
            Error Loading Quotation
          </h3>
          <p className='mb-4 text-text-sub-600'>
            {error.message || 'Failed to load quotation details'}
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

  if (!data?.data) {
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center'>
        <div className='max-w-md text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='flex size-12 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200'>
              <RiFileSearchLine className='size-6 text-text-sub-600' />
            </div>
          </div>
          <h3 className='text-lg mb-2 font-semibold text-text-strong-950'>
            Quotation Not Found
          </h3>
          <p className='mb-4 text-text-sub-600'>
            The quotation you&apos;re looking for doesn&apos;t exist or may have
            been deleted.
          </p>
          <a
            href='/quotations'
            className='text-primary-600 hover:text-primary-700 text-sm font-medium'
          >
            Back to Quotations
          </a>
        </div>
      </div>
    );
  }

  const quotation = data.data;

  return (
    <div className='min-h-screen'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiFileAddLine className='size-6' />
          </div>
        }
        title={quotation.quotationNumber}
        description={`${quotation.customerName} • ${new Date(quotation.quotationDate).toLocaleDateString()}`}
      >
        <BackButton href='/quotations' label='Back to Quotations' />
      </Header>
      {/* Main Content */}
      <div className='mx-auto max-w-5xl space-y-6 p-6'>
        <QuotationHeader quotation={quotation} />
        <QuotationPDF quotation={quotation} />
      </div>
    </div>
  );
}
