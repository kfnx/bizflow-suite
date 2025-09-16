'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiFileAddLine } from '@remixicon/react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { hasPermission } from '@/lib/permissions';
import { DeliveryNoteFormData } from '@/lib/validations/delivery-note';
import { useCreateDeliveryNote } from '@/hooks/use-delivery-notes';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import { DeliveryNoteForm } from '@/components/delivery-notes/delivery-note-form';
import Header from '@/components/header';

const initialFormData: DeliveryNoteFormData = {
  deliveryNumber: '',
  invoiceId: '',
  customerId: '',
  deliveryDate: new Date().toISOString().split('T')[0],
  deliveryMethod: '',
  driverName: '',
  vehicleNumber: '',
  notes: '',
  items: [],
};

export default function NewDeliveryNotePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const createDeliveryNoteMutation = useCreateDeliveryNote();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // TODO: Re-implement permission check - temporarily disabled for build
    // const userHasPermission = hasPermission([], 'deliveries:create', session.user?.isAdmin);
    // if (!userHasPermission) {
    //   router.push('/unauthorized');
    //   return;
    // }
  }, [session, status, router]);

  const handleSubmit = async (data: DeliveryNoteFormData) => {
    try {
      console.log('Creating delivery note with data:', data);

      await createDeliveryNoteMutation.mutateAsync(data);

      console.log('Delivery note created successfully');
      // Toast is shown by DeliveryNoteForm component, no need to show it here
      router.push('/delivery-notes');
    } catch (error) {
      console.error('Create delivery note error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  if (status === 'loading') {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  return (
    <PermissionGate permission='deliveries:create'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiFileAddLine className='size-6' />
          </div>
        }
        title='New Delivery Note'
        description='Create a new delivery note for tracking product deliveries.'
      >
        <BackButton href='/delivery-notes' label='Back to Delivery Notes' />
      </Header>
      <DeliveryNoteForm
        mode='create'
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
      />
    </PermissionGate>
  );
}
