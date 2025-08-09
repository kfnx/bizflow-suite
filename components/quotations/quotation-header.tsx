'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiFileTextLine,
  RiMailSendLine,
  RiRefreshLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import {
  isQuotationInvoiced,
  QuotationDetail,
  useSendQuotation,
} from '@/hooks/use-quotations';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { AcceptQuotationModal } from '@/components/quotations/accept-quotation-modal';
import { MarkAsInvoiceModal } from '@/components/quotations/mark-as-invoice-modal';
import { RejectQuotationModal } from '@/components/quotations/reject-quotation-modal';
import { ReviseQuotationModal } from '@/components/quotations/revise-quotation-modal';

interface QuotationHeaderProps {
  quotation: QuotationDetail;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    variant: 'lighter' as const,
    color: 'gray' as const,
  },
  submitted: {
    label: 'Submitted',
    variant: 'lighter' as const,
    color: 'blue' as const,
  },
  approved: {
    label: 'Approved',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  sent: {
    label: 'Sent',
    variant: 'lighter' as const,
    color: 'blue' as const,
  },
  accepted: {
    label: 'Accepted',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  rejected: {
    label: 'Rejected',
    variant: 'lighter' as const,
    color: 'red' as const,
  },
  revised: {
    label: 'Revised',
    variant: 'lighter' as const,
    color: 'orange' as const,
  },
};

const formatCurrency = (amount: string, currency: string) => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(numAmount);
};

export function QuotationHeader({ quotation }: QuotationHeaderProps) {
  const status = statusConfig[quotation.status as keyof typeof statusConfig];
  const sendQuotationMutation = useSendQuotation();

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReviseModalOpen, setIsReviseModalOpen] = useState(false);
  const [isMarkAsInvoiceModalOpen, setIsMarkAsInvoiceModalOpen] =
    useState(false);

  const handleAccept = () => {
    setIsAcceptModalOpen(true);
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleRevise = () => {
    setIsReviseModalOpen(true);
  };

  const handleMarkAsInvoice = () => {
    setIsMarkAsInvoiceModalOpen(true);
  };

  const handleEdit = () => {
    if (
      quotation.status !== QUOTATION_STATUS.DRAFT &&
      quotation.status !== QUOTATION_STATUS.REVISED
    ) {
      toast.warning('Only draft and revised quotations can be edited');
      return;
    }
    window.location.href = `/quotations/${quotation.id}/edit`;
  };

  const handleSend = async () => {
    if (quotation.status !== 'approved') {
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

  return (
    <div className='w-full'>
      <div className='flex w-full items-end gap-2'>
        {/* Status and Key Info */}
        <div className='text-sm flex flex-1 gap-6'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>Status:</span>
            <Badge.Root
              variant={status.variant}
              color={status.color}
              size='medium'
            >
              {status.label}
            </Badge.Root>
            {isQuotationInvoiced(quotation) && (
              <div className='flex items-center gap-2'>
                <Badge.Root variant='lighter' color='blue' size='medium'>
                  Invoiced
                </Badge.Root>
                {quotation.invoiceId && (
                  <Link
                    href={`/invoices/${quotation.invoiceId}`}
                    className='text-xs text-blue-600 underline hover:text-blue-800'
                  >
                    View Invoice
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>Valid Until:</span>
            <span className='font-medium'>
              {new Date(quotation.validUntil).toLocaleDateString()}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>Total:</span>
            <span className='text-lg text-gray-900 font-semibold'>
              {formatCurrency(quotation.total, 'IDR')}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
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

          {quotation.status === 'sent' && (
            <>
              <Button.Root
                variant='primary'
                size='small'
                onClick={handleAccept}
              >
                <RiCheckLine className='size-4' />
                Accept
              </Button.Root>
              <Button.Root variant='error' size='small' onClick={handleReject}>
                <RiCloseLine className='size-4' />
                Reject
              </Button.Root>
              <Button.Root
                variant='neutral'
                size='small'
                onClick={handleRevise}
              >
                <RiRefreshLine className='size-4' />
                Revise
              </Button.Root>
            </>
          )}

          {quotation.status === 'draft' && (
            <Button.Root variant='primary' size='small' onClick={handleEdit}>
              <RiEditLine className='size-4' />
              Edit
            </Button.Root>
          )}

          {quotation.status === 'accepted' &&
            !isQuotationInvoiced(quotation) && (
              <Button.Root
                variant='primary'
                size='small'
                onClick={handleMarkAsInvoice}
              >
                <RiFileTextLine className='size-4' />
                Mark as Invoice
              </Button.Root>
            )}
        </div>
      </div>

      {/* Customer Response Modals */}
      <AcceptQuotationModal
        quotationId={quotation.id}
        quotationNumber={quotation.quotationNumber}
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
      />

      <RejectQuotationModal
        quotationId={quotation.id}
        quotationNumber={quotation.quotationNumber}
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
      />

      <ReviseQuotationModal
        quotationId={quotation.id}
        quotationNumber={quotation.quotationNumber}
        isOpen={isReviseModalOpen}
        onClose={() => setIsReviseModalOpen(false)}
      />

      <MarkAsInvoiceModal
        quotationId={quotation.id}
        quotationNumber={quotation.quotationNumber}
        isOpen={isMarkAsInvoiceModalOpen}
        onClose={() => setIsMarkAsInvoiceModalOpen(false)}
      />
    </div>
  );
}
