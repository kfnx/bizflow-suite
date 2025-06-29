'use client';

import { useEffect, useState } from 'react';
import { RiHistoryLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import {
  QuotationsTable,
  QuotationTablePagination,
  type QuotationTableData,
} from '@/components/quotations-table';

import { Filters } from './filters';
import { TransactionsTable, transactions } from '@/components/transactions-table';

export default function PageQuotations() {
  const [quotations, setQuotations] = useState<QuotationTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quotations');
      if (!response.ok) {
        throw new Error('Failed to fetch quotations');
      }
      const data = await response.json();
      setQuotations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    console.log('View quotation:', id);
    // TODO: Navigate to quotation detail page
  };

  const handleEdit = (id: string) => {
    console.log('Edit quotation:', id);
    // TODO: Navigate to quotation edit page
  };

  const handleDelete = (id: string) => {
    console.log('Delete quotation:', id);
    // TODO: Show confirmation dialog and delete quotation
  };

  const HeaderComponent = () => {
    return (
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiHistoryLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Quotations'
        description='Track your quotations to stay in control of your business proposals.'
      >
        <ActionButton className='hidden lg:flex' label='New Quotation' href='/quotations/new' />
      </Header>
    );
  };

  if (loading) {
    return (
      <>
        <HeaderComponent />

        <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
          <Filters />
          <div className='flex items-center justify-center py-12'>
            <div className='text-text-sub-600'>Loading quotations...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderComponent />

        <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
          <Filters />
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='text-text-danger-600 mb-2'>Error loading quotations</div>
              <div className='mb-4 text-text-sub-600'>{error}</div>
              <Button.Root onClick={fetchQuotations} variant='primary'>
                Try Again
              </Button.Root>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderComponent />

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters />
        {quotations.length > 0 ? (
          <>
            <QuotationsTable
              data={quotations}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <TransactionsTable data={transactions} />
            <QuotationTablePagination />
          </>
        ) : (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='mb-2 text-text-sub-600'>No quotations found</div>
              <div className='mb-4 text-text-sub-600'>
                Create your first quotation to get started.
              </div>
              <ActionButton label='Create Quotation' href='/quotations/new' />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
