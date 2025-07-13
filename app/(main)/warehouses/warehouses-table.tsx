'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiEditLine,
  RiEyeLine,
  RiMapPinLine,
  RiStoreLine,
  RiUserLine,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Table from '@/components/ui/table';

interface Warehouse {
  id: string;
  name: string;
  address?: string;
  managerId?: string;
  managerName?: string;
  managerLastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WarehousesTableProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onWarehouseClick?: (warehouseId: string) => void;
}

export default function WarehousesTable({
  warehouses,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
  onWarehouseClick,
}: WarehousesTableProps) {
  const router = useRouter();

  const formatManagerName = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'No manager assigned';
    return `${firstName}${lastName ? ` ${lastName}` : ''}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className='flex items-center justify-center'>
          <div className='text-text-sub-600'>Loading warehouses...</div>
        </div>
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className='p-8'>
        <div className='text-center'>
          <RiStoreLine className='text-text-sub-400 mx-auto size-12' />
          <h3 className='text-sm mt-2 font-medium text-text-strong-950'>
            No warehouses found
          </h3>
          <p className='text-sm mt-1 text-text-sub-600'>
            Get started by creating a new warehouse.
          </p>
          <div className='mt-6'>
            <Button.Root
              variant='primary'
              onClick={() => router.push('/warehouses/new')}
            >
              Add Warehouse
            </Button.Root>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden'>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Warehouse</Table.Head>
            <Table.Head>Address</Table.Head>
            <Table.Head>Manager</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Created</Table.Head>
            <Table.Head className='text-right'>Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {warehouses.map((warehouse) => (
            <Table.Row
              key={warehouse.id}
              className='hover:bg-gray-50 cursor-pointer'
              onClick={() => onWarehouseClick?.(warehouse.id)}
            >
              <Table.Cell>
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-inset ring-blue-200'>
                    <RiStoreLine className='size-5 text-blue-600' />
                  </div>
                  <div>
                    <div className='font-medium text-text-strong-950'>
                      {warehouse.name}
                    </div>
                    <div className='text-sm text-text-sub-600'>
                      ID: {warehouse.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className='max-w-xs'>
                  {warehouse.address ? (
                    <div className='flex items-start gap-2'>
                      <RiMapPinLine className='text-text-sub-400 mt-0.5 size-4 shrink-0' />
                      <span className='text-sm line-clamp-2 text-text-sub-600'>
                        {warehouse.address}
                      </span>
                    </div>
                  ) : (
                    <span className='text-sm text-text-sub-400'>
                      No address provided
                    </span>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className='flex items-center gap-2'>
                  <RiUserLine className='text-text-sub-400 size-4' />
                  <span className='text-sm text-text-sub-600'>
                    {formatManagerName(
                      warehouse.managerName,
                      warehouse.managerLastName,
                    )}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge.Root
                  color={warehouse.isActive ? 'green' : 'red'}
                  variant='lighter'
                >
                  {warehouse.isActive ? 'Active' : 'Inactive'}
                </Badge.Root>
              </Table.Cell>
              <Table.Cell>
                <div className='text-sm text-text-sub-600'>
                  {formatDate(warehouse.createdAt)}
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className='flex items-center justify-end gap-2'>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/warehouses/${warehouse.id}`);
                    }}
                  >
                    <RiEyeLine className='size-4' />
                  </Button.Root>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/warehouses/${warehouse.id}/edit`);
                    }}
                  >
                    <RiEditLine className='size-4' />
                  </Button.Root>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='border-t border-stroke-soft-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-text-sub-600'>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
              of {pagination.total} warehouses
            </div>
            <div className='flex items-center gap-2'>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='small'
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                Previous
              </Button.Root>
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <Button.Root
                    key={page}
                    variant='neutral'
                    mode={pagination.page === page ? 'filled' : 'ghost'}
                    size='small'
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button.Root>
                );
              })}
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='small'
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                Next
              </Button.Root>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
