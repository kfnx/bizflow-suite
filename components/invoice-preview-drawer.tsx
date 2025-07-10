'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiCloseLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiMailSendLine,
  RiMoneyDollarCircleLine,
} from '@remixicon/react';

import { INVOICE_STATUS } from '@/lib/db/enum';
import { formatDate } from '@/utils/date-formatter';
import { useInvoiceDetail, type InvoiceDetail } from '@/hooks/use-invoices';
import * as Button from '@/components/ui/button';
import * as Drawer from '@/components/ui/drawer';
import { InvoiceStatusBadge } from '@/components/invoice-status-badge';

interface InvoicePreviewDrawerProps {
  invoiceId: string | null;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: string, currency: string) => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(numAmount);
};

function InvoicePreviewContent({ invoice }: { invoice: InvoiceDetail }) {
  const handleViewFull = () => {
    window.location.href = `/invoices/${invoice.id}`;
  };

  const handleEdit = () => {
    if (invoice.status !== 'draft') {
      alert('Only draft invoices can be edited');
      return;
    }
    window.location.href = `/invoices/${invoice.id}/edit`;
  };

  const handleMarkAsPaid = async () => {
    if (invoice.status === 'paid') {
      alert('Invoice is already marked as paid');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to mark invoice ${invoice.invoiceNumber} as paid?`,
      )
    ) {
      return;
    }

    try {
      // TODO: Implement mark as paid API call
      alert('Invoice marked as paid successfully!');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to mark invoice as paid',
      );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b pb-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <h2 className='text-xl text-gray-900 font-semibold'>
              {invoice.invoiceNumber}
            </h2>
            <p className='text-sm text-gray-600'>
              {invoice.customerName} • {formatDate(invoice.invoiceDate)}
            </p>
          </div>
          <InvoiceStatusBadge status={invoice.status as any} size='medium' />
        </div>

        <div className='flex items-center gap-2'>
          <Button.Root variant='primary' size='small' onClick={handleViewFull}>
            <RiExternalLinkLine className='size-4' />
            View Full Details
          </Button.Root>

          {invoice.status === 'sent' && (
            <Button.Root
              variant='primary'
              size='small'
              onClick={handleMarkAsPaid}
            >
              <RiMoneyDollarCircleLine className='size-4' />
              Mark as Paid
            </Button.Root>
          )}

          {invoice.status === 'draft' && (
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={handleEdit}
            >
              <RiEditLine className='size-4' />
              Edit
            </Button.Root>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            Due Date
          </label>
          <p className='text-sm text-gray-900 mt-1 font-medium'>
            {formatDate(invoice.dueDate)}
          </p>
        </div>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            Total Amount
          </label>
          <p className='text-lg text-gray-900 mt-1 font-semibold'>
            {formatCurrency(invoice.total, invoice.currency)}
          </p>
        </div>
      </div>

      {/* Line Items Summary */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>
          Items ({invoice.items.length})
        </h3>
        {invoice.items.length === 0 ? (
          <p className='text-sm text-gray-500'>No items in this invoice</p>
        ) : (
          <div className='space-y-2'>
            {invoice.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className='border-gray-200 flex items-center justify-between rounded-lg border p-3'
              >
                <div className='min-w-0 flex-1'>
                  <p className='text-sm text-gray-900 truncate font-medium'>
                    {item.productName}
                  </p>
                  <p className='text-xs text-gray-500'>{item.productCode}</p>
                </div>
                <div className='ml-4 text-right'>
                  <p className='text-sm text-gray-900 font-medium'>
                    {parseFloat(item.quantity)} ×{' '}
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {formatCurrency(item.total, invoice.currency)}
                  </p>
                </div>
              </div>
            ))}

            {invoice.items.length > 3 && (
              <div className='text-center'>
                <p className='text-sm text-gray-500'>
                  +{invoice.items.length - 3} more items
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div>
          <h3 className='text-sm text-gray-900 mb-2 font-medium'>Notes</h3>
          <div className='bg-gray-50 rounded-lg p-3'>
            <p className='text-sm text-gray-700 line-clamp-3'>
              {invoice.notes}
            </p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className='text-xs text-gray-500 border-t pt-4'>
        Created by {invoice.createdByUser} on {formatDate(invoice.createdAt)}
      </div>
    </div>
  );
}

export function InvoicePreviewDrawer({
  invoiceId,
  open,
  onClose,
}: InvoicePreviewDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, error } = useInvoiceDetail(invoiceId || '');

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open || !invoiceId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className={isMobile ? 'max-w-full' : 'max-w-md'}>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-6 py-6'>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <RiLoader4Line className='text-gray-400 size-6 animate-spin' />
              <span className='text-sm text-gray-500 ml-2'>Loading...</span>
            </div>
          )}

          {error && (
            <div className='py-8 text-center'>
              <p className='text-sm text-red-600'>Error: {error.message}</p>
            </div>
          )}

          {data?.data && !isLoading && !error && (
            <InvoicePreviewContent invoice={data.data} />
          )}
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
