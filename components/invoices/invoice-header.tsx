'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RiArrowLeftLine,
  RiEditLine,
  RiFileTextLine,
  RiMailSendLine,
  RiMoneyDollarCircleLine,
  RiMoreLine,
  RiPrinterLine,
  RiShareLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { InvoiceDetail } from '@/hooks/use-invoices';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
import { InvoiceStatusBadge } from '@/components/invoice-status-badge';

interface InvoiceHeaderProps {
  invoice: InvoiceDetail;
}

const formatCurrency = (amount: string, currency: string) => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(numAmount);
};

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const handleEdit = () => {
    if (invoice.status !== 'draft') {
      alert('Only draft invoices can be edited');
      return;
    }
    window.location.href = `/invoices/${invoice.id}/edit`;
  };

  const handleSendInvoice = async () => {
    if (invoice.status !== 'draft') {
      alert('Only draft invoices can be sent');
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
      alert('Invoice sent successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send invoice');
    }
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

  const handleVoidInvoice = async () => {
    if (invoice.status === 'void') {
      alert('Invoice is already voided');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to void invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      // TODO: Implement void invoice API call
      alert('Invoice voided successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to void invoice');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoice.invoiceNumber}`,
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
          href='/invoices'
          className='hover:text-gray-700 transition-colors'
        >
          Invoices
        </Link>
        <span>/</span>
        <span className='text-gray-900'>{invoice.invoiceNumber}</span>
      </div>

      {/* Header Content */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <div className='mb-2 flex items-center gap-3'>
            <Link
              href='/invoices'
              className='text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors'
            >
              <RiArrowLeftLine className='size-5' />
              <span className='text-sm'>Back to Invoices</span>
            </Link>
          </div>
          <h1 className='text-2xl text-gray-900 font-semibold'>
            {invoice.invoiceNumber}
          </h1>
          <p className='text-gray-600'>
            {invoice.customerName} • {formatDate(invoice.invoiceDate)}
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

          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root variant='neutral' mode='ghost' size='small'>
                <RiMoreLine className='size-4' />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item
                onClick={() =>
                  (window.location.href = `/invoices/${invoice.id}/duplicate`)
                }
              >
                <RiFileTextLine className='size-4' />
                Duplicate
              </Dropdown.Item>
              {invoice.status === 'draft' && (
                <>
                  <Dropdown.Item onClick={handleEdit}>
                    <RiEditLine className='size-4' />
                    Edit Invoice
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleSendInvoice}>
                    <RiMailSendLine className='size-4' />
                    Send Invoice
                  </Dropdown.Item>
                </>
              )}
              {invoice.status === 'sent' && (
                <Dropdown.Item onClick={handleMarkAsPaid}>
                  <RiMoneyDollarCircleLine className='size-4' />
                  Mark as Paid
                </Dropdown.Item>
              )}
              {(invoice.status === 'draft' || invoice.status === 'sent') && (
                <Dropdown.Item
                  onClick={handleVoidInvoice}
                  className='text-red-600'
                >
                  <RiFileTextLine className='size-4' />
                  Void Invoice
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
          <InvoiceStatusBadge status={invoice.status as any} size='medium' />
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Due Date:</span>
          <span className='font-medium'>{formatDate(invoice.dueDate)}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Total:</span>
          <span className='text-lg text-gray-900 font-semibold'>
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
