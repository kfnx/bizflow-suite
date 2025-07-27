'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowRightLine,
  RiBox1Line,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiExchangeLine,
  RiFileTextLine,
  RiHashtag,
  RiStoreLine,
  RiTruckLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useDeleteTransfer, useTransfer } from '@/hooks/use-transfers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { SimplePageLoading } from '@/components/simple-page-loading';

interface TransferDetailProps {
  id: string;
}

const getMovementTypeConfig = (type: string) => {
  switch (type) {
    case 'in':
      return {
        label: 'Stock In',
        color: 'green' as const,
        icon: RiBox1Line,
        description: 'Stock incoming to warehouse',
      };
    case 'out':
      return {
        label: 'Stock Out',
        color: 'red' as const,
        icon: RiTruckLine,
        description: 'Stock outgoing from warehouse',
      };
    case 'transfer':
      return {
        label: 'Transfer',
        color: 'blue' as const,
        icon: RiExchangeLine,
        description: 'Stock transfer between warehouses',
      };
    case 'adjustment':
      return {
        label: 'Adjustment',
        color: 'yellow' as const,
        icon: RiEditLine,
        description: 'Manual stock adjustment',
      };
    default:
      return {
        label: type,
        color: 'gray' as const,
        icon: RiFileTextLine,
        description: 'Unknown movement type',
      };
  }
};

export function TransferDetail({ id }: TransferDetailProps) {
  const router = useRouter();
  const { data: transfer, isLoading, error } = useTransfer(id);
  const deleteTransferMutation = useDeleteTransfer();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/transfers/${id}/edit`);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete this transfer?\n\nThis action cannot be undone and will permanently remove the transfer record.`,
      )
    ) {
      setIsDeleting(true);
      deleteTransferMutation.mutate(id, {
        onSuccess: () => {
          router.push('/transfers');
        },
        onSettled: () => {
          setIsDeleting(false);
        },
      });
    }
  };

  if (isLoading) {
    return <SimplePageLoading>Loading transfer details...</SimplePageLoading>;
  }

  if (error) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Error loading transfer</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            {error.message || 'Failed to load transfer details'}
          </p>
          <Button.Root
            className='mt-4'
            onClick={() => router.push('/transfers')}
          >
            Back to Transfers
          </Button.Root>
        </div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Transfer not found</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            The transfer you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button.Root
            className='mt-4'
            onClick={() => router.push('/transfers')}
          >
            Back to Transfers
          </Button.Root>
        </div>
      </div>
    );
  }

  const movementConfig = getMovementTypeConfig(transfer.movementType);
  const MovementIcon = movementConfig.icon;

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <MovementIcon className='size-6 text-text-sub-600' />
          </div>
        }
        title={`${movementConfig.label} #${transfer.id.slice(-8)}`}
        description='Transfer details and movement information.'
      >
        <div className='flex items-center gap-3'>
          <BackButton href='/transfers' label='Back to Transfers' />
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={handleEdit}
          >
            <RiEditLine className='mr-2 size-4' />
            Edit
          </Button.Root>
          <Button.Root
            variant='error'
            mode='stroke'
            size='small'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <RiDeleteBinLine className='mr-2 size-4' />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button.Root>
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
          {/* Movement Type & Status */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Movement Information
            </h3>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Movement Type
                </div>
                <div className='flex items-center gap-2'>
                  <Badge.Root variant='light' color={movementConfig.color}>
                    <MovementIcon className='mr-2 size-4' />
                    {movementConfig.label}
                  </Badge.Root>
                </div>
                <p className='text-sm mt-1 text-text-sub-600'>
                  {movementConfig.description}
                </p>
              </div>
            </div>
          </div>

          <Divider.Root />

          {/* Product Information */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Product Information
            </h3>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Product Name
                </div>
                <div className='flex items-center gap-2'>
                  <RiBox1Line className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {transfer.name}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Product Code
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-paragraph-sm text-text-sub-600'>
                    {transfer.productCode}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Quantity
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-paragraph-lg font-semibold text-text-strong-950'>
                    {transfer.quantity.toLocaleString()}
                  </span>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    units
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Divider.Root />

          {/* Warehouse Information */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Warehouse Movement
            </h3>

            <div className='flex items-center gap-6'>
              {/* From Warehouse */}
              <div className='flex-1'>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  {transfer.movementType === 'in'
                    ? 'Destination'
                    : 'From Warehouse'}
                </div>
                <div className='bg-gray-50 flex items-center gap-2 rounded-lg border p-3'>
                  <RiStoreLine className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {transfer.warehouseFromName || 'External Source'}
                  </span>
                </div>
              </div>

              {/* To Warehouse */}
              <div className='flex-1'>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  {transfer.movementType === 'out' ? 'Source' : 'To Warehouse'}
                </div>
                <div className='flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3'>
                  <RiStoreLine className='size-4 text-blue-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {transfer.warehouseToName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* References & Notes */}
          {(transfer.invoiceId || transfer.deliveryId || transfer.notes) && (
            <>
              <Divider.Root />

              <div>
                <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                  Additional Information
                </h3>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {transfer.invoiceId && (
                    <div>
                      <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                        Invoice Reference
                      </div>
                      <div className='flex items-center gap-2'>
                        <RiFileTextLine className='size-4 text-text-sub-600' />
                        <span className='font-mono text-paragraph-sm text-text-strong-950'>
                          {transfer.invoiceId}
                        </span>
                      </div>
                    </div>
                  )}

                  {transfer.deliveryId && (
                    <div>
                      <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                        Delivery Reference
                      </div>
                      <div className='flex items-center gap-2'>
                        <RiTruckLine className='size-4 text-text-sub-600' />
                        <span className='font-mono text-paragraph-sm text-text-strong-950'>
                          {transfer.deliveryId}
                        </span>
                      </div>
                    </div>
                  )}

                  {transfer.notes && (
                    <div className='md:col-span-2'>
                      <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                        Notes
                      </div>
                      <div className='bg-gray-50 rounded-lg border p-3'>
                        <span className='text-paragraph-sm text-text-strong-950'>
                          {transfer.notes}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Divider.Root />

          {/* System Information */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              System Information
            </h3>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Created Date
                </div>
                <div className='flex items-center gap-2'>
                  <RiCalendarLine className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {formatDate(transfer.createdAt)}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Last Updated
                </div>
                <div className='flex items-center gap-2'>
                  <RiCalendarLine className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {formatDate(transfer.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
