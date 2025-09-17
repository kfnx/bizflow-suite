'use client';

import {
  RiEditLine,
  RiMailSendLine,
  RiMoneyDollarCircleLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { formatCurrency } from '@/utils/number-formatter';
import { InvoiceDetail } from '@/hooks/use-invoices';
import * as Button from '@/components/ui/button';
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge';

interface InvoiceHeaderProps {
  invoice: InvoiceDetail;
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const handleEdit = () => {
    if (invoice.status !== 'draft') {
      toast.warning('Only draft invoices can be edited');
      return;
    }
    window.location.href = `/invoices/${invoice.id}/edit`;
  };

  const handleSendInvoice = async () => {
    if (invoice.status !== 'draft') {
      toast.warning('Only draft invoices can be sent');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send invoice ${invoice.invoiceNumber} to the customer?`,
      )
    ) {
      return;
    }

    try {
      // TODO: Implement send invoice API call
      toast.success('Invoice sent successfully! (TODO)');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send invoice',
      );
    }
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
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to mark invoice as paid',
      );
    }
  };

  return (
    <div className='flex items-center gap-6'>
      <div className='flex w-full justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Status:</span>
          <InvoiceStatusBadge status={invoice.status as any} size='medium' />
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Due Date:</span>
          <span className='font-medium'>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Total:</span>
          <span className='text-lg text-gray-900 font-semibold'>
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
        </div>

        <div className='flex justify-end gap-2'>
          {invoice.status === 'draft' && (
            <Button.Root
              variant='primary'
              size='small'
              onClick={handleSendInvoice}
            >
              <RiMailSendLine className='size-4' />
              Send
            </Button.Root>
          )}

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
            <Button.Root variant='primary' size='small' onClick={handleEdit}>
              <RiEditLine className='size-4' />
              Edit
            </Button.Root>
          )}
        </div>
      </div>
    </div>
  );
}
