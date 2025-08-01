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
  RiEditLine,
  RiExpandUpDownFill,
  RiFileTextLine,
  RiMailSendLine,
  RiMoreLine,
  RiSendPlane2Line,
  RiSendPlaneLine,
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

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date-formatter';
import {
  QuotationListItem,
  useQuotations,
  useSendQuotation,
  useSubmitQuotation,
} from '@/hooks/use-quotations';
import { type Quotation } from '@/lib/db/schema';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import { QuotationStatusBadge } from '@/components/quotations/quotation-status-badge';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
};

function ActionCell({
  row,
  onPreview,
}: {
  row: any;
  onPreview?: (id: string) => void;
}) {
  const sendQuotationMutation = useSendQuotation();
  const submitQuotationMutation = useSubmitQuotation();

  const handleEditQuotation = () => {
    if (row.original.status !== 'draft') {
      toast.warning('Only draft quotations can be edited');
      return;
    }
    window.location.href = `/quotations/${row.original.id}/edit`;
  };

  const handleReviseQuotation = () => {
    if (row.original.status !== 'rejected') {
      toast.warning('Only rejected quotations can be revised');
      return;
    }
    window.location.href = `/quotations/${row.original.id}/revise`;
  };

  const handleViewDetails = () => {
    window.location.href = `/quotations/${row.original.id}`;
  };

  const handleSend = async () => {
    if (row.original.status !== 'approved') {
      toast.warning('Only approved quotations can be sent');
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
      toast.success('Quotation sent successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send quotation',
      );
    }
  };

  const handleSubmit = async () => {
    if (row.original.status !== QUOTATION_STATUS.DRAFT) {
      toast.warning('Only draft quotations can be submitted');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to submit quotation ${row.original.quotationNumber} for approval?`,
      )
    ) {
      return;
    }

    try {
      await submitQuotationMutation.mutateAsync(row.original.id);
      toast.success('Quotation submitted successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit quotation',
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
        {row.original.status === QUOTATION_STATUS.DRAFT && (
          <Dropdown.Item
            onClick={handleSubmit}
            disabled={sendQuotationMutation.isPending}
          >
            <RiSendPlaneLine className='size-4' />
            Submit
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onClick={handleEditQuotation}
          disabled={row.original.status !== 'draft'}
        >
          <RiEditLine className='size-4' />
          Edit Quotation
        </Dropdown.Item>
        {row.original.status === 'rejected' && (
          <Dropdown.Item onClick={handleReviseQuotation}>
            <RiEditLine className='size-4' />
            Revise Quotation
          </Dropdown.Item>
        )}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

const createColumns = (
  onPreview?: (id: string) => void,
): ColumnDef<QuotationListItem>[] => [
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
      id: 'branch',
      accessorKey: 'branchName',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Branch
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
          {row.original.branchName || '—'}
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
              {formatCurrency(parseFloat(row.original.total || '0'), 'IDR')}
            </div>
            <div className='text-paragraph-xs text-text-soft-400'>
              {formatCurrency(parseFloat(row.original.subtotal || '0'), 'IDR')}
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
            {[row.original.createdByUserFirstName, row.original.createdByUserLastName]
              .filter(Boolean)
              .join(' ') || '—'}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {row.original.createdAt ? formatDate(row.original.createdAt) : '—'}
          </div>
        </div>
      ),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionCell row={row} onPreview={onPreview} />,
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
    branch?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  };
  onPreview?: (id: string) => void;
}

export function QuotationsTable({ filters, onPreview }: QuotationsTableProps) {
  const { data, isLoading, error } = useQuotations(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo(() => createColumns(onPreview), [onPreview]);

  const handleRowClick = React.useCallback(
    (quotationId: string) => {
      if (onPreview) {
        onPreview(quotationId);
      }
    },
    [onPreview],
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      sorting: [
        {
          id: 'createdBy',
          desc: true,
        },
      ],
    },
  });

  if (isLoading) {
    return (
      <div className='text-gray-500 p-4 text-center'>Loading quotations...</div>
    );
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>Error: {error.message}</div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='p-8 text-center'>
        <RiFileTextLine className='text-gray-400 mx-auto size-12' />
        <h3 className='text-gray-900 mt-2 text-paragraph-sm font-medium'>
          No quotations found
        </h3>
        <p className='text-gray-500 mt-1 text-paragraph-sm'>
          {filters?.search || filters?.status || filters?.customerId
            ? 'No quotations match your current filters. Try adjusting your search criteria.'
            : 'Get started by creating a new quotation.'}
        </p>
      </div>
    );
  }

  return (
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
                className='cursor-pointer hover:bg-bg-soft-200'
                onClick={() => handleRowClick(row.original.id)}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
              {i < arr.length - 1 && <Table.RowDivider />}
            </React.Fragment>
          ))}
      </Table.Body>
    </Table.Root>
  );
}

interface QuotationTablePaginationProps {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function QuotationTablePagination({
  pagination,
  onPageChange,
  onLimitChange,
}: QuotationTablePaginationProps) {
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
