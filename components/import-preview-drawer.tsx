'use client';

import { useRouter } from 'next/navigation';
import {
  RiDeleteBinLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
} from '@remixicon/react';

import { IMPORT_STATUS } from '@/lib/db/enum';
import { Import, useDeleteImport, useImport } from '@/hooks/use-imports';
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

  const handleViewDetails = () => {
    if (importId) {
      router.push(`/imports/${importId}`);
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
            onViewDetails={handleViewDetails}
            onDelete={handleDelete}
            isDeleting={deleteImportMutation.isPending}
            disabled={!importData}
            canEdit={importData.status === IMPORT_STATUS.PENDING}
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

      {importData.items && importData.items.length > 0 && (
        <>
          <Divider.Root variant='solid-text'>
            Import Items ({importData.items.length})
          </Divider.Root>

          <div className='flex flex-col gap-4 p-5'>
            {importData.items.map((item, index) => (
              <div
                key={item.id || index}
                className='rounded-lg border border-stroke-soft-200 p-4'
              >
                <div className='mb-2 flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='text-label-sm font-medium text-text-strong-950'>
                      {item.name}
                    </div>
                    {item.description && (
                      <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className='text-right'>
                    <div className='text-label-sm font-medium text-text-strong-950'>
                      {item.quantity}x
                    </div>
                    <div className='text-paragraph-xs text-text-sub-600'>
                      {formatCurrency(parseFloat(item.priceRMB))}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2 text-paragraph-xs text-text-sub-600'>
                  <div>Category: {item.category}</div>
                  <div>
                    Total:{' '}
                    {formatCurrency(parseFloat(item.priceRMB) * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

interface ImportPreviewFooterProps {
  onEdit: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  disabled: boolean;
  canEdit: boolean;
}

function ImportPreviewFooter({
  onEdit,
  onViewDetails,
  onDelete,
  isDeleting,
  disabled,
  canEdit,
}: ImportPreviewFooterProps) {
  return (
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='neutral'
        mode='stroke'
        size='medium'
        className='w-full'
        onClick={onViewDetails}
        disabled={disabled}
      >
        <Button.Icon as={RiExternalLinkLine} />
        View
      </Button.Root>
      {canEdit && (
        <Button.Root
          variant='primary'
          size='medium'
          className='w-full'
          onClick={onEdit}
          disabled={disabled}
        >
          <RiEditLine className='size-4' />
          Edit
        </Button.Root>
      )}
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
    </Drawer.Footer>
  );
}
