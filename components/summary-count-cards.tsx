'use client';

import {
  RiBillLine,
  RiBox1Line,
  RiFileTextLine,
  RiTruckLine,
} from '@remixicon/react';

import {
  useSummaryCounts,
  type SummaryCountItem,
} from '@/hooks/use-summary-counts';

interface CountCardProps {
  title: string;
  data: SummaryCountItem;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

// Status color mapping using design system colors
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Quotation statuses
    draft: 'bg-faded-lighter text-faded-base',
    submitted: 'bg-information-lighter text-information-base',
    approved: 'bg-success-lighter text-success-base',
    sent: 'bg-information-lighter text-information-base',
    accepted: 'bg-success-lighter text-success-base',
    rejected: 'bg-error-lighter text-error-base',
    revised: 'bg-warning-lighter text-warning-base',

    // Invoice statuses
    paid: 'bg-success-lighter text-success-base',
    void: 'bg-faded-lighter text-faded-base',
    overdue: 'bg-error-lighter text-error-base',

    // Delivery note statuses
    pending: 'bg-warning-lighter text-warning-base',
    in_transit: 'bg-information-lighter text-information-base',
    delivered: 'bg-success-lighter text-success-base',
    cancelled: 'bg-error-lighter text-error-base',

    // Product statuses
    in_stock: 'bg-success-lighter text-success-base',
    out_of_stock: 'bg-error-lighter text-error-base',
  };

  return statusColors[status] || 'bg-faded-lighter text-faded-base';
};

// Format status label
const formatStatusLabel = (status: string): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function CountCard({ title, data, icon: Icon, href }: CountCardProps) {
  // Get top 3 statuses by count (excluding zero counts)
  const statusEntries = Object.entries(data.byStatus)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <a
      href={href}
      className='shadow-sm hover:border-stroke-soft-300 hover:shadow-md group block rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 transition-all'
    >
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex items-center gap-4 pb-2'>
          <div className='group-hover:bg-bg-weak-100 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-inset ring-stroke-soft-200 transition-colors'>
            <Icon className='h-6 w-6 text-text-sub-600' />
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium text-text-sub-600'>{title}</p>
            <p className='text-3xl font-bold text-text-sub-600'>
              {data.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status breakdown */}
        {statusEntries.length > 0 && (
          <div className='space-y-2'>
            <div className='space-y-1.5'>
              {statusEntries.map(([status, count]) => (
                <div key={status} className='flex items-center justify-between'>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-paragraph-xs font-medium ${getStatusColor(status)}`}
                  >
                    {formatStatusLabel(status)}
                  </span>
                  <span className='text-text-sub-600'>
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
              {data.total >
                statusEntries.reduce((sum, [, count]) => sum + count, 0) && (
                <div className='flex items-center justify-between'>
                  <span className='text-paragraph-xs text-text-soft-400'>
                    Others
                  </span>
                  <span className='text-sm font-medium text-text-soft-400'>
                    {(
                      data.total -
                      statusEntries.reduce((sum, [, count]) => sum + count, 0)
                    ).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
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
            <div className='space-y-4'>
              {/* Header skeleton */}
              <div className='flex items-center gap-4'>
                <div className='bg-bg-weak-100 h-12 w-12 rounded-full' />
                <div className='flex-1'>
                  <div className='bg-bg-weak-100 mb-2 h-4 w-20 rounded' />
                  <div className='bg-bg-weak-100 h-8 w-16 rounded' />
                </div>
              </div>
              {/* Status breakdown skeleton */}
              <div className='space-y-2'>
                <div className='bg-bg-weak-100 h-3 w-24 rounded' />
                <div className='space-y-1.5'>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className='flex items-center justify-between'>
                      <div className='bg-bg-weak-100 h-5 w-16 rounded-full' />
                      <div className='bg-bg-weak-100 h-4 w-8 rounded' />
                    </div>
                  ))}
                </div>
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
        data={counts.quotations}
        icon={RiFileTextLine}
        href='/quotations'
      />
      <CountCard
        title='Invoices'
        data={counts.invoices}
        icon={RiBillLine}
        href='/invoices'
      />
      <CountCard
        title='Deliveries'
        data={counts.deliveryNotes}
        icon={RiTruckLine}
        href='/delivery-notes'
      />
      <CountCard
        title='Products'
        data={counts.products}
        icon={RiBox1Line}
        href='/products'
      />
    </div>
  );
}
