'use client';

import React from 'react';
import {
  RiBillLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiMailSendLine,
  RiSendPlaneLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import {
  useMarkQuotationAsInvoiced,
  useQuotationDetail,
  useSendQuotation,
  useSubmitQuotation,
  type QuotationDetail,
} from '@/hooks/use-quotations';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { PurchaseOrderInfo } from '@/components/quotations/purchase-order-info';
import { QuotationStatusBadge } from '@/components/quotations/quotation-status-badge';

import { Asterisk } from '../ui/label';

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
  return (
    <>
      <Divider.Root variant='solid-text'>Quotation Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <div className='text-title-h4 text-text-strong-950'>
              {quotation.quotationNumber}
              {quotation.revisionVersion > 0 && (
                <small className='ml-2 text-paragraph-sm text-text-sub-600'>
                  revision {quotation.revisionVersion}
                </small>
              )}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {quotation.customerName} •{' '}
              {new Date(quotation.quotationDate).toLocaleDateString()}
            </div>
          </div>
          <QuotationStatusBadge
            status={quotation.status as any}
            size='medium'
          />
        </div>

        {quotation.status === QUOTATION_STATUS.SUBMITTED && (
          <div className='mb-4 text-paragraph-sm italic text-text-sub-600'>
            <Asterisk />
            pending approval
          </div>
        )}

        <div className='text-title-h4 text-text-strong-950'>
          {formatCurrency(quotation.total, 'IDR')}
        </div>
        <div className='mt-1 text-paragraph-sm text-text-sub-600'>
          Total Amount
        </div>
      </div>

      {/* Purchase Order Section */}
      {quotation.purchaseOrder && (
        <>
          <Divider.Root variant='solid-text'>Purchase Order</Divider.Root>
          <div className='p-5'>
            <PurchaseOrderInfo
              purchaseOrder={quotation.purchaseOrder}
              customerResponseDate={quotation.customerResponseDate}
              customerResponseNotes={quotation.customerResponseNotes}
            />
          </div>
        </>
      )}

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Valid Until
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(quotation.validUntil).toLocaleDateString()}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Branch
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {quotation.branchName || '—'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Items
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {quotation.items.length} items
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created By
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {quotation.createdByUser}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {quotation.createdAt
              ? new Date(quotation.createdAt).toLocaleDateString()
              : '—'}
          </div>
        </div>

        {quotation.notes && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Notes
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {quotation.notes}
              </div>
            </div>
          </>
        )}

        {quotation.termsAndConditions && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Terms and Conditions
              </div>
              <pre className='mt-1 text-label-sm text-text-sub-600'>
                {quotation.termsAndConditions}
              </pre>
            </div>
          </>
        )}
      </div>

      {quotation.items.length > 0 && (
        <>
          <Divider.Root variant='solid-text'>Items</Divider.Root>
          <div className='p-5'>
            <div className='space-y-3'>
              {quotation.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-label-sm text-text-strong-950'>
                      {item.name}
                    </div>
                  </div>
                  <div className='ml-4 text-right'>
                    <div className='text-label-sm text-text-strong-950'>
                      {parseFloat(item.quantity)} ×{' '}
                      {formatCurrency(item.unitPrice, 'IDR')}
                    </div>
                    <div className='text-paragraph-sm text-text-sub-600'>
                      {formatCurrency(item.total, 'IDR')}
                    </div>
                  </div>
                </div>
              ))}

              {quotation.items.length > 3 && (
                <div className='text-center text-paragraph-sm text-text-sub-600'>
                  +{quotation.items.length - 3} more items
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function QuotationPreviewFooter({
  quotation,
  onClose,
}: {
  quotation: QuotationDetail;
  onClose: () => void;
}) {
  const sendQuotationMutation = useSendQuotation();
  const submitQuotationMutation = useSubmitQuotation();
  const markAsInvoiceMutation = useMarkQuotationAsInvoiced();

  const handleViewFull = () => {
    window.location.href = `/quotations/${quotation.id}`;
  };

  const handleEdit = () => {
    if (quotation.status !== QUOTATION_STATUS.DRAFT && quotation.status !== QUOTATION_STATUS.REVISED) {
      toast.warning('Only draft and revised quotations can be edited');
      return;
    }
    window.location.href = `/quotations/${quotation.id}/edit`;
  };

  const handleSubmit = async () => {
    if (quotation.status !== QUOTATION_STATUS.DRAFT && quotation.status !== QUOTATION_STATUS.REVISED) {
      toast.warning('Only draft and revised quotations can be submitted');
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
      toast.success('Quotation submitted successfully!');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to submit quotation',
      );
    }
  };

  const handleSend = async () => {
    if (quotation.status !== QUOTATION_STATUS.APPROVED) {
      toast.warning('Only approved quotations can be sent');
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
      toast.success('Quotation sent successfully!');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to send quotation',
      );
    }
  };

  const handleMarkAsInvoice = async () => {
    if (quotation.status !== QUOTATION_STATUS.ACCEPTED) {
      toast.warning('Only accepted quotations can be marked as invoice');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to mark quotation ${quotation.quotationNumber} as invoice?`,
      )
    ) {
      return;
    }

    try {
      await markAsInvoiceMutation.mutateAsync({
        quotationId: quotation.id,
      });
      onClose();
      // router.push(`/invoices`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to mark quotation as invoice',
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

      {(quotation.status === QUOTATION_STATUS.DRAFT || quotation.status === QUOTATION_STATUS.REVISED) && (
        <>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-full'
            onClick={handleEdit}
          >
            <Button.Icon as={RiEditLine} />
            Edit
          </Button.Root>
          {quotation.status === QUOTATION_STATUS.DRAFT && (
            <Button.Root
              variant='primary'
              size='medium'
              className='w-full'
              onClick={handleSubmit}
              disabled={submitQuotationMutation.isPending}
            >
              <Button.Icon as={RiSendPlaneLine} />
              {submitQuotationMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button.Root>
          )}
          {quotation.status === QUOTATION_STATUS.REVISED && (
            <Button.Root
              variant='primary'
              size='medium'
              className='w-full'
              onClick={handleSubmit}
              disabled={submitQuotationMutation.isPending}
            >
              <Button.Icon as={RiSendPlaneLine} />
              {submitQuotationMutation.isPending ? 'Resubmitting...' : 'Resubmit'}
            </Button.Root>
          )}
        </>
      )}

      {quotation.status === QUOTATION_STATUS.APPROVED && (
        <Button.Root
          variant='primary'
          size='medium'
          className='w-full'
          onClick={handleSend}
          disabled={sendQuotationMutation.isPending}
        >
          <Button.Icon as={RiMailSendLine} />
          {sendQuotationMutation.isPending ? 'Sending...' : 'Send'}
        </Button.Root>
      )}

      {quotation.status === QUOTATION_STATUS.ACCEPTED && (
        <Button.Root
          variant='primary'
          size='medium'
          className='w-full'
          onClick={handleMarkAsInvoice}
          disabled={markAsInvoiceMutation.isPending}
        >
          <Button.Icon as={RiBillLine} />
          {markAsInvoiceMutation.isPending ? 'Marking...' : 'Mark as Invoice'}
        </Button.Root>
      )}
    </Drawer.Footer>
  );
}

export function QuotationPreviewDrawer({
  quotationId,
  open,
  onClose,
}: QuotationPreviewDrawerProps) {
  const { data, isLoading, error } = useQuotationDetail(quotationId || '');

  if (!open || !quotationId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content>
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
            <QuotationPreviewContent quotation={data.data} />
          )}
        </Drawer.Body>

        {data?.data && !isLoading && !error && (
          <QuotationPreviewFooter quotation={data.data} onClose={onClose} />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
