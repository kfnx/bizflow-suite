'use client';

import * as React from 'react';
import {
  RiEditLine,
  RiEyeLine,
  RiMapPinLine,
  RiMoreLine,
  RiStoreLine,
  RiUserLine,
} from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';

import { formatDate } from '@/utils/date-formatter';
import { type Warehouse } from '@/hooks/use-warehouses';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import {
  DataTable,
  getSortingIcon,
  type PaginationInfo,
} from '@/components/ui/data-table';
import * as Dropdown from '@/components/ui/dropdown';

function ActionCell({ row }: { row: any }) {
  const handleEditWarehouse = () => {
    window.location.href = `/warehouses/${row.original.id}/edit`;
  };

  const handleViewDetails = () => {
    window.location.href = `/warehouses/${row.original.id}`;
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
        <Dropdown.Item onClick={handleEditWarehouse}>
          <RiEditLine className='size-4' />
          Edit Warehouse
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

const createColumns = (): ColumnDef<Warehouse>[] => [
  {
    id: 'warehouse',
    accessorKey: 'name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Warehouse
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
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-inset ring-blue-200'>
          <RiStoreLine className='size-5 text-blue-600' />
        </div>
        <div className='flex flex-col'>
          <div className='text-paragraph-sm text-text-strong-950'>
            {row.original.name}
          </div>
          {row.original.code && (
            <div className='text-paragraph-xs text-text-sub-600'>
              {row.original.code}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => (
      <div className='max-w-xs'>
        {row.original.address ? (
          <div className='flex items-start gap-2'>
            <RiMapPinLine className='text-text-sub-400 mt-0.5 size-4 shrink-0' />
            <span className='line-clamp-2 text-paragraph-sm text-text-sub-600'>
              {row.original.address}
              {row.original.city && `, ${row.original.city}`}
            </span>
          </div>
        ) : (
          <span className='text-text-sub-400 text-paragraph-sm'>
            No address provided
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'manager',
    accessorKey: 'managerName',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Manager
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
        <RiUserLine className='text-text-sub-400 size-4' />
        <span className='text-paragraph-sm text-text-sub-600'>
          {row.original.managerName || 'No manager assigned'}
        </span>
      </div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge.Root
        color={row.original.isActive ? 'green' : 'red'}
        variant='lighter'
      >
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge.Root>
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
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell row={row} />,
    meta: {
      className: 'px-5 w-0',
    },
  },
];

interface WarehousesTableProps {
  warehouses: Warehouse[];
  pagination?: PaginationInfo;
  isLoading?: boolean;
  error?: Error | null;
  onWarehouseSelect?: (id: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function WarehousesTable({
  warehouses,
  pagination,
  isLoading,
  error,
  onWarehouseSelect,
  filters,
  onFiltersChange,
}: WarehousesTableProps) {
  const columns = React.useMemo(() => createColumns(), []);

  const handleRowClick = React.useCallback(
    (warehouse: Warehouse) => {
      onWarehouseSelect?.(warehouse.id);
    },
    [onWarehouseSelect],
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      onFiltersChange({ ...filters, page });
    },
    [filters, onFiltersChange],
  );

  const handleLimitChange = React.useCallback(
    (limit: number) => {
      onFiltersChange({ ...filters, limit, page: 1 });
    },
    [filters, onFiltersChange],
  );

  const emptyState = {
    icon: RiStoreLine,
    title: 'No warehouses found',
    description:
      filters.search || filters.isActive !== 'all'
        ? 'Try adjusting your search or filter criteria.'
        : 'Get started by creating a new warehouse.',
    action:
      !filters.search && filters.isActive === 'all'
        ? {
            label: 'Add Warehouse',
            onClick: () => (window.location.href = '/warehouses/new'),
          }
        : undefined,
  };

  return (
    <DataTable
      data={warehouses}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      emptyState={emptyState}
      tableClassName='rounded-lg border border-stroke-soft-200 bg-bg-white-0'
    />
  );
}
