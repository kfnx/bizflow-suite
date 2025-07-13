'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowRightLine,
  RiBox3Line,
  RiExchangeFundsLine,
  RiEyeLine,
  RiReceiptLine,
  RiStoreLine,
  RiTruckLine,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Table from '@/components/ui/table';

interface StockMovement {
  id: string;
  warehouseIdFrom: string;
  warehouseFromName: string;
  warehouseIdTo: string;
  warehouseToName: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  movementType: string;
  invoiceId?: string;
  deliveryId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TransfersTableProps {
  transfers: StockMovement[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onTransferClick?: (transferId: string) => void;
}

export default function TransfersTable({
  transfers,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
  onTransferClick,
}: TransfersTableProps) {
  const router = useRouter();

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'green';
      case 'out':
        return 'red';
      case 'transfer':
        return 'blue';
      case 'adjustment':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return RiArrowRightLine;
      case 'out':
        return RiArrowRightLine;
      case 'transfer':
        return RiExchangeFundsLine;
      case 'adjustment':
        return RiBox3Line;
      default:
        return RiBox3Line;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('id-ID').format(quantity);
  };

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className='flex items-center justify-center'>
          <div className='text-text-sub-600'>Loading stock movements...</div>
        </div>
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className='p-8'>
        <div className='text-center'>
          <RiExchangeFundsLine className='text-text-sub-400 mx-auto size-12' />
          <h3 className='text-sm mt-2 font-medium text-text-strong-950'>
            No stock movements found
          </h3>
          <p className='text-sm mt-1 text-text-sub-600'>
            No stock movements match your current filters.
          </p>
          <div className='mt-6'>
            <Button.Root
              variant='primary'
              onClick={() => router.push('/transfers/new')}
            >
              Create Transfer
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
            <Table.Head>Movement</Table.Head>
            <Table.Head>Product</Table.Head>
            <Table.Head>Warehouses</Table.Head>
            <Table.Head>Quantity</Table.Head>
            <Table.Head>Reference</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head className='text-right'>Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transfers.map((transfer) => {
            const MovementIcon = getMovementTypeIcon(transfer.movementType);

            return (
              <Table.Row
                key={transfer.id}
                className='hover:bg-gray-50 cursor-pointer'
                onClick={() => onTransferClick?.(transfer.id)}
              >
                <Table.Cell>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`bg- flex size-10 shrink-0 items-center justify-center rounded-lg${getMovementTypeColor(transfer.movementType)}-50 ring- ring-1 ring-inset${getMovementTypeColor(transfer.movementType)}-200`}
                    >
                      <MovementIcon
                        className={`text- size-5${getMovementTypeColor(transfer.movementType)}-600`}
                      />
                    </div>
                    <div>
                      <Badge.Root
                        color={getMovementTypeColor(transfer.movementType)}
                        variant='lighter'
                      >
                        {transfer.movementType.toUpperCase()}
                      </Badge.Root>
                      {transfer.notes && (
                        <div className='text-xs mt-1 max-w-xs truncate text-text-sub-600'>
                          {transfer.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-3'>
                    <div className='bg-gray-50 ring-gray-200 flex size-8 shrink-0 items-center justify-center rounded ring-1 ring-inset'>
                      <RiBox3Line className='text-gray-600 size-4' />
                    </div>
                    <div>
                      <div className='font-medium text-text-strong-950'>
                        {transfer.productName}
                      </div>
                      <div className='text-sm text-text-sub-600'>
                        {transfer.productCode}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <RiStoreLine className='text-text-sub-400 size-4' />
                      <span className='text-sm text-text-sub-600'>
                        {transfer.warehouseFromName}
                      </span>
                    </div>
                    <RiArrowRightLine className='text-text-sub-400 size-4' />
                    <div className='flex items-center gap-1'>
                      <RiStoreLine className='text-text-sub-400 size-4' />
                      <span className='text-sm text-text-sub-600'>
                        {transfer.warehouseToName}
                      </span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='text-sm font-medium text-text-strong-950'>
                    {formatQuantity(transfer.quantity)}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='space-y-1'>
                    {transfer.invoiceId && (
                      <div className='flex items-center gap-1'>
                        <RiReceiptLine className='text-text-sub-400 size-3' />
                        <span className='text-xs text-text-sub-600'>
                          Invoice: {transfer.invoiceId}
                        </span>
                      </div>
                    )}
                    {transfer.deliveryId && (
                      <div className='flex items-center gap-1'>
                        <RiTruckLine className='text-text-sub-400 size-3' />
                        <span className='text-xs text-text-sub-600'>
                          Delivery: {transfer.deliveryId}
                        </span>
                      </div>
                    )}
                    {!transfer.invoiceId && !transfer.deliveryId && (
                      <span className='text-xs text-text-sub-400'>
                        No reference
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className='text-sm text-text-sub-600'>
                    {formatDate(transfer.createdAt)}
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
                        router.push(`/transfers/${transfer.id}`);
                      }}
                    >
                      <RiEyeLine className='size-4' />
                    </Button.Root>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='border-t border-stroke-soft-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-text-sub-600'>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
              of {pagination.total} movements
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
