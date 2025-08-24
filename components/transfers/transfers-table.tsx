'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiBox3Line,
  RiEditLine,
  RiExchangeFundsLine,
  RiExpandUpDownFill,
  RiEyeLine,
  RiMoreLine,
  RiReceiptLine,
  RiStoreLine,
  RiTruckLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import { cn } from '@/utils/cn';
import { type Transfer } from '@/hooks/use-transfers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

const getMovementTypeIcon = (type: string) => {
  switch (type) {
    case 'in':
      return <RiTruckLine className='size-4 text-green-600' />;
    case 'out':
      return <RiBox3Line className='size-4 text-red-600' />;
    case 'transfer':
      return <RiExchangeFundsLine className='size-4 text-blue-600' />;
    case 'adjustment':
      return <RiReceiptLine className='size-4 text-yellow-600' />;
    default:
      return <RiExchangeFundsLine className='size-4 text-text-sub-600' />;
  }
};

const getMovementTypeBadge = (type: string) => {
  switch (type) {
    case 'in':
      return (
        <Badge.Root color='green' variant='lighter'>
          In
        </Badge.Root>
      );
    case 'out':
      return (
        <Badge.Root color='red' variant='lighter'>
          Out
        </Badge.Root>
      );
    case 'transfer':
      return (
        <Badge.Root color='blue' variant='lighter'>
          Transfer
        </Badge.Root>
      );
    case 'adjustment':
      return (
        <Badge.Root color='yellow' variant='lighter'>
          Adjustment
        </Badge.Root>
      );
    default:
      return (
        <Badge.Root color='gray' variant='lighter'>
          {type}
        </Badge.Root>
      );
  }
};

function ActionCell({ row }: { row: any }) {
  const handleEditTransfer = () => {
    window.location.href = `/transfers/${row.original.id}/edit`;
  };

  const handleViewDetails = () => {
    window.location.href = `/transfers/${row.original.id}`;
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
          <RiEyeLine className='size-4' />
          View Details
        </Dropdown.Item>
        <Dropdown.Item onClick={handleEditTransfer}>
          <RiEditLine className='size-4' />
          Edit Transfer
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

const createColumns = (): ColumnDef<Transfer>[] => [
  {
    id: 'transfer',
    accessorKey: 'transferNumber',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Transfer
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
        <RiBox3Line className='size-5 text-primary-base' />
        <div className='flex flex-col'>
          <div className='text-paragraph-sm font-medium text-text-strong-950'>
            {row.original.transferNumber}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.items && row.original.items.length > 0
              ? row.original.items.length > 1
                ? `${row.original.items.length} products`
                : `${row.original.items[0].productName} (${row.original.items[0].productCode})`
              : row.original.name
                ? `${row.original.name} (${row.original.productCode})`
                : 'No products'}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'movement',
    accessorKey: 'movementType',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Type
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
        {getMovementTypeIcon(row.original.movementType)}
        {getMovementTypeBadge(row.original.movementType)}
      </div>
    ),
  },
  {
    id: 'warehouses',
    header: 'Warehouses',
    cell: ({ row }) => (
      <div className='flex items-center justify-start gap-2'>
        {row.original.warehouseFromName && (
          <>
            <div className='flex items-center gap-1'>
              <RiStoreLine className='text-text-sub-400 size-4' />
              <span className='text-paragraph-sm text-text-sub-600'>
                {row.original.warehouseFromName}
              </span>
            </div>
            <RiArrowRightLine className='text-text-sub-400 size-4' />
          </>
        )}
        <div className='flex items-center gap-1'>
          <RiStoreLine className='text-text-sub-400 size-4' />
          <span className='text-paragraph-sm text-text-sub-600'>
            {row.original.warehouseToName}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'quantity',
    accessorKey: 'totalQuantity',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Total Qty
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => {
      const totalQty = row.original.totalQuantity || row.original.quantity || 0;
      const itemCount =
        row.original.itemCount ||
        row.original.items?.length ||
        (row.original.quantity ? 1 : 0);

      return (
        <div className='flex flex-col'>
          <div className='text-paragraph-sm font-medium text-text-strong-950'>
            {totalQty.toLocaleString()}
          </div>
          {itemCount > 1 && (
            <div className='text-paragraph-xs text-text-sub-600'>
              {itemCount} items
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'references',
    header: 'References',
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        {row.original.invoiceId && (
          <div className='text-paragraph-xs text-text-sub-600'>
            Invoice: {row.original.invoiceId}
          </div>
        )}
        {row.original.deliveryId && (
          <div className='text-paragraph-xs text-text-sub-600'>
            Delivery: {row.original.deliveryId}
          </div>
        )}
        {!row.original.invoiceId && !row.original.deliveryId && (
          <div className='text-paragraph-xs text-text-sub-600'>
            No references
          </div>
        )}
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
      const status = row.original.status || 'pending';
      const getStatusBadge = (status: string) => {
        switch (status) {
          case 'pending':
            return (
              <Badge.Root color='yellow' variant='lighter'>
                Pending
              </Badge.Root>
            );
          case 'approved':
            return (
              <Badge.Root color='blue' variant='lighter'>
                Approved
              </Badge.Root>
            );
          case 'completed':
            return (
              <Badge.Root color='green' variant='lighter'>
                Completed
              </Badge.Root>
            );
          case 'cancelled':
            return (
              <Badge.Root color='red' variant='lighter'>
                Cancelled
              </Badge.Root>
            );
          default:
            return (
              <Badge.Root color='gray' variant='lighter'>
                {status}
              </Badge.Root>
            );
        }
      };

      return getStatusBadge(status);
    },
  },
  {
    id: 'transferDate',
    accessorKey: 'transferDate',
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
        {new Date(
          row.original.transferDate || row.original.createdAt,
        ).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

interface TransfersTableProps {
  transfers: Transfer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  error?: Error | null;
  onTransferSelect?: (id: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function TransfersTable({
  transfers,
  pagination,
  isLoading,
  error,
  onTransferSelect,
  filters,
  onFiltersChange,
}: TransfersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo(() => createColumns(), []);

  const table = useReactTable({
    data: transfers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: pagination?.totalPages || 0,
  });

  const handleRowClick = (transfer: Transfer) => {
    onTransferSelect?.(transfer.id);
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  const handleLimitChange = (limit: number) => {
    onFiltersChange({ ...filters, limit: limit, page: 1 });
  };

  if (isLoading) {
    return (
      <div className='rounded-lg bg-bg-white-0 p-8'>
        <div className='flex items-center justify-center'>
          <div className='text-text-sub-600'>Loading transfers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg bg-bg-white-0 p-8'>
        <div className='text-center text-red-600'>
          {error.message || 'Failed to load transfers'}
        </div>
      </div>
    );
  }

  if (!transfers || transfers.length === 0) {
    return (
      <div className='rounded-lg bg-bg-white-0 p-8'>
        <div className='text-center'>
          <RiExchangeFundsLine className='text-text-sub-400 mx-auto size-12' />
          <h3 className='mt-2 text-title-h5 text-text-strong-950'>
            No transfers found
          </h3>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            {filters.search || filters.movementType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new transfer.'}
          </p>
          {!filters.search && filters.movementType === 'all' && (
            <div className='mt-6'>
              <Button.Root
                variant='primary'
                onClick={() => (window.location.href = '/transfers/new')}
              >
                New Transfer
              </Button.Root>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-lg bg-bg-white-0'>
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
                className={cn('cursor-pointer hover:bg-bg-weak-50')}
                onClick={() => handleRowClick(row.original)}
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

      {pagination && pagination.totalPages > 1 && (
        <TransfersTablePagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}

interface TransfersTablePaginationProps {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function TransfersTablePagination({
  pagination,
  onPageChange,
  onLimitChange,
}: TransfersTablePaginationProps) {
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

  // Generate page numbers to display
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

  if (!pagination) return null;

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
