'use client';

import { useState } from 'react';
import {
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
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
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-3'>
            <h3 className='text-lg font-semibold text-text-strong-950'>
              {quotation.quotationNumber}
            </h3>
            <Badge.Root variant='light' color='blue' size='medium'>
              Pending Approval
            </Badge.Root>
          </div>
          <p className='text-sm text-text-600 mb-1'>
            Customer: {quotation.customerName} ({quotation.customerCode})
          </p>
          <p className='text-sm text-text-600 mb-1'>
            Created by: {quotation.createdByUser}
          </p>
          <p className='text-sm text-text-600'>
            Valid until: {formatDate(quotation.validUntil)}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-bold text-text-strong-950'>
            {formatCurrency(quotation.total, quotation.currency)}
          </p>
          <p className='text-sm text-text-600'>
            {quotation.items.length} item
            {quotation.items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {showDetails && (
        <div className='mb-4 rounded-lg bg-bg-weak-50 p-4'>
          <h4 className='mb-3 font-medium text-text-strong-950'>Items</h4>
          <div className='space-y-2'>
            {quotation.items.map((item) => (
              <div
                key={item.id}
                className='text-sm flex items-center justify-between'
              >
                <div className='flex-1'>
                  <p className='font-medium text-text-strong-950'>
                    {item.productName}
                  </p>
                  <p className='text-text-600'>{item.productCode}</p>
                </div>
                <div className='text-right'>
                  <p className='text-text-strong-950'>
                    {item.quantity} ×{' '}
                    {formatCurrency(item.unitPrice, quotation.currency)}
                  </p>
                  <p className='font-medium text-text-strong-950'>
                    {formatCurrency(item.total, quotation.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {quotation.notes && (
            <div className='mt-4 border-t border-stroke-soft-200 pt-4'>
              <h4 className='mb-2 font-medium text-text-strong-950'>Notes</h4>
              <p className='text-sm text-text-600'>{quotation.notes}</p>
            </div>
          )}
        </div>
      )}

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
