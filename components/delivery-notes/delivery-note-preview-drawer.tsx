'use client';

import React from 'react';
import {
  RiCalendarLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
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
import { DeliveryNoteStatusBadge } from '@/components/delivery-notes/delivery-note-status-badge';

interface DeliveryNotePreviewDrawerProps {
  deliveryNoteId: string | null;
  open: boolean;
  onClose: () => void;
}

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
            <div className='text-title-h4 text-text-strong-950'>
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
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Delivery Date
          </div>
          <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
            <RiCalendarLine className='size-4 text-text-sub-600' />
            {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
          </div>
        </div>

        {deliveryNote.deliveryMethod && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Delivery Method
              </div>
              <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
                <RiTruckLine className='size-4 text-text-sub-600' />
                {deliveryNote.deliveryMethod}
              </div>
            </div>
          </>
        )}

        {deliveryNote.driverName && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Driver
              </div>
              <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
                <RiUserLine className='size-4 text-text-sub-600' />
                {deliveryNote.driverName}
              </div>
            </div>
          </>
        )}

        {deliveryNote.vehicleNumber && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Vehicle Number
              </div>
              <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
                <RiTruckLine className='size-4 text-text-sub-600' />
                {deliveryNote.vehicleNumber}
              </div>
            </div>
          </>
        )}

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Items
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {deliveryNote.items.length} items
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Branch
          </div>
          <div className='mt-1 flex items-center gap-2 text-label-sm text-text-strong-950'>
            <RiMapPinLine className='size-4 text-text-sub-600' />
            {deliveryNote.branchName || '—'}
          </div>
        </div>

        {deliveryNote.invoice && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Related Invoice
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {deliveryNote.invoice.invoiceNumber}
              </div>
            </div>
          </>
        )}

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created By
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {deliveryNote.createdByUser
              ? `${deliveryNote.createdByUser.firstName} ${deliveryNote.createdByUser.lastName}`
              : '—'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {deliveryNote.createdAt
              ? new Date(deliveryNote.createdAt).toLocaleDateString()
              : '—'}
          </div>
        </div>

        {deliveryNote.deliveredByUser && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Delivered By
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {`${deliveryNote.deliveredByUser.firstName} ${deliveryNote.deliveredByUser.lastName}`}
              </div>
            </div>
          </>
        )}

        {deliveryNote.receivedByUser && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Received By
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {`${deliveryNote.receivedByUser.firstName} ${deliveryNote.receivedByUser.lastName}`}
              </div>
            </div>
          </>
        )}

        {deliveryNote.notes && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Notes
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {deliveryNote.notes}
              </div>
            </div>
          </>
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
      <Drawer.Content>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <RiLoader4Line className='text-gray-400 size-6 animate-spin' />
              <span className='text-sm text-gray-500 ml-2'>Loading...</span>
            </div>
          )}

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
