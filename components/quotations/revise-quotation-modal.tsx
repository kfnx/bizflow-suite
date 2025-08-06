'use client';

import { useState } from 'react';
import { RiCloseLine, RiRefreshLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as TextArea from '@/components/ui/textarea';

interface ReviseQuotationModalProps {
  quotationId: string;
  quotationNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviseQuotationModal({
  quotationId,
  quotationNumber,
  isOpen,
  onClose,
}: ReviseQuotationModalProps) {
  const [revisionReason, setRevisionReason] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!revisionReason.trim()) {
      alert('Please provide a reason for revision');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quotations/${quotationId}/revise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          revisionReason: revisionReason.trim(),
          responseNotes: responseNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request revision');
      }

      // Invalidate and refetch quotations
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      await queryClient.invalidateQueries({
        queryKey: ['quotation', quotationId],
      });

      alert(
        'Quotation revision requested successfully. The quotation has been returned to draft status for editing.',
      );

      // Reset form and close modal
      setRevisionReason('');
      setResponseNotes('');
      onClose();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to request revision',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRevisionReason('');
      setResponseNotes('');
      onClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Request Quotation Revision</Modal.Title>
          <Modal.Description>
            Request revision for quotation {quotationNumber}. This will return
            the quotation to draft status for editing.
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-4'>
            <div>
              <label
                htmlFor='revisionReason'
                className='text-sm text-gray-700 mb-2 block font-medium'
              >
                Reason for Revision *
              </label>
              <TextArea.Root
                id='revisionReason'
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder='Please provide details about what needs to be revised in this quotation...'
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor='responseNotes'
                className='text-sm text-gray-700 mb-2 block font-medium'
              >
                Additional Notes (Optional)
              </label>
              <TextArea.Root
                id='responseNotes'
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder='Any additional notes or comments...'
                disabled={isSubmitting}
              />
            </div>

            <p className='p-2 text-paragraph-sm text-text-sub-600'>
              *This will return the quotation to draft status for editing.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <RiCloseLine className='size-4' />
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='neutral'
              disabled={isSubmitting || !revisionReason.trim()}
            >
              <RiRefreshLine className='size-4' />
              {isSubmitting ? 'Requesting...' : 'Request Revision'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
