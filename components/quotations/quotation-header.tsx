'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiFileTextLine,
  RiMailSendLine,
  RiMoreLine,
  RiPrinterLine,
  RiRefreshLine,
  RiShareLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import {
  canCreateInvoice,
  isQuotationInvoiced,
  QuotationDetail,
  useSendQuotation,
} from '@/hooks/use-quotations';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
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
    variant: 'light' as const,
    color: 'gray' as const,
  },
  submitted: {
    label: 'Submitted',
    variant: 'light' as const,
    color: 'blue' as const,
  },
  approved: {
    label: 'Approved',
    variant: 'light' as const,
    color: 'green' as const,
  },
  sent: {
    label: 'Sent',
    variant: 'light' as const,
    color: 'blue' as const,
  },
  accepted: {
    label: 'Accepted',
    variant: 'light' as const,
    color: 'green' as const,
  },
  rejected: {
    label: 'Rejected',
    variant: 'light' as const,
    color: 'red' as const,
  },
  revised: {
    label: 'Revised',
    variant: 'light' as const,
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
    if (quotation.status !== 'draft') {
      alert('Only draft quotations can be edited');
      return;
    }
    window.location.href = `/quotations/${quotation.id}/edit`;
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Quotation ${quotation.quotationNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  return (
    <div className='border-b pb-6'>
      {/* Breadcrumb */}
      <div className='text-sm text-gray-500 mb-4 flex items-center gap-2'>
        <Link
          href='/quotations'
          className='hover:text-gray-700 transition-colors'
        >
          Quotations
        </Link>
        <span>/</span>
        <span className='text-gray-900'>{quotation.quotationNumber}</span>
      </div>

      {/* Header Content */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <div className='mb-8 flex items-center gap-3'>
            <Link
              href='/quotations'
              className='text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors'
            >
              <RiArrowLeftLine className='size-5' />
              <span className='text-sm'>Back to Quotations</span>
            </Link>
          </div>
          <h1 className='text-2xl text-gray-900 font-semibold'>
            {quotation.quotationNumber}
          </h1>
          <p className='text-gray-600'>
            {quotation.customerName} • {formatDate(quotation.quotationDate)}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={handlePrint}
          >
            <RiPrinterLine className='size-4' />
            Print
          </Button.Root>

          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={handleShare}
          >
            <RiShareLine className='size-4' />
            Share
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

          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root variant='neutral' mode='ghost' size='small'>
                <RiMoreLine className='size-4' />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item
                onClick={() =>
                  (window.location.href = `/quotations/${quotation.id}/duplicate`)
                }
              >
                <RiFileTextLine className='size-4' />
                Duplicate
              </Dropdown.Item>
              {quotation.status === 'approved' && (
                <Dropdown.Item
                  onClick={handleSend}
                  disabled={sendQuotationMutation.isPending}
                >
                  <RiMailSendLine className='size-4' />
                  Send to Customer
                </Dropdown.Item>
              )}
              {quotation.status === 'sent' && (
                <>
                  <Dropdown.Item onClick={handleAccept}>
                    <RiCheckLine className='size-4' />
                    Accept Quotation
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleReject}>
                    <RiCloseLine className='size-4' />
                    Reject Quotation
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleRevise}>
                    <RiRefreshLine className='size-4' />
                    Request Revision
                  </Dropdown.Item>
                </>
              )}
              {quotation.status === 'draft' && (
                <Dropdown.Item onClick={handleEdit}>
                  <RiEditLine className='size-4' />
                  Edit Quotation
                </Dropdown.Item>
              )}
              {quotation.status === 'accepted' &&
                !isQuotationInvoiced(quotation) && (
                  <Dropdown.Item onClick={handleMarkAsInvoice}>
                    <RiFileTextLine className='size-4' />
                    Mark as Invoice
                  </Dropdown.Item>
                )}
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>

      {/* Status and Key Info */}
      <div className='text-sm flex items-center gap-6'>
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
              <Badge.Root variant='light' color='blue' size='medium'>
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
            {formatDate(quotation.validUntil)}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Total:</span>
          <span className='text-lg text-gray-900 font-semibold'>
            {formatCurrency(quotation.total, quotation.currency)}
          </span>
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
