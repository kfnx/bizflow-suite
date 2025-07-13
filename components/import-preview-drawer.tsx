'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiDeleteBinLine,
  RiEditLine,
  RiImportLine,
  RiLoader4Line,
} from '@remixicon/react';

import { Import, useDeleteImport, useImport } from '@/hooks/use-imports';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';

interface ImportPreviewDrawerProps {
  importId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ImportPreviewDrawer({
  importId,
  open,
  onClose,
}: ImportPreviewDrawerProps) {
  const router = useRouter();
  const { data: importData, isLoading, error } = useImport(importId);
  const deleteImportMutation = useDeleteImport();

  const handleEdit = () => {
    if (importId) {
      router.push(`/imports/${importId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!importId) return;

    const confirmed = confirm(
      'Are you sure you want to delete this import record?',
    );
    if (!confirmed) return;

    try {
      await deleteImportMutation.mutateAsync(importId);
      onClose();
    } catch (error) {
      console.error('Error deleting import:', error);
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <RiLoader4Line className='text-gray-400 size-6 animate-spin' />
              <span className='text-sm text-gray-500 ml-2'>Loading...</span>
            </div>
          )}

          {error && (
            <div className='py-8 text-center'>
              <p className='text-sm text-red-600'>
                Error loading import details
              </p>
            </div>
          )}

          {!isLoading && !error && !importData && (
            <div className='py-8 text-center'>
              <p className='text-sm text-gray-500'>Import not found</p>
            </div>
          )}

          {importData && !isLoading && !error && (
            <ImportPreviewContent importData={importData} />
          )}
        </Drawer.Body>

        {importData && !isLoading && !error && (
          <ImportPreviewFooter
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteImportMutation.isPending}
            disabled={!importData}
          />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}

interface ImportPreviewContentProps {
  importData: Import;
}

function ImportPreviewContent({ importData }: ImportPreviewContentProps) {
  const formatCurrency = (amount: number, currency: string = 'RMB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'RMB' ? 'CNY' : currency,
    }).format(amount);
  };

  return (
    <>
      <Divider.Root variant='solid-text'>Import Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3'>
          <div className='text-title-h4 text-text-strong-950'>
            {importData.invoiceNumber}
          </div>
          <div className='mt-1 text-paragraph-sm text-text-sub-600'>
            {importData.supplierName} •{' '}
            {new Date(importData.invoiceDate).toLocaleDateString()}
          </div>
        </div>

        <div className='text-title-h4 text-text-strong-950'>
          {formatCurrency(importData.total, 'IDR')}
        </div>
        <div className='mt-1 text-paragraph-sm text-text-sub-600'>
          Total Amount (IDR)
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Import Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(importData.importDate).toLocaleDateString()}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Warehouse
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {importData.warehouseName}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Subtotal (RMB)
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatCurrency(
              importData.items?.reduce(
                (sum, item) => sum + parseFloat(item.priceRMB) * item.quantity,
                0,
              ) || 0,
            )}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Exchange Rate
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {importData.exchangeRateRMBtoIDR}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created By
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {importData.createdByUser}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(importData.createdAt).toLocaleDateString()}
          </div>
        </div>

        {importData.notes && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Notes
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {importData.notes}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface ImportPreviewFooterProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  disabled: boolean;
}

function ImportPreviewFooter({
  onEdit,
  onDelete,
  isDeleting,
  disabled,
}: ImportPreviewFooterProps) {
  return (
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='error'
        mode='stroke'
        size='medium'
        className='w-full'
        onClick={onDelete}
        disabled={disabled || isDeleting}
      >
        <RiDeleteBinLine className='size-4' />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button.Root>
      <Button.Root
        variant='primary'
        size='medium'
        className='w-full'
        onClick={onEdit}
        disabled={disabled}
      >
        <RiEditLine className='size-4' />
        Edit Import
      </Button.Root>
    </Drawer.Footer>
  );
}
