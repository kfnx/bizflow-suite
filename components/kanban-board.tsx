'use client';

import {
  RiBillLine,
  RiBuildingLine,
  RiFileTextLine,
  RiShipLine,
  RiStoreLine,
  RiTimer2Line,
  RiTruckLine,
  RiUser3Line,
} from '@remixicon/react';

import { formatCurrency } from '@/utils/number-formatter';
import { useKanban } from '@/hooks/use-kanban';

interface KanbanCardProps {
  id: string;
  label: string;
  status: string;
  amount?: number;
  customer?: string;
  supplier?: string;
  branch?: string;
  href: string;
}

// Status color mapping using design system colors
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    draft: 'bg-faded-lighter text-faded-base',
    submitted: 'bg-information-lighter text-information-base',
    approved: 'bg-success-lighter text-success-base',
    sent: 'bg-information-lighter text-information-base',
    accepted: 'bg-success-lighter text-success-base',
    rejected: 'bg-error-lighter text-error-base',
    revised: 'bg-warning-lighter text-warning-base',
    paid: 'bg-success-lighter text-success-base',
    void: 'bg-faded-lighter text-faded-base',
    overdue: 'bg-error-lighter text-error-base',
    pending: 'bg-warning-lighter text-warning-base',
    in_transit: 'bg-information-lighter text-information-base',
    delivered: 'bg-success-lighter text-success-base',
    cancelled: 'bg-error-lighter text-error-base',
  };

  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-text-sub-600';
};

// Format status label
const formatStatusLabel = (status: string): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function KanbanCard({
  label,
  amount,
  status,
  customer,
  supplier,
  branch,
  href,
  id,
}: KanbanCardProps) {
  const entity = customer || supplier;
  const isSupplier = !!supplier;
  const amountOrBranch = amount || branch;
  const isDeliveryNotes = !!branch;

  return (
    <div className='hover:shadow-md group relative w-full cursor-pointer rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 transition-all'>
      <a href={href} className='focus:outline-none'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-start justify-between gap-4'>
            <p className='text-sm font-bold text-text-sub-600'>{label}</p>
            <div
              className={`text-xs inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 font-medium ${getStatusColor(status)}`}
            >
              {formatStatusLabel(status)}
            </div>
          </div>
          {amountOrBranch && (
            <div className='text-sm flex items-center gap-2 text-text-sub-600'>
              {isDeliveryNotes ? (
                <>
                  <RiStoreLine className='size-4 flex-shrink-0' />
                  <span className='truncate'>{amountOrBranch}</span>
                </>
              ) : (
                <p className='text-lg font-bold text-blue-600'>
                  {formatCurrency(amount ?? 0)}
                </p>
              )}
            </div>
          )}
          {entity && (
            <div className='text-sm flex items-center gap-2 text-text-sub-600'>
              {isSupplier ? (
                <RiBuildingLine className='size-4 flex-shrink-0' />
              ) : (
                <RiUser3Line className='size-4 flex-shrink-0' />
              )}
              <span className='truncate'>{entity}</span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  cards: KanbanCardProps[];
}

function KanbanColumn({ title, icon: Icon, cards }: KanbanColumnProps) {
  return (
    <div className='flex h-full min-w-[280px] flex-shrink-0 flex-col rounded-lg border border-stroke-soft-200 bg-bg-weak-50'>
      <div className='sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-lg border-b border-stroke-soft-200 bg-bg-weak-50 p-4'>
        <div className='flex items-center gap-2'>
          <Icon className='size-5 text-text-sub-600' />
          <h3 className='font-bold text-text-sub-600'>{title}</h3>
        </div>
        <span className='text-sm rounded-full bg-stroke-soft-200 px-2.5 py-0.5 font-semibold text-text-sub-600'>
          {cards.length}
        </span>
      </div>
      <div className='flex-1 space-y-3 overflow-y-auto p-3'>
        {cards.length > 0 ? (
          cards.map((card) => <KanbanCard key={card.id} {...card} />)
        ) : (
          <div className='text-sm px-4 py-10 text-center text-text-sub-600'>
            <p>No items in this column.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className='w-full animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-start justify-between'>
          <div className='bg-gray-200 h-4 w-3/5 rounded-md'></div>
          <div className='bg-gray-200 h-5 w-1/4 rounded-full'></div>
        </div>
        <div className='bg-gray-200 h-6 w-1/2 rounded-md'></div>
        <div className='bg-gray-200 h-4 w-4/5 rounded-md'></div>
      </div>
    </div>
  );
}

function SkeletonColumn() {
  return (
    <div className='min-w-[280px] flex-shrink-0 rounded-lg border border-stroke-soft-200 bg-bg-weak-50'>
      <div className='border-b border-stroke-soft-200 p-4'>
        <div className='flex items-center gap-2'>
          <div className='bg-gray-200 size-5 rounded-full'></div>
          <div className='bg-gray-200 h-6 w-3/4 animate-pulse rounded'></div>
        </div>
      </div>
      <div className='space-y-3 p-3'>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { data, isLoading, error } = useKanban();

  if (isLoading) {
    return (
      <div className='flex h-full flex-col'>
        <div className='bg-bg-weak-0 flex flex-1 gap-5 overflow-x-auto rounded-lg p-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonColumn key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600'>Error loading dashboard data</p>
          <p className='text-text-sub-600'>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <p className='text-text-sub-600'>No data available</p>
      </div>
    );
  }

  const transformQuotations = (quotations: any[]): KanbanCardProps[] => {
    return quotations.map((q) => ({
      id: q.id,
      label: q.quotationNumber,
      amount: parseFloat(q.total || '0'),
      status: q.status || 'draft',
      customer: q.customerName || 'Unknown Customer',
      href: `/quotations/${q.id}`,
    }));
  };

  const transformInvoices = (invoices: any[]): KanbanCardProps[] => {
    return invoices.map((i) => ({
      id: i.id,
      label: i.invoiceNumber,
      amount: parseFloat(i.total || '0'),
      status: i.status || 'unpaid',
      customer: i.customerName || 'Unknown Customer',
      href: `/invoices/${i.id}`,
    }));
  };

  const transformDeliveryNotes = (deliveryNotes: any[]): KanbanCardProps[] => {
    return deliveryNotes.map((d) => ({
      id: d.id,
      label: d.deliveryNumber,
      branch: d.branchName,
      status: d.status || 'pending',
      customer: d.customerName || 'Unknown Customer',
      href: `/delivery-notes/${d.id}`,
    }));
  };

  const transformPendingQuotations = (
    pendingQuotations: any[],
  ): KanbanCardProps[] => {
    return pendingQuotations.map((pq) => ({
      id: pq.id,
      label: pq.quotationNumber,
      amount: parseFloat(pq.total || '0'),
      status: pq.status || 'submitted',
      customer: pq.customerName || 'Unknown Customer',
      href: `/quotations/${pq.id}`,
    }));
  };

  const transformPendingImports = (
    pendingImports: any[],
  ): KanbanCardProps[] => {
    return pendingImports.map((pi) => ({
      id: pi.id,
      label: pi.invoiceNumber || `IMP-${pi.id}`,
      amount: parseFloat(pi.exchangeRateRMBtoIDR || '0') * 1000000,
      status: 'pending',
      supplier: pi.supplierName || 'Unknown Supplier',
      href: `/imports/${pi.id}`,
    }));
  };

  const columns = [
    {
      id: 'quotations',
      title: 'Quotations',
      icon: RiFileTextLine,
      cards: transformQuotations(data.data.quotations || []),
    },
    {
      id: 'invoices',
      title: 'Invoices',
      icon: RiBillLine,
      cards: transformInvoices(data.data.invoices || []),
    },
    {
      id: 'deliveryNotes',
      title: 'Delivery Notes',
      icon: RiTruckLine,
      cards: transformDeliveryNotes(data.data.deliveryNotes || []),
    },
    {
      id: 'pendingQuotations',
      title: 'Pending Quotations',
      icon: RiTimer2Line,
      cards: transformPendingQuotations(data.data.pendingQuotations || []),
    },
    {
      id: 'pendingImports',
      title: 'Pending Imports',
      icon: RiShipLine,
      cards: transformPendingImports(data.data.pendingImports || []),
    },
  ];

  return (
    <div className='flex h-[calc(100vh-100px)] flex-col'>
      <div className='bg-bg-weak-0 flex flex-1 gap-5 overflow-x-auto rounded-lg p-4'>
        {columns.map((column) => (
          <KanbanColumn key={column.id} {...column} />
        ))}
      </div>
    </div>
  );
}
