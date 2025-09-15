'use client';

import React from 'react';
import {
  RiCalendarLine,
  RiEditLine,
  RiExternalLinkLine,
  RiMapPinLine,
  RiTruckLine,
  RiUserLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import {
  DeliveryNote,
  DeliveryNoteDetail,
  useDeliveryNoteDetail,
} from '@/hooks/use-delivery-notes';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { Loading } from '@/components/ui/loading';
import { DeliveryNoteStatusBadge } from '@/components/delivery-notes/delivery-note-status-badge';

interface DeliveryNotePreviewDrawerProps {
  deliveryNoteId: string | null;
  open: boolean;
  onClose: () => void;
}

const renderDetailField = (label: string, value: string | number) => (
  <div>
    <div className='text-subheading-xs uppercase text-text-soft-400'>
      {label}
    </div>
    <div className='mt-1 text-label-sm text-text-strong-950'>{value}</div>
  </div>
);

function DeliveryNotePreviewContent({
  deliveryNote,
}: {
  deliveryNote: DeliveryNoteDetail;
}) {
  return (
    <>
      <Divider.Root variant='solid-text'>Delivery Note Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <div className='text-title-h5 text-text-strong-950'>
              {deliveryNote.deliveryNumber}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {deliveryNote.customer?.name} •{' '}
              {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
            </div>
          </div>
          <DeliveryNoteStatusBadge status={deliveryNote.status} size='medium' />
        </div>
      </div>

      <Divider.Root variant='solid-text'>Delivery Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
          {/* Left Column */}
          <div className='space-y-4'>
            {deliveryNote.deliveryMethod && (
              <div>
                <div className='text-subheading-xs uppercase text-text-soft-400'>
                  Delivery Method
                </div>
                <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
                  <RiTruckLine className='size-4 text-text-sub-600' />
                  {deliveryNote.deliveryMethod}
                </div>
              </div>
            )}
            {deliveryNote.driverName &&
              renderDetailField('Driver', deliveryNote.driverName)}
            {deliveryNote.branchName &&
              renderDetailField('Branch', deliveryNote.branchName)}
            {deliveryNote.createdByUser &&
              renderDetailField(
                'Created By',
                `${deliveryNote.createdByUser.firstName} ${deliveryNote.createdByUser.lastName}`,
              )}
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            {renderDetailField('Items', `${deliveryNote.items.length} items`)}
            {deliveryNote.vehicleNumber &&
              renderDetailField('Vehicle Number', deliveryNote.vehicleNumber)}
            {deliveryNote.invoice &&
              renderDetailField(
                'Related Invoice',
                deliveryNote.invoice.invoiceNumber,
              )}
            {deliveryNote.createdAt &&
              renderDetailField(
                'Created Date',
                new Date(deliveryNote.createdAt).toLocaleDateString(),
              )}
            {deliveryNote.receivedByUser &&
              renderDetailField(
                'Received By',
                `${deliveryNote.receivedByUser.firstName} ${deliveryNote.receivedByUser.lastName}`,
              )}
          </div>
        </div>

        {deliveryNote.notes && (
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Notes
            </div>
            <div className='mt-1 text-label-sm text-text-strong-950'>
              {deliveryNote.notes}
            </div>
          </div>
        )}
      </div>

      {deliveryNote.items.length > 0 && (
        <>
          <Divider.Root variant='solid-text'>Items Preview</Divider.Root>
          <div className='p-5'>
            <div className='space-y-3'>
              {deliveryNote.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-label-sm text-text-strong-950'>
                      {item.product?.name || 'Unknown Product'}
                    </div>
                    <div className='text-paragraph-sm text-text-sub-600'>
                      {item.product?.code || 'N/A'}
                    </div>
                  </div>
                  <div className='ml-4 text-right'>
                    <div className='text-label-sm text-text-strong-950'>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}

              {deliveryNote.items.length > 3 && (
                <div className='text-center text-paragraph-sm text-text-sub-600'>
                  +{deliveryNote.items.length - 3} more items
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function DeliveryNotePreviewFooter({
  deliveryNote,
  onClose,
}: {
  deliveryNote: DeliveryNoteDetail;
  onClose: () => void;
}) {
  const handleViewFull = () => {
    window.location.href = `/delivery-notes/${deliveryNote.id}`;
  };

  const handleEdit = () => {
    if (deliveryNote.status === 'delivered') {
      toast.warning('Delivered delivery notes cannot be edited');
      return;
    }
    window.location.href = `/delivery-notes/${deliveryNote.id}/edit`;
  };

  return (
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='neutral'
        mode='stroke'
        size='medium'
        className='w-full'
        onClick={handleViewFull}
      >
        <Button.Icon as={RiExternalLinkLine} />
        View Full
      </Button.Root>

      {deliveryNote.status !== 'delivered' && (
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='medium'
          className='w-full'
          onClick={handleEdit}
        >
          <Button.Icon as={RiEditLine} />
          Edit
        </Button.Root>
      )}
    </Drawer.Footer>
  );
}

export function DeliveryNotePreviewDrawer({
  deliveryNoteId,
  open,
  onClose,
}: DeliveryNotePreviewDrawerProps) {
  const { data, isLoading, error } = useDeliveryNoteDetail(
    deliveryNoteId || '',
  );

  // Debug logging for development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && deliveryNoteId) {
      console.log('DeliveryNotePreviewDrawer - Data updated:', data);
      console.log('DeliveryNotePreviewDrawer - Loading:', isLoading);
      console.log('DeliveryNotePreviewDrawer - Error:', error);
      console.log(
        'DeliveryNotePreviewDrawer - DeliveryNoteId:',
        deliveryNoteId,
      );
    }
  }, [data, isLoading, error, deliveryNoteId]);

  if (!open || !deliveryNoteId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className='flex h-full flex-col'>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className='flex-1 overflow-y-auto'>
          {isLoading && <Loading className='py-8' />}

          {error && (
            <div className='py-8 text-center'>
              <p className='text-sm text-red-600'>Error: {error.message}</p>
            </div>
          )}

          {data && !isLoading && !error && (
            <DeliveryNotePreviewContent deliveryNote={data} />
          )}
        </Drawer.Body>

        {data && !isLoading && !error && (
          <DeliveryNotePreviewFooter deliveryNote={data} onClose={onClose} />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
