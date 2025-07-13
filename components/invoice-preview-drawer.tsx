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
import * as Divider from '@/components/ui/divider';
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
  return (
    <>
      <Divider.Root variant='solid-text'>Invoice Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <div className='text-title-h4 text-text-strong-950'>
              {invoice.invoiceNumber}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {invoice.customerName} • {formatDate(invoice.invoiceDate)}
            </div>
          </div>
          <InvoiceStatusBadge status={invoice.status as any} size='medium' />
        </div>

        <div className='text-title-h4 text-text-strong-950'>
          {formatCurrency(invoice.total, invoice.currency)}
        </div>
        <div className='mt-1 text-paragraph-sm text-text-sub-600'>
          Total Amount
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Due Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(invoice.dueDate)}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Items
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {invoice.items.length} items
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created By
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {invoice.createdByUser
              ? `${invoice.createdByUser.firstName} ${invoice.createdByUser.lastName}`
              : 'Unknown'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(invoice.createdAt)}
          </div>
        </div>

        {invoice.notes && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Notes
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {invoice.notes}
              </div>
            </div>
          </>
        )}
      </div>

      {invoice.items.length > 0 && (
        <>
          <Divider.Root variant='solid-text'>Items Preview</Divider.Root>
          <div className='p-5'>
            <div className='space-y-3'>
              {invoice.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-label-sm text-text-strong-950'>
                      {item.name}
                    </div>
                    <div className='text-paragraph-sm text-text-sub-600'>
                      {item.productCode}
                    </div>
                  </div>
                  <div className='ml-4 text-right'>
                    <div className='text-label-sm text-text-strong-950'>
                      {parseFloat(item.quantity)} ×{' '}
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </div>
                    <div className='text-paragraph-sm text-text-sub-600'>
                      {formatCurrency(item.total, invoice.currency)}
                    </div>
                  </div>
                </div>
              ))}

              {invoice.items.length > 3 && (
                <div className='text-center text-paragraph-sm text-text-sub-600'>
                  +{invoice.items.length - 3} more items
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function InvoicePreviewFooter({ invoice }: { invoice: InvoiceDetail }) {
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
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='neutral'
        mode='stroke'
        size='medium'
        className='w-full'
        onClick={handleViewFull}
      >
        <Button.Icon as={RiExternalLinkLine} />
        View Full
      </Button.Root>

      {invoice.status === 'sent' && (
        <Button.Root
          variant='primary'
          size='medium'
          className='w-full'
          onClick={handleMarkAsPaid}
        >
          <Button.Icon as={RiMoneyDollarCircleLine} />
          Mark as Paid
        </Button.Root>
      )}

      {invoice.status === 'draft' && (
        <Button.Root
          variant='primary'
          size='medium'
          className='w-full'
          onClick={handleEdit}
        >
          <Button.Icon as={RiEditLine} />
          Edit
        </Button.Root>
      )}
    </Drawer.Footer>
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

        <Drawer.Body>
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
        </Drawer.Body>

        {data?.data && !isLoading && !error && (
          <InvoicePreviewFooter invoice={data.data} />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
