'use client';

import { useInvoiceDetail } from '@/hooks/use-invoices';
import { InvoiceDetails } from '@/components/invoices/invoice-details';
import { InvoiceHeader } from '@/components/invoices/invoice-header';
import { InvoiceLineItemsTable } from '@/components/invoices/line-items-table';

interface InvoiceDetailProps {
  id: string;
}

export function InvoiceDetail({ id }: InvoiceDetailProps) {
  const { data, isLoading, error } = useInvoiceDetail(id);

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-red-600'>Error: {error.message}</p>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Invoice not found</p>
      </div>
    );
  }

  const invoice = data.data;

  return (
    <div className='space-y-6 p-6'>
      <InvoiceHeader invoice={invoice} />
      <InvoiceDetails invoice={invoice} />
      <InvoiceLineItemsTable invoice={invoice} />
    </div>
  );
}
