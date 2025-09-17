'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBuildingLine,
  RiCalendarLine,
  RiCheckLine,
  RiExchangeCnyLine,
  RiEyeLine,
  RiImportLine,
  RiStoreLine,
} from '@remixicon/react';

import {
  usePendingImports,
  useVerifyImport,
  type PendingImport,
} from '@/hooks/use-imports';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { SimplePageLoading } from '@/components/simple-page-loading';

export default function PendingImportsPage() {
  const router = useRouter();
  const { data: imports, isLoading, error, refetch } = usePendingImports();
  const verifyImportMutation = useVerifyImport();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerifyImport = (importId: string) => {
    setVerifyingId(importId);
    verifyImportMutation.mutate(importId, {
      onSettled: () => {
        setVerifyingId(null);
        refetch();
      },
    });
  };

  const handleViewDetails = (importId: string) => {
    router.push(`/imports/${importId}`);
  };

  if (isLoading) {
    return <SimplePageLoading>Loading pending imports...</SimplePageLoading>;
  }

  if (error) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        Error loading pending imports
      </div>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImportLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Pending Import Verification'
        description='Review and verify pending imports to add items to inventory.'
      >
        <BackButton href='/imports' label='Back to Imports' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {!imports || imports.length === 0 ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center'>
              <RiImportLine className='mx-auto size-12 text-text-sub-600' />
              <h3 className='text-lg mt-4 font-medium text-text-strong-950'>
                No pending imports
              </h3>
              <p className='mt-2 text-text-sub-600'>
                All imports have been verified or there are no imports awaiting
                verification.
              </p>
              <Button.Root
                className='mt-6'
                onClick={() => router.push('/imports')}
              >
                View All Imports
              </Button.Root>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-text-strong-950'>
                  Pending Imports ({imports.length})
                </h2>
                <p className='text-text-sub-600'>
                  Review and verify imports to add items to your inventory.
                </p>
              </div>
            </div>

            <div className='grid gap-6'>
              {imports.map((importItem: PendingImport) => (
                <div
                  key={importItem.id}
                  className='shadow-sm rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'
                >
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow-50 ring-1 ring-inset ring-yellow-200'>
                        <RiImportLine className='size-5 text-yellow-600' />
                      </div>
                      <div>
                        <h3 className='text-lg font-medium text-text-strong-950'>
                          Import #{importItem.invoiceNumber}
                        </h3>
                        <Badge.Root variant='lighter' size='small'>
                          Pending Verification
                        </Badge.Root>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button.Root
                        variant='neutral'
                        mode='stroke'
                        size='small'
                        onClick={() => handleViewDetails(importItem.id)}
                      >
                        <RiEyeLine className='mr-2 size-4' />
                        View Details
                      </Button.Root>
                      <Button.Root
                        variant='primary'
                        size='small'
                        onClick={() => handleVerifyImport(importItem.id)}
                        disabled={
                          verifyingId === importItem.id ||
                          verifyImportMutation.isPending
                        }
                      >
                        <RiCheckLine className='mr-2 size-4' />
                        {verifyingId === importItem.id
                          ? 'Verifying...'
                          : 'Verify Import'}
                      </Button.Root>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <div className='flex items-center gap-3'>
                      <RiBuildingLine className='size-4 text-text-sub-600' />
                      <div>
                        <p className='text-xs text-text-sub-600'>Supplier</p>
                        <p className='text-sm font-medium text-text-strong-950'>
                          {importItem.supplierName}
                        </p>
                        <p className='text-xs text-text-sub-600'>
                          ({importItem.supplierCode})
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <RiStoreLine className='size-4 text-text-sub-600' />
                      <div>
                        <p className='text-xs text-text-sub-600'>Warehouse</p>
                        <p className='text-sm font-medium text-text-strong-950'>
                          {importItem.warehouseName}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <RiCalendarLine className='size-4 text-text-sub-600' />
                      <div>
                        <p className='text-xs text-text-sub-600'>Import Date</p>
                        <p className='text-sm font-medium text-text-strong-950'>
                          {new Date(importItem.importDate).toLocaleDateString(
                            'id-ID',
                          )}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <RiExchangeCnyLine className='size-4 text-text-sub-600' />
                      <div>
                        <p className='text-xs text-text-sub-600'>
                          Exchange Rate
                        </p>
                        <p className='text-sm font-medium text-text-strong-950'>
                          {importItem.exchangeRateRMBtoIDR.toLocaleString()}{' '}
                          IDR/CNY
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 border-t border-stroke-soft-200 pt-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                      <div>
                        <p className='text-xs text-text-sub-600'>Items</p>
                        <p className='text-lg font-semibold text-text-strong-950'>
                          {importItem.itemCount} items
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-text-sub-600'>Total (CNY)</p>
                        <p className='text-lg font-semibold text-text-strong-950'>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'CNY',
                          }).format(importItem.totalRMB)}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-text-sub-600'>Total (IDR)</p>
                        <p className='text-lg font-semibold text-text-strong-950'>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(importItem.totalIDR)}
                        </p>
                      </div>
                    </div>

                    {importItem.notes && (
                      <div className='mt-4'>
                        <p className='text-xs text-text-sub-600'>Notes</p>
                        <p className='text-sm text-text-strong-950'>
                          {importItem.notes}
                        </p>
                      </div>
                    )}

                    <div className='text-xs mt-4 text-text-sub-600'>
                      Created on{' '}
                      {new Date(importItem.createdAt).toLocaleDateString(
                        'id-ID',
                      )}{' '}
                      at{' '}
                      {new Date(importItem.createdAt).toLocaleTimeString(
                        'id-ID',
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
