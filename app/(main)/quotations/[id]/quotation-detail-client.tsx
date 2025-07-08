'use client';

import { useQuotationDetail } from '@/hooks/use-quotations';

import { LineItemsTable } from './components/line-items-table';
import { QuotationDetails } from './components/quotation-details';
import { QuotationHeader } from './components/quotation-header';

interface QuotationDetailClientProps {
  id: string;
}

export function QuotationDetailClient({ id }: QuotationDetailClientProps) {
  const { data, isLoading, error } = useQuotationDetail(id);

  if (isLoading) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-red-600'>Loading...</p>
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
        <p className='text-gray-500'>Quotation not found</p>
      </div>
    );
  }

  const quotation = data.data;

  return (
    <div className='space-y-6 p-6'>
      <QuotationHeader quotation={quotation} />
      <QuotationDetails quotation={quotation} />
      <LineItemsTable quotation={quotation} />
    </div>
  );
}
