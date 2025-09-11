'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiExpandUpDownFill,
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
import * as Button from '@/components/ui/button';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import { Loading } from '@/components/ui/loading';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

export { getSortingIcon };

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationInfo;
  isLoading?: boolean;
  error?: Error | null;
  onRowClick?: (item: TData) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  emptyState?: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
  tableClassName?: string;
  showRowDividers?: boolean;
  initialSorting?: SortingState;
}

export function DataTable<TData>({
  data,
  columns,
  pagination,
  isLoading,
  error,
  onRowClick,
  onPageChange,
  onLimitChange,
  emptyState,
  className,
  tableClassName,
  showRowDividers = false,
  initialSorting = [],
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages || 0,
  });

  const handleRowClick = React.useCallback(
    (item: TData) => {
      onRowClick?.(item);
    },
    [onRowClick],
  );

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

  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-bg-white-0 p-8', className)}>
        <Loading className="min-h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-8',
          className,
        )}
      >
        <div className='text-center text-red-600'>
          {error.message || 'Failed to load data'}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    const Icon = emptyState?.icon;
    return (
      <div
        className={cn(
          'rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-8',
          className,
        )}
      >
        <div className='text-center'>
          {Icon && <Icon className='text-text-sub-400 mx-auto size-12' />}
          <h3 className='mt-2 text-title-h5 text-text-strong-950'>
            {emptyState?.title || 'No data found'}
          </h3>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            {emptyState?.description || 'No items match your current criteria.'}
          </p>
          {emptyState?.action && (
            <div className='mt-6'>
              <Button.Root
                variant='primary'
                onClick={emptyState.action.onClick}
              >
                {emptyState.action.label}
              </Button.Root>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className={cn('rounded-lg bg-bg-white-0', tableClassName)}>
        <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[960px]'>
          <Table.Header className='whitespace-nowrap'>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.Head
                      key={header.id}
                      className={header.column.columnDef.meta?.className}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </Table.Head>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row, i, arr) => (
                <React.Fragment key={row.id}>
                  <Table.Row
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'hover:bg-bg-soft-100',
                      onRowClick && 'cursor-pointer',
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        className={cn(
                          'h-12',
                          cell.column.columnDef.meta?.className,
                          cell.column.id === 'actions' && 'cursor-default',
                        )}
                        onClick={
                          cell.column.id === 'actions'
                            ? (e) => e.stopPropagation()
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                  {showRowDividers && i < arr.length - 1 && (
                    <Table.RowDivider />
                  )}
                </React.Fragment>
              ))}
          </Table.Body>
        </Table.Root>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className='mt-auto'>
          <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xsmall'
              className='w-28'
              onClick={handlePreviousPage}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button.Root>
            <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xsmall'
              className='w-28'
              onClick={handleNextPage}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button.Root>
          </div>
          <div className='mt-10 hidden items-center gap-3 lg:flex'>
            <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
              Page {pagination.page} of {pagination.totalPages} (
              {pagination.total} total)
            </span>

            <Pagination.Root>
              <Pagination.NavButton
                onClick={() => handlePageSelect(1)}
                disabled={pagination.page <= 1}
              >
                <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
              </Pagination.NavButton>
              <Pagination.NavButton
                onClick={handlePreviousPage}
                disabled={pagination.page <= 1}
              >
                <Pagination.NavIcon as={RiArrowLeftSLine} />
              </Pagination.NavButton>

              {pageNumbers.map((pageNum, index) =>
                pageNum === '...' ? (
                  <Pagination.Item key={`ellipsis-${index}`}>
                    ...
                  </Pagination.Item>
                ) : (
                  <Pagination.Item
                    key={pageNum}
                    current={pageNum === pagination.page}
                    onClick={() => handlePageSelect(pageNum as number)}
                  >
                    {pageNum}
                  </Pagination.Item>
                ),
              )}

              <Pagination.NavButton
                onClick={handleNextPage}
                disabled={pagination.page >= pagination.totalPages}
              >
                <Pagination.NavIcon as={RiArrowRightSLine} />
              </Pagination.NavButton>
              <Pagination.NavButton
                onClick={() => handlePageSelect(pagination.totalPages)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <Pagination.NavIcon as={RiArrowRightDoubleLine} />
              </Pagination.NavButton>
            </Pagination.Root>

            <div className='flex flex-1 justify-end'>
              <Select.Root
                size='xsmall'
                value={pagination.limit.toString()}
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
      )}
    </div>
  );
}
