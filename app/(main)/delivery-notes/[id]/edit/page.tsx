'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiEditLine } from '@remixicon/react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { hasPermission } from '@/lib/permissions';
import { DeliveryNoteFormData } from '@/lib/validations/delivery-note';
import {
  useDeliveryNoteDetail,
  useUpdateDeliveryNote,
} from '@/hooks/use-delivery-notes';
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

    // Check permission
    const userHasPermission = hasPermission(session.user, 'deliveries:update');
    if (!userHasPermission) {
      router.push('/unauthorized');
      return;
    }
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
        <BackButton href='/delivery-notes' label='Back to Delivery Notes' />
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
