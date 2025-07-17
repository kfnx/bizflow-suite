'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiBox3Line,
  RiBuildingLine,
  RiExpandUpDownFill,
  RiFileTextLine,
  RiImportLine,
  RiMapPinLine,
  RiMoreLine,
  RiStoreLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import {
  useImports,
  type Import,
  type ImportsResponse,
} from '@/hooks/use-imports';
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

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'light' as const,
    color: 'orange' as const,
  },
  verified: {
    label: 'Verified',
    variant: 'light' as const,
    color: 'green' as const,
  },
};

interface ImportsTableProps {
  filters: {
    search: string;
    sortBy: string;
    page?: number;
    limit?: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onImportClick?: (importId: string) => void;
}

export function ImportsTable({
  filters,
  onPageChange,
  onLimitChange,
  onImportClick,
}: ImportsTableProps) {
  const { data, isLoading, error } = useImports(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleDelete = async (importId: string) => {
    if (confirm('Are you sure you want to delete this import record?')) {
      try {
        // TODO: Implement delete functionality
        console.log('Deleting import:', importId);
      } catch (error) {
        console.error('Error deleting import:', error);
      }
    }
  };

  const formatCurrency = (amount: number, currency: string = 'RMB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'RMB' ? 'CNY' : currency,
    }).format(amount);
  };

  const columns: ColumnDef<Import>[] = [
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
        <div className='flex items-center gap-2'>
          <RiFileTextLine className='size-4 text-text-sub-600' />
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.invoiceNumber}
          </div>
        </div>
      ),
    },
    {
      id: 'supplier',
      accessorKey: 'supplierName',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Supplier
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
          <RiBuildingLine className='size-4 text-text-sub-600' />
          <div className='flex flex-col'>
            <div className='text-paragraph-sm text-text-sub-600'>
              {row.original.supplierName}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'warehouse',
      accessorKey: 'warehouseName',
      header: 'Warehouse',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <RiStoreLine className='size-4 text-text-sub-600' />
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.warehouseName}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config =
          statusConfig[row.original.status as keyof typeof statusConfig];
        return (
          <Badge.Root variant={config?.variant} color={config?.color}>
            {config?.label || row.original.status}
          </Badge.Root>
        );
      },
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
        <div className='flex flex-col'>
          <div className='text-text-900 text-paragraph-sm font-medium'>
            {formatCurrency(row.original.total, 'IDR')}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            Rate: {row.original.exchangeRateRMBtoIDR}
          </div>
        </div>
      ),
    },
    {
      id: 'importDate',
      accessorKey: 'importDate',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Import Date
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
          {new Date(row.original.importDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button.Root
              mode='ghost'
              size='xsmall'
              className='h-8 w-8 p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <RiMoreLine className='size-4' />
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align='end'>
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/imports/${row.original.id}/edit`;
              }}
            >
              <RiFileTextLine className='size-4' />
              Edit Import
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              className='text-red-600'
            >
              Delete Import
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
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
          Error loading imports
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          No imports found
        </div>
        <div className='text-paragraph-xs text-text-soft-400'>
          Try adjusting your filters or add a new import
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-lg'>
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
                className='hover:bg-gray-50 cursor-pointer'
                onClick={() => onImportClick?.(row.original.id)}
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

      {/* Pagination */}
      {data.pagination && (
        <ImportsTablePagination
          data={data.pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ImportsTablePaginationProps {
  data: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function ImportsTablePagination({
  data,
  onPageChange,
  onLimitChange,
}: ImportsTablePaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit, 10);
    onLimitChange?.(limit);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const currentPage = data.page;
    const totalPages = data.totalPages;

    // Always show first page
    pages.push(1);

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (data.totalPages <= 1) {
    return null;
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <span className='text-paragraph-sm text-text-sub-600'>Show:</span>
        <Select.Root
          value={data.limit.toString()}
          onValueChange={handleLimitChange}
        >
          <Select.Trigger className='h-8 w-20'>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='10'>10</Select.Item>
            <Select.Item value='25'>25</Select.Item>
            <Select.Item value='50'>50</Select.Item>
            <Select.Item value='100'>100</Select.Item>
          </Select.Content>
        </Select.Root>
        <span className='text-paragraph-sm text-text-sub-600'>
          of {data.total} imports
        </span>
      </div>

      <div className='flex items-center gap-1'>
        <Button.Root
          mode='ghost'
          size='xsmall'
          onClick={() => handlePageChange(1)}
          disabled={data.page === 1}
          className='h-8 w-8 p-0'
        >
          <RiArrowLeftDoubleLine className='size-4' />
        </Button.Root>
        <Button.Root
          mode='ghost'
          size='xsmall'
          onClick={() => handlePageChange(data.page - 1)}
          disabled={data.page === 1}
          className='h-8 w-8 p-0'
        >
          <RiArrowLeftSLine className='size-4' />
        </Button.Root>

        <div className='flex items-center gap-1'>
          {generatePageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className='px-2 text-paragraph-sm text-text-sub-600'>
                  ...
                </span>
              ) : (
                <Button.Root
                  mode={data.page === page ? 'filled' : 'ghost'}
                  size='xsmall'
                  onClick={() => handlePageChange(page as number)}
                  className='h-8 w-8 p-0'
                >
                  {page}
                </Button.Root>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button.Root
          mode='ghost'
          size='xsmall'
          onClick={() => handlePageChange(data.page + 1)}
          disabled={data.page === data.totalPages}
          className='h-8 w-8 p-0'
        >
          <RiArrowRightSLine className='size-4' />
        </Button.Root>
        <Button.Root
          mode='ghost'
          size='xsmall'
          onClick={() => handlePageChange(data.totalPages)}
          disabled={data.page === data.totalPages}
          className='h-8 w-8 p-0'
        >
          <RiArrowRightDoubleLine className='size-4' />
        </Button.Root>
      </div>
    </div>
  );
}
