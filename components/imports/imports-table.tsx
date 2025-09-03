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
  RiDeleteBinLine,
  RiExpandUpDownFill,
  RiExternalLinkLine,
  RiEyeLine,
  RiFileTextLine,
  RiImportLine,
  RiMapPinLine,
  RiMoreLine,
  RiStoreLine,
  RiVerifiedBadgeLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import { IMPORT_STATUS } from '@/lib/db/enum';
import {
  useDeleteImport,
  useImports,
  useVerifyImport,
  type Import,
  type ImportsResponse,
} from '@/hooks/use-imports';
import { usePermissions } from '@/hooks/use-permissions';
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
    variant: 'lighter' as const,
    color: 'orange' as const,
  },
  verified: {
    label: 'Verified',
    variant: 'lighter' as const,
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
  const { data, isLoading, error, refetch } = useImports(filters);
  const verifyImportMutation = useVerifyImport();
  const deleteImportMutation = useDeleteImport();
  const { can } = usePermissions();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleDelete = (
    importId: string,
    invoiceNumber: string,
    status: string,
  ) => {
    let message = `Are you sure you want to delete import "${invoiceNumber}"?\n\nThis action cannot be undone and will permanently remove:\n• Import record\n• All associated items\n• Any related data`;

    // Add extra warning for verified imports
    if (status === IMPORT_STATUS.VERIFIED) {
      message +=
        '\n• Products and stock movements created by this import\n\n⚠️ WARNING: This import has been verified and have created products and stock movements.';
    }

    message += '\n\nClick OK to confirm deletion.';

    if (confirm(message)) {
      deleteImportMutation.mutate(importId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleOpenImport = (importId: string) => {
    window.location.href = `/imports/${importId}`;
  };

  const handleVerifyImport = async (importId: string) => {
    if (
      confirm(
        'Are you sure you want to verify this import? This will create products and stock movements.',
      )
    ) {
      try {
        await verifyImportMutation.mutateAsync(importId);
      } catch (error) {
        console.error('Error verifying import:', error);
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
      id: 'billOfLading',
      accessorKey: 'billOfLadingNumber',
      header: 'Bill of Lading',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          {row.original.billOfLadingNumber ? (
            <>
              <span className='text-paragraph-sm text-text-sub-600'>
                {row.original.billOfLadingNumber}
              </span>
              {row.original.billOfLadingDate && (
                <span className='text-paragraph-sm text-text-soft-400'>
                  {new Date(row.original.billOfLadingDate).toLocaleDateString()}
                </span>
              )}
            </>
          ) : (
            <span className='text-text-sub-400 text-paragraph-sm'>
              No B/L info
            </span>
          )}
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
                handleOpenImport(row.original.id);
              }}
            >
              <RiExternalLinkLine className='size-4' />
              View Details
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item
              disabled={row.original.status === IMPORT_STATUS.PENDING}
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
              disabled={
                verifyImportMutation.isPending ||
                (can('imports:verify') &&
                  row.original.status === IMPORT_STATUS.PENDING)
              }
              onClick={(e) => {
                e.stopPropagation();
                handleVerifyImport(row.original.id);
              }}
            >
              <RiVerifiedBadgeLine className='size-4' />
              {verifyImportMutation.isPending
                ? 'Verifying...'
                : 'Verify Import'}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(
                  row.original.id,
                  row.original.invoiceNumber,
                  row.original.status,
                );
              }}
              className='text-red-600'
              disabled={deleteImportMutation.isPending}
            >
              <RiDeleteBinLine className='size-4' />
              {deleteImportMutation.isPending ? 'Deleting...' : 'Delete Import'}
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
                className='cursor-pointer hover:bg-bg-soft-200'
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
      {/* {data.pagination && (
        <ImportsTablePagination
          data={data.pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )} */}
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
  pagination: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function ImportsTablePagination({
  pagination,
  onPageChange,
  onLimitChange,
}: ImportsTablePaginationProps) {
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
