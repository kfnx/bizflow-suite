'use client';

import {
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiTruckLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { DELIVERY_NOTE_STATUS } from '@/lib/db/enum';
import { DeliveryNoteDetail } from '@/hooks/use-delivery-notes';
import * as Button from '@/components/ui/button';
import { DeliveryNoteStatusBadge } from '@/components/delivery-notes/delivery-note-status-badge';

interface DeliveryNoteHeaderProps {
  deliveryNote: DeliveryNoteDetail;
}

export function DeliveryNoteHeader({ deliveryNote }: DeliveryNoteHeaderProps) {
  const handleEdit = () => {
    if (deliveryNote.status === DELIVERY_NOTE_STATUS.DELIVERED) {
      toast.warning('Delivered delivery notes cannot be edited');
      return;
    }
    window.location.href = `/delivery-notes/${deliveryNote.id}/edit`;
  };

  const handleMarkAsInTransit = async () => {
    if (deliveryNote.status !== DELIVERY_NOTE_STATUS.PENDING) {
      toast.warning('Only pending delivery notes can be marked as in transit');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to mark delivery note ${deliveryNote.deliveryNumber} as in transit?`,
      )
    ) {
      return;
    }

    try {
      // TODO: Implement mark as in transit API call
      toast.success('Delivery note marked as in transit successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to mark delivery note as in transit',
      );
    }
  };

  const handleMarkAsDelivered = async () => {
    if (deliveryNote.status !== DELIVERY_NOTE_STATUS.PENDING) {
      toast.warning('Only pending delivery notes can be marked as delivered');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to mark delivery note ${deliveryNote.deliveryNumber} as delivered?`,
      )
    ) {
      return;
    }

    try {
      // TODO: Implement mark as delivered API call
      toast.success('Delivery note marked as delivered successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to mark delivery note as delivered',
      );
    }
  };

  const handleCancelDelivery = async () => {
    if (deliveryNote.status === DELIVERY_NOTE_STATUS.DELIVERED) {
      toast.warning('Delivered delivery notes cannot be cancelled');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to cancel delivery note ${deliveryNote.deliveryNumber}?`,
      )
    ) {
      return;
    }

    try {
      // TODO: Implement cancel delivery API call
      toast.success('Delivery note cancelled successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to cancel delivery note',
      );
    }
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      {/* Status and Delivery Info */}
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Status:</span>
          <DeliveryNoteStatusBadge status={deliveryNote.status} size='medium' />
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Delivery Date:</span>
          <span className='font-medium'>
            {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
          </span>
        </div>

        {deliveryNote.invoice && (
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>Invoice:</span>
            <span className='font-medium'>
              {deliveryNote.invoice.invoiceNumber}
            </span>
          </div>
        )}

        {deliveryNote.deliveryMethod && (
          <div className='flex items-center gap-2'>
            <span className='text-gray-500'>Method:</span>
            <span className='font-medium capitalize'>
              {deliveryNote.deliveryMethod}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex flex-wrap gap-2 pt-2'>
        {deliveryNote.status === DELIVERY_NOTE_STATUS.PENDING && (
          <>
            <Button.Root
              variant='primary'
              size='small'
              onClick={handleMarkAsInTransit}
            >
              <RiTruckLine className='size-4' />
              Mark In Transit
            </Button.Root>
            <Button.Root variant='neutral' size='small' onClick={handleEdit}>
              <RiEditLine className='size-4' />
              Edit
            </Button.Root>
          </>
        )}

        {deliveryNote.status === DELIVERY_NOTE_STATUS.PENDING && (
          <Button.Root
            variant='primary'
            size='small'
            onClick={handleMarkAsDelivered}
          >
            <RiCheckLine className='size-4' />
            Mark as Delivered
          </Button.Root>
        )}

        {deliveryNote.status !== DELIVERY_NOTE_STATUS.DELIVERED && (
          <Button.Root
            variant='error'
            size='small'
            onClick={handleCancelDelivery}
          >
            <RiCloseLine className='size-4' />
            Cancel
          </Button.Root>
        )}
      </div>
    </div>
  );
}
