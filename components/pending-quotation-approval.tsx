'use client';

import { useState } from 'react';
import {
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileTextLine,
  RiInformationLine,
  RiTimeLine,
  RiUserLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { formatCurrency } from '@/utils/number-formatter';
import {
  useApproveQuotation,
  usePendingQuotations,
  useRejectQuotation,
  type PendingQuotation,
} from '@/hooks/use-pending-quotations';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Modal from '@/components/ui/modal';
import * as Textarea from '@/components/ui/textarea';

interface PendingQuotationCardProps {
  quotation: PendingQuotation;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

function PendingQuotationCard({
  quotation,
  onApprove,
  onReject,
}: PendingQuotationCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(quotation.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <div className='shadow-sm rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
      {/* Header Section */}
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex-1'>
          <div className='mb-3 flex items-center gap-3'>
            <h3 className='text-xl font-semibold text-text-sub-600'>
              {quotation.quotationNumber}
            </h3>
            <Badge.Root variant='lighter' color='blue' size='medium'>
              Pending Approval
            </Badge.Root>
          </div>

          {/* Customer Information */}
          <div className='mb-3'>
            <h4 className='mb-1 text-paragraph-sm font-medium text-text-sub-600'>
              Customer Information
            </h4>
            <p className='text-text-600 mb-1 text-paragraph-sm'>
              <span className='font-medium'>Name:</span>{' '}
              {quotation.customerName}
            </p>
            <p className='text-text-600 text-paragraph-sm'>
              <span className='font-medium'>Code:</span>{' '}
              {quotation.customerCode}
            </p>
          </div>

          {/* Dates Information */}
          <div className='mb-3'>
            <h4 className='mb-1 text-paragraph-sm font-medium text-text-sub-600'>
              Important Dates
            </h4>
            <div className='text-sm text-text-600 flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <RiCalendarLine className='h-4 w-4' />
                <span>Created: {formatDate(quotation.quotationDate)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <RiTimeLine className='h-4 w-4' />
                <span>Valid until: {formatDate(quotation.validUntil)}</span>
              </div>
            </div>
          </div>

          {/* Creator Information */}
          <div className='mb-3'>
            <h4 className='mb-1 text-paragraph-sm font-medium text-text-sub-600'>
              Created By
            </h4>
            <div className='text-sm text-text-600 flex items-center gap-1'>
              <RiUserLine className='h-4 w-4' />
              <span>{quotation.createdByUser}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className='text-right'>
          <div className='mb-2'>
            <p className='text-3xl font-bold text-text-sub-600'>
              {formatCurrency(quotation.total, 'IDR')}
            </p>
            <p className='text-text-600 text-paragraph-sm'>
              {quotation.items.length} item
              {quotation.items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Financial Breakdown */}
          <div className='text-sm space-y-1'>
            <div className='flex justify-between gap-4'>
              <span className='text-text-600'>Subtotal:</span>
              <span className='text-text-sub-600'>
                {formatCurrency(quotation.subtotal, 'IDR')}
              </span>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-text-600'>Tax:</span>
              <span className='text-text-sub-600'>
                {formatCurrency(quotation.tax, 'IDR')}
              </span>
            </div>
            <Divider.Root className='my-1' />
            <div className='flex justify-between gap-4 font-medium'>
              <span className='text-text-sub-600'>Total:</span>
              <span className='text-text-sub-600'>
                {formatCurrency(quotation.total, 'IDR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className='mb-4 space-y-4'>
          {/* Items Section */}
          <div className='rounded-lg bg-bg-weak-50 p-4'>
            <h4 className='mb-3 flex items-center gap-2 font-medium text-text-sub-600'>
              <RiFileTextLine className='h-4 w-4' />
              Quotation Items
            </h4>
            <div className='space-y-3'>
              {quotation.items.map((item, index) => (
                <div
                  key={item.id}
                  className='rounded-lg border border-stroke-soft-200 bg-white p-3'
                >
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <span className='text-xs bg-bg-weak-100 text-text-600 rounded px-2 py-1'>
                          #{index + 1}
                        </span>
                        <p className='font-medium text-text-sub-600'>
                          {item.name}
                        </p>
                      </div>
                      <p className='text-text-600 mb-1 text-paragraph-sm'>
                        Product Code: {item.productCode}
                      </p>
                      {item.notes && (
                        <p className='text-text-600 text-paragraph-sm italic'>
                          Notes: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='text-text-600 text-paragraph-sm'>
                        {item.quantity} ×{' '}
                        {formatCurrency(item.unitPrice, 'IDR')}
                      </p>
                      <p className='font-medium text-text-sub-600'>
                        {formatCurrency(item.total, 'IDR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          {quotation.notes && (
            <div className='rounded-lg bg-bg-weak-50 p-4'>
              <h4 className='mb-2 flex items-center gap-2 font-medium text-text-sub-600'>
                <RiInformationLine className='h-4 w-4' />
                Notes
              </h4>
              <p className='text-text-600 text-paragraph-sm'>
                {quotation.notes}
              </p>
            </div>
          )}

          {/* Terms and Conditions Section */}
          {quotation.termsAndConditions && (
            <div className='rounded-lg bg-bg-weak-50 p-4'>
              <h4 className='mb-2 flex items-center gap-2 font-medium text-text-sub-600'>
                <RiFileTextLine className='h-4 w-4' />
                Terms & Conditions
              </h4>
              <p className='text-text-600 whitespace-pre-wrap text-paragraph-sm'>
                {quotation.termsAndConditions}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className='rounded-lg bg-bg-weak-50 p-4'>
            <h4 className='mb-2 font-medium text-text-sub-600'>Timestamps</h4>
            <div className='text-sm grid grid-cols-2 gap-4'>
              <div>
                <span className='text-text-600'>Created:</span>
                <p className='text-text-sub-600'>
                  {formatDate(quotation.createdAt)}
                </p>
              </div>
              <div>
                <span className='text-text-600'>Last Updated:</span>
                <p className='text-text-sub-600'>
                  {formatDate(quotation.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex items-center justify-between'>
        <Button.Root
          variant='neutral'
          mode='lighter'
          size='small'
          onClick={() => setShowDetails(!showDetails)}
        >
          <Button.Icon as={showDetails ? RiEyeOffLine : RiEyeLine} />
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button.Root>

        <div className='flex gap-2'>
          <Button.Root
            variant='primary'
            mode='filled'
            size='small'
            onClick={() => onApprove(quotation.id)}
          >
            <Button.Icon as={RiCheckLine} />
            Approve
          </Button.Root>
          <Button.Root
            variant='error'
            mode='filled'
            size='small'
            onClick={() => setShowRejectModal(true)}
          >
            <Button.Icon as={RiCloseLine} />
            Reject
          </Button.Root>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal.Root open={showRejectModal} onOpenChange={setShowRejectModal}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Reject Quotation</Modal.Title>
            <Modal.Description>
              Please provide a reason for rejecting this quotation.
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <Textarea.Root
              placeholder='Enter rejection reason...'
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant='neutral'
              mode='lighter'
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='error'
              mode='filled'
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Reject Quotation
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

export function PendingQuotationApproval() {
  const { data: quotationsResponse, isLoading, error } = usePendingQuotations();
  const approveQuotation = useApproveQuotation();
  const rejectQuotation = useRejectQuotation();

  const handleApprove = (id: string) => {
    approveQuotation.mutate(id);
  };

  const handleReject = (id: string, reason: string) => {
    rejectQuotation.mutate({ quotationId: id, reason });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-text-600'>Loading pending quotations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-error-base'>
          Error loading pending quotations: {error.message}
        </div>
      </div>
    );
  }

  if (!quotationsResponse?.data || quotationsResponse.data.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='text-text-600 mb-2'>No pending quotations</div>
          <div className='text-sm text-text-soft-400'>
            All quotations have been processed or there are no pending
            approvals.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {quotationsResponse.data.map((quotation: PendingQuotation) => (
        <PendingQuotationCard
          key={quotation.id}
          quotation={quotation}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}
