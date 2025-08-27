'use client';

import {
  RiBillLine,
  RiBox1Line,
  RiFileTextLine,
  RiTruckLine,
} from '@remixicon/react';

import { useSummaryCounts } from '@/hooks/use-summary-counts';

interface CountCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

function CountCard({ title, count, icon: Icon, href }: CountCardProps) {
  return (
    <a
      href={href}
      className='shadow-sm hover:border-stroke-soft-300 hover:shadow-md group block rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 transition-all'
    >
      <div className='flex items-center gap-4'>
        <div className='group-hover:bg-bg-weak-100 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-inset ring-stroke-soft-200 transition-colors'>
          <Icon className='h-6 w-6 text-text-sub-600' />
        </div>
        <div className='flex-1'>
          <p className='text-sm font-medium text-text-sub-600'>{title}</p>
          <p className='text-3xl font-bold text-text-sub-600'>
            {count.toLocaleString()}
          </p>
        </div>
      </div>
    </a>
  );
}

export function SummaryCountCards() {
  const { data: summaryData, isLoading, error } = useSummaryCounts();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='shadow-sm animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'
          >
            <div className='flex items-center gap-4'>
              <div className='bg-bg-weak-100 h-12 w-12 rounded-full' />
              <div className='flex-1'>
                <div className='bg-bg-weak-100 mb-2 h-4 w-20 rounded' />
                <div className='bg-bg-weak-100 h-8 w-16 rounded' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='shadow-sm rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <div className='text-center text-error-base'>
          Error loading summary counts: {error.message}
        </div>
      </div>
    );
  }

  if (!summaryData?.data) {
    return null;
  }

  const { data: counts } = summaryData;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <CountCard
        title='Quotations'
        count={counts.quotations}
        icon={RiFileTextLine}
        href='/quotations'
      />
      <CountCard
        title='Invoices'
        count={counts.invoices}
        icon={RiBillLine}
        href='/invoices'
      />
      <CountCard
        title='Deliveries'
        count={counts.deliveryNotes}
        icon={RiTruckLine}
        href='/delivery-notes'
      />
      <CountCard
        title='Products'
        count={counts.products}
        icon={RiBox1Line}
        href='/products'
      />
    </div>
  );
}
