'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiCalendarLine,
  RiExpandUpDownFill,
  RiTruckLine,
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
  useDeliveryNotes,
  type DeliveryNote,
} from '@/hooks/use-delivery-notes';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import { DeliveryNotePreviewDrawer } from '@/components/delivery-notes/delivery-note-preview-drawer';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <Badge.Root variant='lighter' color='orange'>
          Pending
        </Badge.Root>
      );
    case 'delivered':
      return (
        <Badge.Root variant='lighter' color='green'>
          Delivered
        </Badge.Root>
      );
    case 'canceled':
      return (
        <Badge.Root variant='lighter' color='red'>
          Canceled
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

interface DeliveryNotesTableProps {
  filters: {
    search: string;
    status: string;
    branch?: string;
    sortBy: string;
    page?: number;
    limit?: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DeliveryNotesTable({
  filters,
  onPageChange,
  onLimitChange,
}: DeliveryNotesTableProps) {
  const { data, isLoading, error, refetch } = useDeliveryNotes(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedDeliveryNoteId, setSelectedDeliveryNoteId] = React.useState<
    string | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleRowClick = (deliveryNote: DeliveryNote) => {
    setSelectedDeliveryNoteId(deliveryNote.id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDeliveryNoteId(null);
  };

  const columns: ColumnDef<DeliveryNote>[] = [
    {
      id: 'deliveryNumber',
      accessorKey: 'deliveryNumber',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Delivery Number
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
            {row.original.deliveryNumber}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {row.original.invoice?.invoiceNumber && (
              <>From: {row.original.invoice.invoiceNumber}</>
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
      id: 'deliveryDate',
      accessorKey: 'deliveryDate',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Delivery Date
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
          <RiCalendarLine className='size-4 text-text-sub-600' />
          <div className='text-paragraph-sm text-text-sub-600'>
            {new Date(row.original.deliveryDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      id: 'deliveryMethod',
      accessorKey: 'deliveryMethod',
      header: 'Method',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <RiTruckLine className='size-4 text-text-sub-600' />
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.deliveryMethod || '-'}
          </div>
        </div>
      ),
    },
    {
      id: 'driver',
      accessorKey: 'driverName',
      header: 'Driver',
      cell: ({ row }) => (
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.driverName || '-'}
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
    return <Loading className='py-8' />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-red-600'>
          Error loading delivery notes: {error.message}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          No delivery notes found
        </div>
        <div className='text-paragraph-xs text-text-soft-400'>
          Try adjusting your filters or create a new delivery note
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[960px]'>
        <Table.Header className='whitespace-nowrap'>
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
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell
                  key={cell.id}
                  className={
                    cell.column.id !== 'actions' ? 'cursor-pointer' : ''
                  }
                  onClick={
                    cell.column.id !== 'actions'
                      ? () => handleRowClick(row.original)
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination moved to page-level container to match quotations structure */}

      {/* Delivery Note Preview Drawer */}
      <DeliveryNotePreviewDrawer
        deliveryNoteId={selectedDeliveryNoteId}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DeliveryNotesTablePaginationProps {
  data: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DeliveryNotesTablePagination({
  data,
  onPageChange,
  onLimitChange,
}: DeliveryNotesTablePaginationProps) {
  const handlePreviousPage = React.useCallback(() => {
    if (data && data.page > 1) {
      onPageChange?.(data.page - 1);
    }
  }, [data, onPageChange]);

  const handleNextPage = React.useCallback(() => {
    if (data && data.page < data.totalPages) {
      onPageChange?.(data.page + 1);
    }
  }, [data, onPageChange]);

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
    if (!data) return [];

    const { page, totalPages } = data;
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
  }, [data]);

  const { page, limit, total, totalPages } = data;

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
          <Pagination.NavButton
            onClick={() => handlePageSelect(1)}
            disabled={page <= 1}
          >
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton
            onClick={handlePreviousPage}
            disabled={page <= 1}
          >
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

          <Pagination.NavButton
            onClick={handleNextPage}
            disabled={page >= totalPages}
          >
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
          <Pagination.NavButton
            onClick={() => handlePageSelect(totalPages)}
            disabled={page >= totalPages}
          >
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root
            size='xsmall'
            value={limit.toString()}
            onValueChange={handleLimitSelect}
          >
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
