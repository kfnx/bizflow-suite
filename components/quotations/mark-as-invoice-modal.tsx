'use client';

import { useEffect, useState } from 'react';
import { RiFileTextLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Textarea from '@/components/ui/textarea';

interface MarkAsInvoiceModalProps {
  quotationId: string;
  quotationNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MarkAsInvoiceModal({
  quotationId,
  quotationNumber,
  isOpen,
  onClose,
}: MarkAsInvoiceModalProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewNumber, setPreviewNumber] = useState('');
  const queryClient = useQueryClient();

  // Set default dates and fetch preview number when modal opens
  useEffect(() => {
    if (isOpen && !invoiceDate && !dueDate) {
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);

      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      setInvoiceDate(formatDate(today));
      setDueDate(formatDate(twoWeeksFromNow));
    }
  }, [isOpen, invoiceDate, dueDate]);

  // Fetch preview invoice number when modal opens and set as default value
  useEffect(() => {
    if (isOpen && !previewNumber) {
      const fetchPreviewNumber = async () => {
        try {
          const response = await fetch('/api/invoices/latest-number');
          if (response.ok) {
            const data = await response.json();
            setPreviewNumber(data.data.invoiceNumber);
            // Set the preview number as the default value in the input field
            setInvoiceNumber(data.data.invoiceNumber);
          }
        } catch (error) {
          console.error('Error fetching preview invoice number:', error);
        }
      };

      fetchPreviewNumber();
    }
  }, [isOpen, previewNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber.trim()) {
      toast.warning('Please provide an Invoice Number');
      return;
    }

    if (!invoiceDate.trim()) {
      toast.warning('Please provide an Invoice Date');
      return;
    }

    if (!dueDate.trim()) {
      toast.warning('Please provide a Due Date');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/quotations/${quotationId}/mark-invoiced`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceNumber: invoiceNumber.trim(),
            invoiceDate: invoiceDate.trim(),
            dueDate: dueDate.trim(),
            notes: notes.trim() || null,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to mark quotation as invoiced',
        );
      }

      // Invalidate and refetch quotations
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      await queryClient.invalidateQueries({
        queryKey: ['quotation', quotationId],
      });

      toast.success('Quotation marked as invoiced');

      // Reset form and close modal
      setInvoiceNumber('');
      setInvoiceDate('');
      setDueDate('');
      setNotes('');
      setPreviewNumber('');
      onClose();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to mark quotation as invoiced',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setInvoiceNumber('');
      setInvoiceDate('');
      setDueDate('');
      setNotes('');
      setPreviewNumber('');
      onClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='sm:max-w-md'>
        <Modal.Header>
          <Modal.Title>Mark as Invoice</Modal.Title>
          <Modal.Description>
            Mark quotation {quotationNumber} as invoiced by providing the
            invoice details.
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4 p-6'>
            <div>
              <Label.Root htmlFor='invoiceNumber'>
                Invoice Number <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='invoiceNumber'
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder='Enter invoice number (e.g., INV/2025/001)'
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div>
              <Label.Root htmlFor='invoiceDate'>
                Invoice Date <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='invoiceDate'
                    type='date'
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div>
              <Label.Root htmlFor='dueDate'>
                Due Date <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='dueDate'
                    type='date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div>
              <Label.Root htmlFor='notes'>Notes (Optional)</Label.Root>
              <Textarea.Root
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Add any additional notes about the invoice'
              />
            </div>
          </div>

          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={isSubmitting}
            >
              <RiFileTextLine className='size-4' />
              {isSubmitting ? 'Marking...' : 'Mark as Invoice'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
