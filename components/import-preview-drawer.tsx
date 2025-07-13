'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiDeleteBinLine, RiEditLine, RiImportLine } from '@remixicon/react';

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

  const formatCurrency = (amount: number, currency: string = 'RMB') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'RMB' ? 'CNY' : currency,
    }).format(amount);
  };

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content>
        <Drawer.Header>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiImportLine className='size-5 text-text-sub-600' />
            </div>
            <div className='flex flex-col'>
              <div className='text-title-h4 text-text-strong-950'>
                Import Details
              </div>
              <div className='text-paragraph-sm text-text-sub-600'>
                {importData?.invoiceNumber || 'Loading...'}
              </div>
            </div>
          </div>
        </Drawer.Header>

        <Drawer.Body>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-text-sub-600'>
                Loading...
              </div>
            </div>
          )}

          {error && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-red-600'>
                Error loading import details
              </div>
            </div>
          )}

          {!isLoading && !error && !importData && (
            <div className='flex items-center justify-center py-8'>
              <div className='text-paragraph-sm text-text-sub-600'>
                Import not found
              </div>
            </div>
          )}

          {importData && (
            <div className='space-y-6'>
              <ImportPreviewContent importData={importData} />
            </div>
          )}
        </Drawer.Body>

        <ImportPreviewFooter
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteImportMutation.isPending}
          disabled={!importData}
        />
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
      <Divider.Root variant='solid-text'>Invoice Information</Divider.Root>
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-subheading-xs text-text-sub-600'>
              Invoice Number
            </div>
            <div className='text-paragraph-sm text-text-strong-950'>
              {importData.invoiceNumber}
            </div>
          </div>
          <div>
            <div className='text-subheading-xs text-text-sub-600'>
              Invoice Date
            </div>
            <div className='text-paragraph-sm text-text-strong-950'>
              {new Date(importData.invoiceDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div>
          <div className='text-subheading-xs text-text-sub-600'>
            Import Date
          </div>
          <div className='text-paragraph-sm text-text-strong-950'>
            {new Date(importData.importDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Supplier & Warehouse</Divider.Root>
      <div className='space-y-4'>
        <div>
          <div className='text-subheading-xs text-text-sub-600'>Supplier</div>
          <div className='text-paragraph-sm text-text-strong-950'>
            {importData.supplierName}
          </div>
        </div>
        <div>
          <div className='text-subheading-xs text-text-sub-600'>Warehouse</div>
          <div className='text-paragraph-sm text-text-strong-950'>
            {importData.warehouseName}
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Pricing</Divider.Root>
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-subheading-xs text-text-sub-600'>
              Subtotal (RMB)
            </div>
            <div className='text-paragraph-sm text-text-strong-950'>
              {formatCurrency(importData.subtotal)}
            </div>
          </div>
          <div>
            <div className='text-subheading-xs text-text-sub-600'>
              Exchange Rate
            </div>
            <div className='text-paragraph-sm text-text-strong-950'>
              {importData.exchangeRateRMB}
            </div>
          </div>
        </div>
        <div>
          <div className='text-subheading-xs text-text-sub-600'>
            Total (IDR)
          </div>
          <div className='text-paragraph-sm font-medium text-text-strong-950'>
            {formatCurrency(importData.total, 'IDR')}
          </div>
        </div>
      </div>

      {importData.notes && (
        <>
          <Divider.Root variant='solid-text'>Notes</Divider.Root>
          <div className='text-paragraph-sm text-text-sub-600'>
            {importData.notes}
          </div>
        </>
      )}

      <Divider.Root variant='solid-text'>Metadata</Divider.Root>
      <div className='space-y-4'>
        <div>
          <div className='text-subheading-xs text-text-sub-600'>Created By</div>
          <div className='text-paragraph-sm text-text-strong-950'>
            {importData.createdByUser}
          </div>
        </div>
        <div>
          <div className='text-subheading-xs text-text-sub-600'>Created At</div>
          <div className='text-paragraph-sm text-text-strong-950'>
            {new Date(importData.createdAt).toLocaleDateString()}
          </div>
        </div>
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
    <Drawer.Footer>
      <div className='flex justify-end gap-3'>
        <Button.Root
          variant='error'
          mode='ghost'
          size='medium'
          onClick={onDelete}
          disabled={disabled || isDeleting}
        >
          <RiDeleteBinLine className='size-4' />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button.Root>
        <Button.Root
          variant='primary'
          size='medium'
          onClick={onEdit}
          disabled={disabled}
        >
          <RiEditLine className='size-4' />
          Edit Import
        </Button.Root>
      </div>
    </Drawer.Footer>
  );
}
