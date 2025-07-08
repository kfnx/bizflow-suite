'use client';

import { useState } from 'react';
import { RiCheckLine, RiCloseLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as TextArea from '@/components/ui/textarea';

interface AcceptQuotationModalProps {
  quotationId: string;
  quotationNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

interface AcceptQuotationData {
  acceptanceInfo: string;
  responseNotes?: string;
}

export function AcceptQuotationModal({
  quotationId,
  quotationNumber,
  isOpen,
  onClose,
}: AcceptQuotationModalProps) {
  const [acceptanceInfo, setAcceptanceInfo] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptanceInfo.trim()) {
      alert('Please provide acceptance information');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quotations/${quotationId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acceptanceInfo: acceptanceInfo.trim(),
          responseNotes: responseNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept quotation');
      }

      // Invalidate and refetch quotations
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      await queryClient.invalidateQueries({
        queryKey: ['quotation', quotationId],
      });

      alert('Quotation accepted successfully');

      // Reset form and close modal
      setAcceptanceInfo('');
      setResponseNotes('');
      onClose();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to accept quotation',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAcceptanceInfo('');
      setResponseNotes('');
      onClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Accept Quotation</Modal.Title>
          <Modal.Description>
            Accept quotation {quotationNumber} and provide acceptance
            information.
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-4'>
            <div>
              <label
                htmlFor='acceptanceInfo'
                className='text-sm text-gray-700 mb-2 block font-medium'
              >
                Acceptance Information *
              </label>
              <TextArea.Root
                id='acceptanceInfo'
                value={acceptanceInfo}
                onChange={(e) => setAcceptanceInfo(e.target.value)}
                placeholder='Please provide details about the acceptance terms, conditions, or any specific requirements...'
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
                rows={3}
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
              variant='primary'
              disabled={isSubmitting || !acceptanceInfo.trim()}
            >
              <RiCheckLine className='size-4' />
              {isSubmitting ? 'Accepting...' : 'Accept Quotation'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
