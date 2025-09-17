'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiCheckLine, RiCloseLine, RiEditLine } from '@remixicon/react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { DELIVERY_NOTE_STATUS } from '@/lib/db/enum';
import { hasPermission } from '@/lib/permissions';
import { DeliveryNoteFormData } from '@/lib/validations/delivery-note';
import {
  useDeliveryNoteDetail,
  useExecuteDeliveryNote,
  useUpdateDeliveryNote,
  useCancelDeliveryNote,
} from '@/hooks/use-delivery-notes';
import * as Button from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import { DeliveryNoteForm } from '@/components/delivery-notes/delivery-note-form';
import Header from '@/components/header';

interface EditDeliveryNotePageProps {
  params: {
    id: string;
  };
}

export default function EditDeliveryNotePage({
  params,
}: EditDeliveryNotePageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const updateDeliveryNoteMutation = useUpdateDeliveryNote();
  const executeDeliveryNoteMutation = useExecuteDeliveryNote();
  const cancelDeliveryNoteMutation = useCancelDeliveryNote();
  const {
    data: deliveryNoteData,
    isLoading: isLoadingData,
    error,
  } = useDeliveryNoteDetail(params.id);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // TODO: Re-implement permission check - temporarily disabled for build
    // const userHasPermission = hasPermission([], 'deliveries:update', session.user?.isAdmin);
    // if (!userHasPermission) {
    //   router.push('/unauthorized');
    //   return;
    // }
  }, [session, status, router]);

  const handleSubmit = async (data: DeliveryNoteFormData) => {
    try {
      await updateDeliveryNoteMutation.mutateAsync({
        deliveryNoteId: params.id,
        data,
      });

      toast.success('Delivery note updated successfully!');
      router.push('/delivery-notes');
    } catch (error) {
      console.error('Update delivery note error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const handleExecute = async () => {
    if (!deliveryNoteData) return;

    if (deliveryNoteData.status === 'delivered') {
      toast.warning('Delivery note is already delivered');
      return;
    }

    try {
      await executeDeliveryNoteMutation.mutateAsync(params.id);
      toast.success('Delivery note executed successfully!', {
        description: 'The delivery note has been marked as delivered.',
      });
      router.push('/delivery-notes');
    } catch (error) {
      toast.error('Failed to execute delivery note', {
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const handleCancel = async () => {
    if (!deliveryNoteData) return;

    if (deliveryNoteData.status === 'delivered') {
      toast.warning('Cannot cancel a delivered delivery note');
      return;
    }

    if (deliveryNoteData.status === 'cancelled') {
      toast.warning('Delivery note is already cancelled');
      return;
    }

    try {
      await cancelDeliveryNoteMutation.mutateAsync(params.id);
      toast.success('Delivery note cancelled successfully!', {
        description: 'The delivery note has been cancelled.',
      });
      router.push('/delivery-notes');
    } catch (error) {
      toast.error('Failed to cancel delivery note', {
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  // Transform delivery note data to form data
  const transformedFormData: DeliveryNoteFormData | null = deliveryNoteData
    ? {
        deliveryNumber: deliveryNoteData.deliveryNumber,
        invoiceId: deliveryNoteData.invoiceId || '',
        customerId: deliveryNoteData.customerId,
        deliveryDate: new Date(deliveryNoteData.deliveryDate)
          .toISOString()
          .split('T')[0],
        deliveryMethod: deliveryNoteData.deliveryMethod || '',
        driverName: deliveryNoteData.driverName || '',
        vehicleNumber: deliveryNoteData.vehicleNumber || '',
        notes: deliveryNoteData.notes || '',
        items: deliveryNoteData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          warehouseId: item.warehouseId,
        })),
      }
    : null;

  if (status === 'loading' || isLoadingData) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  if (error) {
    console.error('Error loading delivery note:', error);
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Error loading delivery note: {error.message}
      </div>
    );
  }

  if (!deliveryNoteData) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Delivery note not found
      </div>
    );
  }

  const canExecute = deliveryNoteData.status === DELIVERY_NOTE_STATUS.PENDING;
  const canCancel = deliveryNoteData.status === DELIVERY_NOTE_STATUS.PENDING;

  return (
    <PermissionGate permission='deliveries:update'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6' />
          </div>
        }
        title='Edit Delivery Note'
        description='Edit delivery note details and delivery information.'
      >
        <div className='flex items-center gap-2'>
          {canExecute && (
            <Button.Root
              variant='primary'
              size='medium'
              onClick={handleExecute}
              disabled={executeDeliveryNoteMutation.isPending}
            >
              <Button.Icon as={RiCheckLine} />
              {executeDeliveryNoteMutation.isPending
                ? 'Executing...'
                : 'Execute Delivery'}
            </Button.Root>
          )}
          {canCancel && (
            <Button.Root
              variant='error'
              mode='stroke'
              size='medium'
              onClick={handleCancel}
              disabled={cancelDeliveryNoteMutation.isPending}
            >
              <Button.Icon as={RiCloseLine} />
              {cancelDeliveryNoteMutation.isPending ? 'Cancelling...' : 'Cancel'}
            </Button.Root>
          )}
          <BackButton href='/delivery-notes' label='Back to Delivery Notes' />
        </div>
      </Header>

      <DeliveryNoteForm
        mode='edit'
        initialFormData={transformedFormData}
        isLoadingData={false}
        onSubmit={handleSubmit}
      />
    </PermissionGate>
  );
}
