'use client';

import { useState } from 'react';
import { RiCloseLine, RiErrorWarningLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as TextArea from '@/components/ui/textarea';

interface RejectQuotationModalProps {
  quotationId: string;
  quotationNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RejectQuotationModal({
  quotationId,
  quotationNumber,
  isOpen,
  onClose,
}: RejectQuotationModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quotations/${quotationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
          responseNotes: responseNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject quotation');
      }

      // Invalidate and refetch quotations
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      await queryClient.invalidateQueries({
        queryKey: ['quotation', quotationId],
      });

      toast.success('Quotation rejected');

      // Reset form and close modal
      setRejectionReason('');
      setResponseNotes('');
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject quotation',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRejectionReason('');
      setResponseNotes('');
      onClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Reject Quotation</Modal.Title>
          <Modal.Description>
            Reject quotation {quotationNumber} and provide a reason for
            rejection.
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-4'>
            <div>
              <label
                htmlFor='rejectionReason'
                className='text-sm text-gray-700 mb-2 block font-medium'
              >
                Reason for Rejection *
              </label>
              <TextArea.Root
                id='rejectionReason'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder='Please provide a clear reason for rejecting this quotation...'
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
              variant='error'
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              <RiErrorWarningLine className='size-4' />
              {isSubmitting ? 'Rejecting...' : 'Reject Quotation'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
