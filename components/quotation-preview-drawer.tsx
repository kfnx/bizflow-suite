'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiCloseLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiMailSendLine,
  RiSendPlaneLine,
} from '@remixicon/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { formatDate } from '@/utils/date-formatter';
import {
  useQuotationDetail,
  useSendQuotation,
  useSubmitQuotation,
  type QuotationDetail,
} from '@/hooks/use-quotations';
import * as Button from '@/components/ui/button';
import * as Drawer from '@/components/ui/drawer';
import { QuotationStatusBadge } from '@/components/quotation-status-badge';

import { Asterisk } from './ui/label';

interface QuotationPreviewDrawerProps {
  quotationId: string | null;
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

function QuotationPreviewContent({
  quotation,
}: {
  quotation: QuotationDetail;
}) {
  const sendQuotationMutation = useSendQuotation();
  const submitQuotationMutation = useSubmitQuotation();

  const handleViewFull = () => {
    window.location.href = `/quotations/${quotation.id}`;
  };

  const handleEdit = () => {
    if (quotation.status !== 'draft') {
      alert('Only draft quotations can be edited');
      return;
    }
    window.location.href = `/quotations/${quotation.id}/edit`;
  };

  const handleSubmit = async () => {
    if (quotation.status !== 'draft') {
      alert('Only draft quotations can be submitted');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to submit quotation ${quotation.quotationNumber} for approval?`,
      )
    ) {
      return;
    }

    try {
      await submitQuotationMutation.mutateAsync(quotation.id);
      alert('Quotation submitted successfully!');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to submit quotation',
      );
    }
  };

  const handleSend = async () => {
    if (quotation.status !== 'approved') {
      alert('Only approved quotations can be sent');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send quotation ${quotation.quotationNumber} to the customer?`,
      )
    ) {
      return;
    }

    try {
      await sendQuotationMutation.mutateAsync(quotation.id);
      alert('Quotation sent successfully!');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to send quotation',
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
              {quotation.quotationNumber}
            </h2>
            <p className='text-sm text-gray-600'>
              {quotation.customerName} • {formatDate(quotation.quotationDate)}
            </p>
          </div>
          <QuotationStatusBadge
            status={quotation.status as any}
            size='medium'
          />
        </div>

        {quotation.status === QUOTATION_STATUS.SUBMITTED && (
          <p className='text-sm text-gray-500 mb-4 italic'>
            <Asterisk />
            pending approval
          </p>
        )}

        <div className='flex items-center gap-2'>
          <Button.Root variant='primary' size='small' onClick={handleViewFull}>
            <RiExternalLinkLine className='size-4' />
            View Full Details
          </Button.Root>

          {quotation.status === 'approved' && (
            <Button.Root
              variant='primary'
              size='small'
              onClick={handleSend}
              disabled={sendQuotationMutation.isPending}
            >
              <RiMailSendLine className='size-4' />
              {sendQuotationMutation.isPending ? 'Sending...' : 'Send'}
            </Button.Root>
          )}

          {quotation.status === 'draft' && (
            <>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                onClick={handleEdit}
              >
                <RiEditLine className='size-4' />
                Edit
              </Button.Root>
              <Button.Root
                variant='primary'
                mode='stroke'
                size='small'
                onClick={handleSubmit}
              >
                <RiSendPlaneLine className='size-4' />
                Submit
              </Button.Root>
            </>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            Valid Until
          </label>
          <p className='text-sm text-gray-900 mt-1 font-medium'>
            {formatDate(quotation.validUntil)}
          </p>
        </div>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            Total Amount
          </label>
          <p className='text-lg text-gray-900 mt-1 font-semibold'>
            {formatCurrency(quotation.total, quotation.currency)}
          </p>
        </div>
      </div>

      {/* Line Items Summary */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>
          Items ({quotation.items.length})
        </h3>
        {quotation.items.length === 0 ? (
          <p className='text-sm text-gray-500'>No items in this quotation</p>
        ) : (
          <div className='space-y-2'>
            {quotation.items.slice(0, 3).map((item) => (
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
                    {formatCurrency(item.unitPrice, quotation.currency)}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {formatCurrency(item.total, quotation.currency)}
                  </p>
                </div>
              </div>
            ))}

            {quotation.items.length > 3 && (
              <div className='text-center'>
                <p className='text-sm text-gray-500'>
                  +{quotation.items.length - 3} more items
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes */}
      {quotation.notes && (
        <div>
          <h3 className='text-sm text-gray-900 mb-2 font-medium'>Notes</h3>
          <div className='bg-gray-50 rounded-lg p-3'>
            <p className='text-sm text-gray-700 line-clamp-3'>
              {quotation.notes}
            </p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className='text-xs text-gray-500 border-t pt-4'>
        Created by {quotation.createdByUser} on{' '}
        {formatDate(quotation.createdAt)}
      </div>
    </div>
  );
}

export function QuotationPreviewDrawer({
  quotationId,
  open,
  onClose,
}: QuotationPreviewDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, error } = useQuotationDetail(quotationId || '');

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

  if (!open || !quotationId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className={isMobile ? 'max-w-full' : 'max-w-md'}>
        {/* Header */}
        <Drawer.Header>
          <h1 className='text-lg text-gray-900 w-full font-semibold'>
            Quick Preview
          </h1>
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
            <QuotationPreviewContent quotation={data.data} />
          )}
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
