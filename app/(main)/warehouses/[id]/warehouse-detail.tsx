'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMapPinLine,
  RiStoreLine,
  RiUserLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useDeleteWarehouse, useWarehouse } from '@/hooks/use-warehouses';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { SimplePageLoading } from '@/components/simple-page-loading';

interface WarehouseDetailProps {
  id: string;
}

export function WarehouseDetail({ id }: WarehouseDetailProps) {
  const router = useRouter();
  const { data: warehouse, isLoading, error } = useWarehouse(id);
  const deleteWarehouseMutation = useDeleteWarehouse();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/warehouses/${id}/edit`);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to deactivate warehouse "${warehouse?.name}"?\n\nThis will set the warehouse to inactive status. This action can be reversed by editing the warehouse.`,
      )
    ) {
      setIsDeleting(true);
      deleteWarehouseMutation.mutate(id, {
        onSuccess: () => {
          router.push('/warehouses');
        },
        onSettled: () => {
          setIsDeleting(false);
        },
      });
    }
  };

  if (isLoading) {
    return <SimplePageLoading>Loading warehouse details...</SimplePageLoading>;
  }

  if (error) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Error loading warehouse</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            {error.message || 'Failed to load warehouse details'}
          </p>
          <Button.Root
            className='mt-4'
            onClick={() => router.push('/warehouses')}
          >
            Back to Warehouses
          </Button.Root>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Warehouse not found</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            The warehouse you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button.Root
            className='mt-4'
            onClick={() => router.push('/warehouses')}
          >
            Back to Warehouses
          </Button.Root>
        </div>
      </div>
    );
  }

  const managerFirstName =
    warehouse.managerFirstName && warehouse.managerLastName
      ? `${warehouse.managerFirstName} ${warehouse.managerLastName}`
      : 'No manager assigned';

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiStoreLine className='size-6 text-text-sub-600' />
          </div>
        }
        title={warehouse.name}
        description='Warehouse details and information.'
      >
        <div className='flex items-center gap-3'>
          <BackButton href='/warehouses' label='Back to Warehouses' />
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
            disabled={isDeleting || !warehouse.isActive}
          >
            <RiDeleteBinLine className='mr-2 size-4' />
            {isDeleting ? 'Deactivating...' : 'Deactivate'}
          </Button.Root>
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
          {/* Basic Information */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Status */}
              <div className='md:col-span-2'>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Status
                </div>
                <div className='flex items-center gap-2'>
                  <Badge.Root
                    variant='light'
                    color={warehouse.isActive ? 'green' : 'red'}
                  >
                    {warehouse.isActive ? (
                      <RiCheckLine className='mr-2 size-4' />
                    ) : (
                      <RiCloseLine className='mr-2 size-4' />
                    )}
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </Badge.Root>
                </div>
              </div>
              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Warehouse Name
                </div>
                <div className='flex items-center gap-2'>
                  <RiStoreLine className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {warehouse.name}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Manager
                </div>
                <div className='flex items-center gap-2'>
                  <RiUserLine className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {managerFirstName}
                  </span>
                </div>
              </div>

              <div>
                <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                  Branch
                </div>
                <div className='flex items-center gap-2'>
                  <RiMapPinLine className='size-4 text-text-sub-600' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {warehouse.branchName || 'No branch assigned'}
                  </span>
                </div>
              </div>

              {warehouse.address && (
                <div className='md:col-span-2'>
                  <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                    Address
                  </div>
                  <div className='flex items-start gap-2'>
                    <RiMapPinLine className='mt-0.5 size-4 text-text-sub-600' />
                    <span className='text-paragraph-sm text-text-strong-950'>
                      {warehouse.address}
                    </span>
                  </div>
                </div>
              )}

              {warehouse.billOfLadingNumber && (
                <div>
                  <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                    Bill of Lading Number
                  </div>
                  <div className='flex items-center gap-2'>
                    <RiStoreLine className='size-4 text-text-sub-600' />
                    <span className='text-paragraph-sm text-text-strong-950'>
                      {warehouse.billOfLadingNumber}
                    </span>
                  </div>
                </div>
              )}

              {warehouse.billOfLadingDate && (
                <div>
                  <div className='text-sm mb-2 font-medium uppercase tracking-wide text-text-soft-400'>
                    Bill of Lading Date
                  </div>
                  <div className='flex items-center gap-2'>
                    <RiCalendarLine className='size-4 text-text-sub-600' />
                    <span className='text-paragraph-sm text-text-strong-950'>
                      {formatDate(warehouse.billOfLadingDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

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
                    {formatDate(warehouse.createdAt)}
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
                    {formatDate(warehouse.updatedAt)}
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
