'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiEditLine,
  RiExpandUpDownFill,
  RiEyeLine,
  RiFileTextLine,
  RiMailSendLine,
  RiMoneyDollarCircleLine,
  RiMoreLine,
  RiUserLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import {
  useDeleteInvoice,
  useInvoices,
  type Invoice,
} from '@/hooks/use-invoices';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import * as Pagination from '@/components/ui/pagination';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return (
        <Badge.Root variant='lighter' color='gray'>
          Draft
        </Badge.Root>
      );
    case 'sent':
      return (
        <Badge.Root variant='lighter' color='orange'>
          Sent
        </Badge.Root>
      );
    case 'paid':
      return (
        <Badge.Root variant='lighter' color='green'>
          Paid
        </Badge.Root>
      );
    case 'void':
      return (
        <Badge.Root variant='lighter' color='red'>
          Void
        </Badge.Root>
      );
    default:
      return (
        <Badge.Root variant='lighter' color='gray'>
          {status}
        </Badge.Root>
      );
  }
};

interface InvoicesTableProps {
  filters: {
    search: string;
    status: string;
    branch?: string;
    sortBy: string;
    page?: number;
    limit?: number;
  };
  onPreview?: (invoiceId: string) => void;
}

export function InvoicesTable({ filters, onPreview }: InvoicesTableProps) {
  const router = useRouter();
  const { data, isLoading, error } = useInvoices(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Invoice>[] = [
    {
      id: 'invoiceNumber',
      accessorKey: 'invoiceNumber',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Invoice Number
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <div className='text-text-900 text-paragraph-sm font-medium'>
            {row.original.invoiceNumber}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {row.original.quotation?.quotationNumber && (
              <>From: {row.original.quotation.quotationNumber}</>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'customer',
      accessorKey: 'customerId',
      header: 'Customer',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <RiUserLine className='size-4 text-text-sub-600' />
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.customer?.name || '-'}
          </div>
        </div>
      ),
    },
    {
      id: 'branch',
      accessorKey: 'branchName',
      header: 'Branch',
      cell: ({ row }) => (
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.branchName || '—'}
        </div>
      ),
    },
    {
      id: 'dates',
      accessorKey: 'invoiceDate',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Dates
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <div className='text-paragraph-sm text-text-sub-600'>
            {new Date(row.original.invoiceDate).toLocaleDateString()}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            Due: {new Date(row.original.dueDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      id: 'total',
      accessorKey: 'total',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
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
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.currency}{' '}
          {parseFloat(row.original.total).toLocaleString()}
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Created
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
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root mode='ghost' size='xsmall' className='h-8 w-8 p-0'>
                <RiMoreLine className='size-4' />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align='end'>
              <Dropdown.Item
                onClick={() => router.push(`/invoices/${row.original.id}`)}
              >
                <RiEyeLine className='size-4' />
                View Details
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => router.push(`/invoices/${row.original.id}/edit`)}
              >
                <RiEditLine className='size-4' />
                Edit Invoice
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-red-600'>
          Error loading invoices: {error.message}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          No invoices found
        </div>
        <div className='text-paragraph-xs text-text-soft-400'>
          Try adjusting your filters or create a new invoice
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </Table.Head>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              key={row.id}
              className='cursor-pointer hover:bg-bg-weak-50'
              onClick={() => onPreview?.(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

interface InvoicesTablePaginationProps {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function InvoicesTablePagination({
  pagination,
  onPageChange,
  onLimitChange,
}: InvoicesTablePaginationProps) {
  const handlePreviousPage = React.useCallback(() => {
    if (pagination && pagination.page > 1) {
      onPageChange?.(pagination.page - 1);
    }
  }, [pagination, onPageChange]);

  const handleNextPage = React.useCallback(() => {
    if (pagination && pagination.page < pagination.totalPages) {
      onPageChange?.(pagination.page + 1);
    }
  }, [pagination, onPageChange]);

  const handlePageSelect = React.useCallback(
    (selectedPage: number) => {
      onPageChange?.(selectedPage);
    },
    [onPageChange],
  );

  const handleLimitSelect = React.useCallback(
    (value: string) => {
      onLimitChange?.(parseInt(value));
    },
    [onLimitChange],
  );

  const pageNumbers = React.useMemo(() => {
    if (!pagination) return [];

    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [pagination]);

  if (!pagination) {
    return null;
  }

  const { page, limit, total, totalPages } = pagination;

  return (
    <div className='mt-auto'>
      <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
          onClick={handlePreviousPage}
          disabled={page <= 1}
        >
          Previous
        </Button.Root>
        <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
          Page {page} of {totalPages}
        </span>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
          onClick={handleNextPage}
          disabled={page >= totalPages}
        >
          Next
        </Button.Root>
      </div>
      <div className='mt-10 hidden items-center gap-3 lg:flex'>
        <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          Page {page} of {totalPages} ({total} total)
        </span>

        <Pagination.Root>
          <Pagination.NavButton onClick={() => handlePageSelect(1)} disabled={page <= 1}>
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton onClick={handlePreviousPage} disabled={page <= 1}>
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>

          {pageNumbers.map((pageNum, index) =>
            pageNum === '...' ? (
              <Pagination.Item key={`ellipsis-${index}`}>...</Pagination.Item>
            ) : (
              <Pagination.Item
                key={pageNum}
                current={pageNum === page}
                onClick={() => handlePageSelect(pageNum as number)}
              >
                {pageNum}
              </Pagination.Item>
            ),
          )}

          <Pagination.NavButton onClick={handleNextPage} disabled={page >= totalPages}>
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
          <Pagination.NavButton onClick={() => handlePageSelect(totalPages)} disabled={page >= totalPages}>
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root size='xsmall' value={limit.toString()} onValueChange={handleLimitSelect}>
            <Select.Trigger className='w-auto'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='10'>10 / page</Select.Item>
              <Select.Item value='25'>25 / page</Select.Item>
              <Select.Item value='50'>50 / page</Select.Item>
              <Select.Item value='100'>100 / page</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
