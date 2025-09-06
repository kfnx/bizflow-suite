'use client';

import {
  RiBillLine,
  RiBuildingLine,
  RiFileTextLine,
  RiMore2Fill,
  RiShipLine,
  RiTimer2Line,
  RiTruckLine,
  RiUser3Line,
} from '@remixicon/react';

import {
  useSummaryCounts,
  type SummaryCountItem,
} from '@/hooks/use-summary-counts';

interface KanbanCardProps {
  id: string;
  label: string;
  amount: number;
  status: string;
  customer?: string;
  supplier?: string;
  href: string;
}

const mockData = {
  quotations: [
    {
      id: 'Q-001',
      label: 'QUO/2023/001',
      amount: 15000000,
      status: 'approved',
      customer: 'PT Jaya Abadi',
      href: '/quotations/Q-001',
    },
    {
      id: 'Q-002',
      label: 'QUO/2023/002',
      amount: 8500000,
      status: 'sent',
      customer: 'CV Mitra Usaha',
      href: '/quotations/Q-002',
    },
    {
      id: 'Q-003',
      label: 'QUO/2023/003',
      amount: 22000000,
      status: 'draft',
      customer: 'PT Sinar Mentari',
      href: '/quotations/Q-003',
    },
  ],
  invoices: [
    {
      id: 'I-001',
      label: 'INV/2023/001',
      amount: 12500000,
      status: 'paid',
      customer: 'PT Sukses Selalu',
      href: '/invoices/I-001',
    },
    {
      id: 'I-002',
      label: 'INV/2023/002',
      amount: 5000000,
      status: 'overdue',
      customer: 'PT Jaya Abadi',
      href: '/invoices/I-002',
    },
  ],
  deliveryNotes: [
    {
      id: 'D-001',
      label: 'DO/2023/001',
      amount: 15000000,
      status: 'delivered',
      customer: 'PT Jaya Abadi',
      href: '/delivery-notes/D-001',
    },
    {
      id: 'D-002',
      label: 'DO/2023/002',
      amount: 3500000,
      status: 'in_transit',
      customer: 'CV Maju Jaya',
      href: '/delivery-notes/D-002',
    },
    {
      id: 'D-003',
      label: 'DO/2023/003',
      amount: 9800000,
      status: 'pending',
      customer: 'PT Cipta Karya',
      href: '/delivery-notes/D-003',
    },
    {
      id: 'D-004',
      label: 'DO/2023/004',
      amount: 4200000,
      status: 'cancelled',
      customer: 'UD Berkah',
      href: '/delivery-notes/D-004',
    },
  ],
  pendingQuotations: [
    {
      id: 'PQ-001',
      label: 'PQUO/2023/001',
      amount: 7500000,
      status: 'revised',
      customer: 'PT Angkasa Raya',
      href: '/pending-quotations/PQ-001',
    },
  ],
  pendingImports: [
    {
      id: 'PI-001',
      label: 'IMP/2023/001',
      amount: 120000000,
      status: 'pending',
      supplier: 'Global Supplies Inc.',
      href: '/pending-imports/PI-001',
    },
    {
      id: 'PI-002',
      label: 'IMP/2023/002',
      amount: 85000000,
      status: 'in_transit',
      supplier: 'Shenzhen Tech Co.',
      href: '/pending-imports/PI-002',
    },
  ],
};

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

function KanbanCard({
  label,
  amount,
  status,
  customer,
  supplier,
  href,
  id,
}: KanbanCardProps) {
  const entity = customer || supplier;
  const isSupplier = !!supplier;

  return (
    <div className='shadow-sm hover:shadow-md w-full cursor-pointer rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 transition-all'>
      <div className='flex flex-col gap-3'>
        {/* Header Card: Label dan Harga */}
        <p className='font-bold text-text-sub-600'>{label}</p>

        {/* Harga */}
        <p className='text-xl font-bold text-primary-base'>
          {formatCurrency(amount)}
        </p>

        {/* Customer/Supplier Info */}
        <div className='text-sm text-text-soft-500 flex items-center gap-2'>
          {isSupplier ? (
            <RiBuildingLine className='h-4 w-4 shrink-0' />
          ) : (
            <RiUser3Line className='h-4 w-4 shrink-0' />
          )}
          <span className='truncate'>{entity}</span>
        </div>

        {/* Status Badge */}
        <div className='flex justify-end'>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-paragraph-xs font-medium ${getStatusColor(status)}`}
          >
            {formatStatusLabel(status)}
          </span>
        </div>
      </div>
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
    <div className='flex h-full min-w-[230px] max-w-[230px] flex-col rounded-lg border border-stroke-soft-200 bg-bg-weak-50'>
      {/* Header Kolom */}
      <div className='sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-lg border-b border-stroke-soft-200 bg-bg-weak-50 p-4'>
        <div className='flex items-center gap-2'>
          <Icon className='h-5 w-5 text-text-sub-600' />
          <h3 className='font-bold text-text-sub-600'>{title}</h3>
        </div>
        <span className='text-sm rounded-full bg-stroke-soft-200 px-2.5 py-0.5 font-semibold text-text-sub-600'>
          {cards.length}
        </span>
      </div>

      {/* Daftar Card */}
      <div className='flex-1 space-y-3 overflow-y-auto p-3'>
        {cards.length > 0 ? (
          cards.map((card) => <KanbanCard key={card.id} {...card} />)
        ) : (
          <div className='text-sm px-4 py-10 text-center text-text-soft-400'>
            <p>No items in this column.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  // Ganti dengan state dari hook Anda (isLoading, error, data)
  const isLoading = false;
  const error = null;
  const data = mockData;

  // Tampilan Skeleton saat Loading
  if (isLoading) {
    return (
      <div className='flex gap-6 overflow-x-auto p-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='min-w-[320px] animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-weak-50'
          >
            <div className='border-b border-stroke-soft-200 p-4'>
              <div className='bg-bg-weak-100 h-6 w-3/4 rounded'></div>
            </div>
            <div className='space-y-3 p-3'>
              <div className='bg-bg-weak-100 h-24 rounded-lg'></div>
              <div className='bg-bg-weak-100 h-24 rounded-lg'></div>
              <div className='bg-bg-weak-100 h-24 rounded-lg'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Daftar kolom Kanban
  const columns = [
    {
      id: 'quotations',
      title: 'Quotations',
      icon: RiFileTextLine,
      cards: data.quotations,
    },
    {
      id: 'invoices',
      title: 'Invoices',
      icon: RiBillLine,
      cards: data.invoices,
    },
    {
      id: 'deliveryNotes',
      title: 'Delivery Notes',
      icon: RiTruckLine,
      cards: data.deliveryNotes,
    },
    {
      id: 'pendingQuotations',
      title: 'Pending Quotations',
      icon: RiTimer2Line,
      cards: data.pendingQuotations,
    },
    {
      id: 'pendingImports',
      title: 'Pending Imports',
      icon: RiShipLine,
      cards: data.pendingImports,
    },
  ];

  return (
    <div className='flex h-[calc(100vh-100px)] flex-col overflow-x-auto'>
      <h1 className='text-2xl px-4 pb-4 font-bold text-text-sub-600'>
        Sales & Operation Dashboard
      </h1>
      <div className='bg-bg-weak-0 flex flex-1 gap-5 overflow-x-auto p-4'>
        {columns.map((column) => (
          <KanbanColumn key={column.id} {...column} />
        ))}
      </div>
    </div>
  );
}
