'use client';

import { RiStoreLine } from '@remixicon/react';
import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { WarehouseForm } from '@/components/warehouse-form';

export default function NewWarehousePage() {
  const router = useRouter();

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiStoreLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Warehouse'
        description='Add a new warehouse to your system.'
      >
        <BackButton href='/warehouses' label='Back to Warehouses' />
      </Header>

      <WarehouseForm
        mode='create'
        onSuccess={() => router.push('/warehouses')}
        onCancel={() => router.push('/warehouses')}
      />
    </>
  );
}
