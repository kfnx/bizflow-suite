'use client';

import {
  RiErrorWarningLine,
  RiFileAddLine,
  RiFileSearchLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useInvoiceDetail } from '@/hooks/use-invoices';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { InvoiceHeader } from '@/components/invoices/invoice-header';
import { InvoicePDF } from '@/components/invoices/pdf';
import { SimplePageLoading } from '@/components/simple-page-loading';

interface InvoiceDetailProps {
  id: string;
}

export function InvoiceDetail({ id }: InvoiceDetailProps) {
  const { data, isLoading, error } = useInvoiceDetail(id);

  if (isLoading) {
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center'>
        <SimplePageLoading>Loading invoice details...</SimplePageLoading>
      </div>
    );
  }

  if (error) {
    // Handle 404 case specifically
    if (error.message === 'Invoice not found') {
      return (
        <div className='flex min-h-[400px] flex-1 items-center justify-center'>
          <div className='max-w-md text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200'>
                <RiFileSearchLine className='size-6 text-text-sub-600' />
              </div>
            </div>
            <h3 className='text-lg mb-2 font-semibold text-text-strong-950'>
              404 - Invoice Not Found
            </h3>
            <p className='mb-4 text-text-sub-600'>
              The invoice you&apos;re looking for doesn&apos;t exist or may have
              been deleted.
            </p>
            <a
              href='/invoices'
              className='text-primary-600 hover:text-primary-700 text-sm font-medium'
            >
              Back to Invoices
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
            Error Loading Invoice
          </h3>
          <p className='mb-4 text-text-sub-600'>
            {error.message || 'Failed to load invoice details'}
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
    return null; // This should not happen since we handle errors above
  }

  const invoice = data.data;

  return (
    <div className='min-h-screen'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiFileAddLine className='size-6' />
          </div>
        }
        title={invoice.invoiceNumber}
        description={`${invoice.customerName} • ${formatDate(invoice.invoiceDate)}`}
      >
        <BackButton href='/invoices' label='Back to Invoices' />
      </Header>
      {/* Main Content */}
      <div className='mx-auto max-w-5xl space-y-6 p-6'>
        <InvoiceHeader invoice={invoice} />
        <InvoicePDF invoice={invoice} />
      </div>
    </div>
  );
}
