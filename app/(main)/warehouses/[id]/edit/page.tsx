'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiEditLine } from '@remixicon/react';

import { useWarehouse } from '@/hooks/use-warehouses';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { WarehouseForm } from '@/components/warehouse-form';

interface EditWarehousePageProps {
  params: {
    id: string;
  };
}

export default function EditWarehousePage({ params }: EditWarehousePageProps) {
  const router = useRouter();
  const {
    data: warehouseData,
    isLoading: warehouseLoading,
    error: warehouseError,
  } = useWarehouse(params.id);

  // Transform warehouse data for the form
  const transformWarehouseData = () => {
    if (!warehouseData) return null;

    return {
      name: warehouseData.name || '',
      address: warehouseData.address || '',
      managerId: warehouseData.managerId || '',
      branchId: warehouseData.branchId || '',
      isActive: warehouseData.isActive !== undefined ? warehouseData.isActive : true,
    };
  };

  if (warehouseLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading warehouse details...
      </div>
    );
  }

  if (warehouseError) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Error loading warehouse</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            {warehouseError.message || 'Failed to load warehouse details'}
          </p>
          <button
            className='mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            onClick={() => router.push('/warehouses')}
          >
            Back to Warehouses
          </button>
        </div>
      </div>
    );
  }

  if (!warehouseData) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Warehouse not found</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            The warehouse you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <button
            className='mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            onClick={() => router.push('/warehouses')}
          >
            Back to Warehouses
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Edit Warehouse'
        description={`Update ${warehouseData.name}'s information.`}
      >
        <BackButton
          href={`/warehouses/${params.id}`}
          label='Back to Warehouse'
        />
      </Header>

      <WarehouseForm
        mode='edit'
        initialData={transformWarehouseData() || undefined}
        warehouseId={params.id}
        onSuccess={() => router.push(`/warehouses/${params.id}`)}
        onCancel={() => router.push(`/warehouses/${params.id}`)}
      />
    </>
  );
}
