'use client';

import * as React from 'react';
import {
  RiEditLine,
  RiFileTextLine,
  RiMailSendLine,
  RiMoreLine,
} from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';

import { formatDate } from '@/utils/date-formatter';
import {
  useQuotations,
  useSendQuotation,
  type Quotation,
} from '@/hooks/use-quotations';
import * as Button from '@/components/ui/button';
import {
  DataTable,
  getSortingIcon,
  type PaginationInfo,
} from '@/components/ui/data-table';
import * as Dropdown from '@/components/ui/dropdown';
import { QuotationStatusBadge } from '@/components/quotation-status-badge';

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
};

function ActionCell({ row }: { row: any }) {
  const sendQuotationMutation = useSendQuotation();

  const handleEditQuotation = () => {
    if (row.original.status !== 'draft') {
      alert('Only draft quotations can be edited');
      return;
    }
    window.location.href = `/quotations/${row.original.id}/edit`;
  };

  const handleViewDetails = () => {
    window.location.href = `/quotations/${row.original.id}`;
  };

  const handleSend = async () => {
    if (row.original.status !== 'approved') {
      alert('Only approved quotations can be sent');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send quotation ${row.original.quotationNumber} to the customer?`,
      )
    ) {
      return;
    }

    try {
      await sendQuotationMutation.mutateAsync(row.original.id);
      alert('Quotation sent successfully!');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to send quotation',
      );
    }
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root
          variant='neutral'
          mode='ghost'
          size='xsmall'
          className='h-8 w-8 p-0'
        >
          <RiMoreLine className='size-4' />
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={handleViewDetails}>
          <RiFileTextLine className='size-4' />
          View Details
        </Dropdown.Item>
        {row.original.status === 'approved' && (
          <Dropdown.Item
            onClick={handleSend}
            disabled={sendQuotationMutation.isPending}
          >
            <RiMailSendLine className='size-4' />
            Send to Customer
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onClick={handleEditQuotation}
          disabled={row.original.status !== 'draft'}
        >
          <RiEditLine className='size-4' />
          Edit Quotation
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

const createColumns = (): ColumnDef<Quotation>[] => [
  {
    id: 'quotation',
    accessorKey: 'quotationNumber',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Quotation
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='flex flex-col'>
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.quotationNumber}
          </div>
          {row.original.notes && (
            <div className='line-clamp-1 text-paragraph-xs text-text-soft-400'>
              {row.original.notes}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: 'customer',
    accessorKey: 'customerName',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Customer
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <div className='flex flex-col'>
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.customerName}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {row.original.customerCode}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'quotationDate',
    accessorKey: 'quotationDate',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Date
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {formatDate(row.original.quotationDate)}
      </div>
    ),
  },
  {
    id: 'validUntil',
    accessorKey: 'validUntil',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Valid Until
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {formatDate(row.original.validUntil)}
      </div>
    ),
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5 text-right'>
        Total
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-right'>
        <div className='flex flex-col'>
          <div className='text-paragraph-sm text-text-sub-600'>
            {formatCurrency(row.original.total, row.original.currency)}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {formatCurrency(row.original.subtotal, row.original.currency)}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Status
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <QuotationStatusBadge
          status={row.original.status as any}
          size='medium'
        />
      );
    },
  },
  {
    id: 'createdBy',
    accessorKey: 'createdByUser',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Created By
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.createdByUser}
        </div>
        <div className='text-paragraph-xs text-text-soft-400'>
          {formatDate(row.original.createdAt)}
        </div>
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
    meta: {
      className: 'px-5 w-0',
    },
  },
];

interface QuotationsTableProps {
  filters?: {
    search?: string;
    status?: string;
    customerId?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  };
  onPreview?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function QuotationsTable({
  filters,
  onPreview,
  onPageChange,
  onLimitChange,
}: QuotationsTableProps) {
  const { data, isLoading, error } = useQuotations(filters);

  const columns = React.useMemo(() => createColumns(), []);

  const handleRowClick = React.useCallback(
    (quotation: Quotation) => {
      if (onPreview) {
        onPreview(quotation.id);
      }
    },
    [onPreview],
  );

  const pagination: PaginationInfo | undefined = data?.pagination
    ? {
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }
    : undefined;

  const emptyState = {
    icon: RiFileTextLine,
    title: 'No quotations found',
    description:
      filters?.search || filters?.status || filters?.customerId
        ? 'No quotations match your current filters. Try adjusting your search criteria.'
        : 'Get started by creating a new quotation.',
    action:
      !filters?.search && !filters?.status && !filters?.customerId
        ? {
            label: 'Create Quotation',
            onClick: () => (window.location.href = '/quotations/new'),
          }
        : undefined,
  };

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      emptyState={emptyState}
      showRowDividers={true}
      initialSorting={[
        {
          id: 'createdBy',
          desc: true,
        },
      ]}
    />
  );
}
