'use client';

import { useRouter } from 'next/navigation';
import { RiImportLine } from '@remixicon/react';

import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { ImportForm } from '@/components/import-form';

export default function NewImportPage() {
  const router = useRouter();

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImportLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Import'
        description='Record a new product import from supplier.'
      >
        <BackButton href='/imports' label='Back to Imports' />
      </Header>

      <ImportForm
        mode='create'
        onSuccess={() => router.push('/imports')}
        onCancel={() => router.push('/imports')}
      />
    </>
  );
}
