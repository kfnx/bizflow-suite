'use client';

import React from 'react';
import {
  RiCalendarLine,
  RiCheckLine,
  RiExternalLinkLine,
  RiFileTextLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import type { PurchaseOrder } from '@/hooks/use-quotations';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';

interface PurchaseOrderInfoProps {
  purchaseOrder: PurchaseOrder;
  customerResponseDate?: string;
  customerResponseNotes?: string;
}

// Helper function to format approval type
const formatApprovalType = (approvalType: string) => {
  const typeMap: Record<string, string> = {
    formal_po: 'Formal PO',
    email_approval: 'Email Approval',
    whatsapp_approval: 'WhatsApp Approval',
    phone_call_approval: 'Phone Call Approval',
    in_person_approval: 'In-Person Approval',
  };
  return typeMap[approvalType] || approvalType;
};

export function PurchaseOrderInfo({
  purchaseOrder,
  customerResponseDate,
  customerResponseNotes,
}: PurchaseOrderInfoProps) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <RiFileTextLine className='h-5 w-5 text-blue-500' />
          <div>
            <div className='text-label-sm font-medium text-text-strong-950'>
              {purchaseOrder.number}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Purchase Order
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-1 rounded-full bg-green-100 px-2 py-1'>
          <RiCheckLine className='h-3 w-3 text-green-600' />
          <span className='text-xs font-medium text-green-700'>Accepted</span>
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            PO Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(purchaseOrder.date)}
          </div>
        </div>

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Approval Type
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatApprovalType(purchaseOrder.approvalType)}
          </div>
        </div>
      </div>

      {customerResponseDate && (
        <>
          <Divider.Root variant='line-spacing' />
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Customer Response Date
            </div>
            <div className='mt-1 text-label-sm text-text-strong-950'>
              {formatDate(customerResponseDate)}
            </div>
          </div>
        </>
      )}

      {customerResponseNotes && (
        <>
          <Divider.Root variant='line-spacing' />
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Customer Notes
            </div>
            <div className='mt-1 text-label-sm text-text-strong-950'>
              {customerResponseNotes}
            </div>
          </div>
        </>
      )}

      {purchaseOrder.document && (
        <>
          <Divider.Root variant='line-spacing' />
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Document
            </div>
            <div className='mt-1'>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                onClick={() => window.open(purchaseOrder.document, '_blank')}
              >
                <RiExternalLinkLine className='h-4 w-4' />
                View Document
              </Button.Root>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
