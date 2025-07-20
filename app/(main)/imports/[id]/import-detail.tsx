'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiDeleteBinLine,
  RiEditLine,
  RiImportLine,
  RiVerifiedBadgeLine,
} from '@remixicon/react';

import { IMPORT_STATUS } from '@/lib/db/enum';
import {
  useDeleteImport,
  useImport,
  useVerifyImport,
} from '@/hooks/use-imports';
import { usePermissions } from '@/hooks/use-permissions';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface ImportDetailProps {
  id: string;
}

export function ImportDetail({ id }: ImportDetailProps) {
  const router = useRouter();
  const { data: importData, isLoading, error } = useImport(id);
  const deleteImportMutation = useDeleteImport();
  const verifyImportMutation = useVerifyImport();
  const { can } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEdit = () => {
    router.push(`/imports/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete this import record?',
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteImportMutation.mutateAsync(id);
      router.push('/imports');
    } catch (error) {
      console.error('Error deleting import:', error);
      setIsDeleting(false);
    }
  };

  const handleVerify = async () => {
    const confirmed = confirm(
      'Are you sure you want to verify this import? This will create products and stock movements.',
    );
    if (!confirmed) return;

    setIsVerifying(true);
    try {
      await verifyImportMutation.mutateAsync(id);
      router.refresh();
    } catch (error) {
      console.error('Error verifying import:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'RMB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'RMB' ? 'CNY' : currency,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: IMPORT_STATUS) => {
    switch (status) {
      case 'pending':
        return 'gray';
      case 'verified':
        return 'blue';
      default:
        return 'orange';
    }
  };

  if (isLoading) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Loading import details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-red-600'>Error loading import details</p>
      </div>
    );
  }

  if (!importData) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Import not found</p>
      </div>
    );
  }

  const canEdit = importData.status === IMPORT_STATUS.PENDING;
  const canVerify = importData.status === IMPORT_STATUS.PENDING && can('imports:verify');

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImportLine className='size-6 text-text-sub-600' />
          </div>
        }
        title={importData.invoiceNumber}
        description={`Import details • ${importData.supplierName}`}
      >
        <div className='flex items-center gap-3'>
          <Badge.Root
            variant='light'
            color={getStatusBadgeVariant(importData.status as IMPORT_STATUS)}
          >
            {importData.status}
          </Badge.Root>
          <BackButton href='/imports' label='Back to Imports' />
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {/* Action Buttons */}
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-end'>
          {canEdit && (
            <Button.Root variant='neutral' mode='stroke' onClick={handleEdit}>
              <RiEditLine className='mr-2 size-4' />
              Edit Import
            </Button.Root>
          )}

          <Button.Root
            variant='error'
            mode='stroke'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <RiDeleteBinLine className='mr-2 size-4' />
            {isDeleting ? 'Deleting...' : 'Delete Import'}
          </Button.Root>

          {canVerify && (
            <Button.Root
              variant='primary'
              onClick={handleVerify}
              disabled={isVerifying}
            >
              <RiVerifiedBadgeLine className='mr-2 size-4' />
              {isVerifying ? 'Verifying...' : 'Verify Import'}
            </Button.Root>
          )}
        </div>

        {/* Import Details */}
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <h3 className='text-lg text-gray-900 mb-4 font-medium'>
            Import Information
          </h3>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Supplier
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {importData.supplierName} ({importData.supplierCode})
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Warehouse
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {importData.warehouseName}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Import Date
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {new Date(importData.importDate).toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Invoice Date
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {new Date(importData.invoiceDate).toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Exchange Rate (RMB to IDR)
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {importData.exchangeRateRMBtoIDR}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Total Amount
              </div>
              <div className='mt-1 text-label-sm font-semibold text-text-strong-950'>
                {formatCurrency(importData.total, 'IDR')}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Created By
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {importData.createdByUser}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Created Date
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {new Date(importData.createdAt).toLocaleDateString()}
              </div>
            </div>

            {importData.verifiedBy && (
              <div>
                <div className='text-subheading-xs uppercase text-text-soft-400'>
                  Verified By
                </div>
                <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
                  <RiVerifiedBadgeLine className='size-4 text-green-600' />
                  {importData.verifiedBy}
                </div>
              </div>
            )}
          </div>

          {importData.notes && (
            <div className='mt-6'>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Notes
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {importData.notes}
              </div>
            </div>
          )}
        </div>

        {/* Import Items */}
        {importData.items && importData.items.length > 0 && (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Import Items ({importData.items.length})
            </h3>

            <div className='space-y-4'>
              {importData.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className='rounded-lg border border-stroke-soft-200 p-4'
                >
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='text-label-md font-medium text-text-strong-950'>
                        {item.name}
                      </div>
                      {item.description && (
                        <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className='text-right'>
                      <div className='text-label-md font-semibold text-text-strong-950'>
                        {item.quantity}x
                      </div>
                      <div className='text-paragraph-sm text-text-sub-600'>
                        {formatCurrency(parseFloat(item.priceRMB))} each
                      </div>
                    </div>
                  </div>

                  <Divider.Root variant='line-spacing' />

                  <div className='grid grid-cols-2 gap-4 text-paragraph-sm text-text-sub-600 lg:grid-cols-4'>
                    <div>
                      <span className='font-medium'>Category:</span>{' '}
                      {item.category}
                    </div>
                    <div>
                      <span className='font-medium'>Condition:</span>{' '}
                      {item.condition}
                    </div>
                    <div>
                      <span className='font-medium'>Subtotal (RMB):</span>{' '}
                      {formatCurrency(
                        parseFloat(item.priceRMB) * item.quantity,
                      )}
                    </div>
                    <div>
                      <span className='font-medium'>Subtotal (IDR):</span>{' '}
                      {formatCurrency(
                        parseFloat(item.priceRMB) *
                          item.quantity *
                          importData.exchangeRateRMBtoIDR,
                        'IDR',
                      )}
                    </div>
                  </div>

                  {/* Category-specific details */}
                  {item.category === 'serialized' && (
                    <div className='mt-3 grid grid-cols-2 gap-4 text-paragraph-sm text-text-sub-600 lg:grid-cols-3'>
                      {item.machineNumber && (
                        <div>
                          <span className='font-medium'>Machine Number:</span>{' '}
                          {item.machineNumber}
                        </div>
                      )}
                      {item.engineNumber && (
                        <div>
                          <span className='font-medium'>Engine Number:</span>{' '}
                          {item.engineNumber}
                        </div>
                      )}
                      {item.modelNumber && (
                        <div>
                          <span className='font-medium'>Model:</span>{' '}
                          {item.modelNumber}
                        </div>
                      )}
                    </div>
                  )}

                  {(item.category === 'non_serialized' ||
                    item.category === 'bulk') && (
                    <div className='mt-3 grid grid-cols-2 gap-4 text-paragraph-sm text-text-sub-600 lg:grid-cols-3'>
                      {item.batchOrLotNumber && (
                        <div>
                          <span className='font-medium'>Batch/Lot:</span>{' '}
                          {item.batchOrLotNumber}
                        </div>
                      )}
                      {item.modelOrPartNumber && (
                        <div>
                          <span className='font-medium'>Part Number:</span>{' '}
                          {item.modelOrPartNumber}
                        </div>
                      )}
                      {item.brand && (
                        <div>
                          <span className='font-medium'>Brand:</span>{' '}
                          {item.brand}
                        </div>
                      )}
                    </div>
                  )}

                  {item.notes && (
                    <div className='mt-3 text-paragraph-sm text-text-sub-600'>
                      <span className='font-medium'>Notes:</span> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className='mt-6 rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-paragraph-md font-medium text-text-strong-950'>
                  Total Amount (IDR):
                </span>
                <span className='text-title-h4 font-semibold text-text-strong-950'>
                  {formatCurrency(importData.total, 'IDR')}
                </span>
              </div>
              <div className='mt-2 flex items-center justify-between text-paragraph-sm text-text-sub-600'>
                <span>
                  Subtotal (RMB):{' '}
                  {formatCurrency(
                    importData.items.reduce(
                      (sum, item) =>
                        sum + parseFloat(item.priceRMB) * item.quantity,
                      0,
                    ),
                  )}
                </span>
                <span>
                  Exchange Rate: {importData.exchangeRateRMBtoIDR} IDR per RMB
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
