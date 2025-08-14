'use client';

import React from 'react';
import {
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useInvoiceDetail, type InvoiceDetail } from '@/hooks/use-invoices';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge';

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
              {invoice.customerName} •{' '}
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </div>
          </div>
          <InvoiceStatusBadge status={invoice.status as any} size='medium' />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-paragraph-sm text-text-sub-600'>
              Subtotal:
            </span>
            <span className='text-paragraph-sm text-text-strong-950'>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </span>
          </div>
          {invoice.isIncludePPN && parseFloat(invoice.tax) > 0 && (
            <div className='flex items-center justify-between'>
              <span className='text-paragraph-sm text-text-sub-600'>
                PPN (11%):
              </span>
              <span className='text-paragraph-sm text-text-strong-950'>
                {formatCurrency(invoice.tax, invoice.currency)}
              </span>
            </div>
          )}
          <div className='flex items-center justify-between border-t border-stroke-soft-200 pt-2'>
            <span className='text-title-h4 text-text-strong-950'>Total:</span>
            <span className='text-title-h4 text-text-strong-950'>
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Due Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Currency
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {invoice.currency}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        {invoice.contractNumber && (
          <>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Contract Number
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {invoice.contractNumber}
              </div>
            </div>
            <Divider.Root variant='line-spacing' />
          </>
        )}

        {invoice.customerPoNumber && (
          <>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Customer PO Number
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {invoice.customerPoNumber}
              </div>
            </div>
            <Divider.Root variant='line-spacing' />
          </>
        )}

        {invoice.paymentTerms && (
          <>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Payment Terms
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {invoice.paymentTerms}
              </div>
            </div>
            <Divider.Root variant='line-spacing' />
          </>
        )}

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Branch
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {invoice.branchName || '—'}
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

        {invoice.quotationNumber && (
          <>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                From Quotation
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {invoice.quotationNumber}
              </div>
            </div>
            <Divider.Root variant='line-spacing' />
          </>
        )}

        {(invoice.salesmanUser || invoice.salesmanUserId) && (
          <>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Salesman
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {invoice.salesmanUser
                  ? `${invoice.salesmanUser.firstName} ${invoice.salesmanUser.lastName}`
                  : invoice.salesmanUserId}
              </div>
            </div>
            <Divider.Root variant='line-spacing' />
          </>
        )}

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
            {new Date(invoice.createdAt).toLocaleDateString()}
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
              {invoice.items.slice(0, 3).map((item, index) => (
                <div key={`${item.productId}-${index}`} className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <div className='min-w-0 flex-1'>
                      <div className='truncate text-label-sm text-text-strong-950'>
                        {item.name}
                      </div>
                      {item.category && (
                        <div className='text-paragraph-xs capitalize text-text-soft-400'>
                          {item.category}
                        </div>
                      )}
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
                  {item.additionalSpecs && (
                    <div className='text-paragraph-xs italic text-text-sub-600'>
                      {item.additionalSpecs.length > 60
                        ? `${item.additionalSpecs.substring(0, 60)}...`
                        : item.additionalSpecs}
                    </div>
                  )}
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
      toast.warning('Only draft invoices can be edited');
      return;
    }
    window.location.href = `/invoices/${invoice.id}/edit`;
  };

  const handleMarkAsPaid = async () => {
    if (invoice.status === 'paid') {
      toast.warning('Invoice is already marked as paid');
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
      toast.success('Invoice marked as paid successfully!');
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
  const { data, isLoading, error } = useInvoiceDetail(invoiceId || '');

  if (!open || !invoiceId) return null;

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
