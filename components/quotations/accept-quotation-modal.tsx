'use client';

import { useRef, useState } from 'react';
import {
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiUploadLine,
} from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';

interface AcceptQuotationModalProps {
  quotationId: string;
  quotationNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FileInfo {
  file: File;
  preview?: string;
}

export function AcceptQuotationModal({
  quotationId,
  quotationNumber,
  isOpen,
  onClose,
}: AcceptQuotationModalProps) {
  const [approvalType, setApprovalType] = useState('');
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [purchaseOrderDate, setPurchaseOrderDate] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      '.pdf',
      '.doc',
      '.docx',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
    ];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(fileExtension)) {
      toast.error(
        'Invalid file type. Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF',
      );
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Maximum size: 10MB');
      return;
    }

    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    setSelectedFile({ file, preview });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!approvalType.trim()) {
      toast.error('Please select an approval type');
      return;
    }

    if (!purchaseOrderNumber.trim()) {
      toast.error('Please enter a purchase order number');
      return;
    }

    if (!purchaseOrderDate.trim()) {
      toast.error('Please select a purchase order date');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('approvalType', approvalType.trim());
      formData.append('purchaseOrderNumber', purchaseOrderNumber.trim());
      formData.append('purchaseOrderDate', purchaseOrderDate.trim());
      formData.append('responseNotes', responseNotes.trim() || '');

      if (selectedFile) {
        formData.append('file', selectedFile.file);
      }

      const response = await fetch(`/api/quotations/${quotationId}/accept`, {
        method: 'POST',
        body: formData,
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

      toast.success('Quotation accepted successfully');

      // Reset form and close modal
      setApprovalType('');
      setPurchaseOrderNumber('');
      setPurchaseOrderDate('');
      setResponseNotes('');
      removeFile();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to accept quotation',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setApprovalType('');
      setPurchaseOrderNumber('');
      setPurchaseOrderDate('');
      setResponseNotes('');
      removeFile();
      onClose();
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='w-full max-w-2xl'>
        <Modal.Header>
          <Modal.Title>
            Accept Quotation - Purchase Order Information
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='max-h-[80vh] space-y-4 overflow-y-auto'>
            <div>
              <Label.Root
                htmlFor='approvalType'
                className='mb-2 block font-medium'
              >
                Approval Type <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={approvalType}
                onValueChange={(value) => setApprovalType(value)}
              >
                <Select.Trigger>
                  <Select.TriggerIcon as={RiCheckLine} />
                  <Select.Value placeholder='Select approval type' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='formal_po'>Formal PO</Select.Item>
                  <Select.Item value='email_approval'>
                    Email Approval
                  </Select.Item>
                  <Select.Item value='whatsapp_approval'>
                    WhatsApp Approval
                  </Select.Item>
                  <Select.Item value='phone_call_approval'>
                    Phone Call Approval
                  </Select.Item>
                  <Select.Item value='in_person_approval'>
                    In-Person Approval
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div>
              <Label.Root
                htmlFor='purchaseOrderNumber'
                className='mb-2 block font-medium'
              >
                Purchase Order Number <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='purchaseOrderNumber'
                    type='text'
                    placeholder='Enter PO number'
                    value={purchaseOrderNumber}
                    onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div>
              <Label.Root
                htmlFor='purchaseOrderDate'
                className='mb-2 block font-medium'
              >
                Purchase Order Date *
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='purchaseOrderDate'
                    type='date'
                    value={purchaseOrderDate}
                    onChange={(e) => setPurchaseOrderDate(e.target.value)}
                    required
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div>
              <Label.Root className='mb-2 block font-medium'>
                Purchase Order Document (Optional)
              </Label.Root>

              {!selectedFile ? (
                <div
                  className={`flex items-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RiUploadLine className='text-gray-400 h-16 w-16' />
                  <p className='mb-2 text-label-sm text-text-soft-400'>
                    Drag and drop a file here, or click to select
                  </p>
                  <input
                    ref={fileInputRef}
                    type='file'
                    className='hidden'
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'
                    onChange={handleFileInput}
                  />
                </div>
              ) : (
                <div className='bg-gray-50 rounded-lg border p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <RiFileTextLine className='h-8 w-8 text-blue-500' />
                      <div>
                        <p className='text-sm text-gray-900 font-medium'>
                          {selectedFile.file.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button.Root
                      type='button'
                      variant='neutral'
                      mode='stroke'
                      size='small'
                      onClick={removeFile}
                    >
                      <RiDeleteBinLine className='h-4 w-4' />
                    </Button.Root>
                  </div>
                  {selectedFile.preview && (
                    <div className='mt-3'>
                      <img
                        src={selectedFile.preview}
                        alt='Preview'
                        className='max-h-32 rounded border'
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label.Root
                htmlFor='responseNotes'
                className='mb-2 block font-medium'
              >
                Customer Notes (Optional)
              </Label.Root>
              <TextArea.Root
                id='responseNotes'
                placeholder='Enter any additional notes about the acceptance'
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                rows={3}
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
              disabled={
                isSubmitting ||
                !approvalType.trim() ||
                !purchaseOrderNumber.trim() ||
                !purchaseOrderDate.trim()
              }
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
