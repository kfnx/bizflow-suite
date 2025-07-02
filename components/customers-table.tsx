'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiBuildingLine,
  RiExpandUpDownFill,
  RiFileTextLine,
  RiMapPinLine,
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

import {
  useCustomers,
  useDeleteCustomer,
  type Customer,
  type CustomersResponse,
} from '@/hooks/use-customers';
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

const typeConfig = {
  individual: {
    label: 'Individual',
    variant: 'light' as const,
    color: 'blue' as const,
  },
  company: {
    label: 'Company',
    variant: 'light' as const,
    color: 'green' as const,
  },
};

interface CustomersTableProps {
  filters: {
    search: string;
    type: string;
    sortBy: string;
    page?: number;
    limit?: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function CustomersTable({
  filters,
  onPageChange,
  onLimitChange,
}: CustomersTableProps) {
  const { data, isLoading, error } = useCustomers(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const deleteCustomer = useDeleteCustomer();

  const handleDelete = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer.mutateAsync(customerId);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      id: 'code',
      accessorKey: 'code',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Code
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
            {row.original.code}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {row.original.name}
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
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
      cell: ({ row }) => {
        const config = typeConfig[row.original.type as keyof typeof typeConfig];
        return (
          <div className='flex items-center gap-2'>
            {row.original.type === 'company' ? (
              <RiBuildingLine className='size-4 text-text-sub-600' />
            ) : (
              <RiUserLine className='size-4 text-text-sub-600' />
            )}
            <Badge.Root variant={config?.variant} color={config?.color}>
              {config?.label || row.original.type}
            </Badge.Root>
          </div>
        );
      },
    },
    {
      id: 'contact',
      accessorKey: 'contactPersonName',
      header: 'Contact Person',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <div className='text-paragraph-sm text-text-sub-600'>
            {row.original.contactPersonName || '-'}
          </div>
          <div className='text-paragraph-xs text-text-soft-400'>
            {row.original.contactPersonEmail || '-'}
          </div>
        </div>
      ),
    },
    {
      id: 'phone',
      accessorKey: 'contactPersonPhone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.contactPersonPhone || '-'}
        </div>
      ),
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
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button.Root mode='ghost' size='xsmall' className='h-8 w-8 p-0'>
              <RiMoreLine className='size-4' />
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align='end'>
            <Dropdown.Item>
              <RiFileTextLine className='size-4' />
              View Details
            </Dropdown.Item>
            <Dropdown.Item>
              <RiMapPinLine className='size-4' />
              View Address
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item
              onClick={() => handleDelete(row.original.id)}
              className='text-red-600'
            >
              Delete Customer
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
          Error loading customers: {error.message}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          No customers found
        </div>
        <div className='text-paragraph-xs text-text-soft-400'>
          Try adjusting your filters or add a new customer
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0'>
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
              <Table.Row key={row.id}>
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
        <CustomersTablePagination
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

interface CustomersTablePaginationProps {
  data: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function CustomersTablePagination({
  data,
  onPageChange,
  onLimitChange,
}: CustomersTablePaginationProps) {
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
          of {data.total} customers
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
