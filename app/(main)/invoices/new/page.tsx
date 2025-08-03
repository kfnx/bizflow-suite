'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiFileAddLine } from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { hasPermission } from '@/lib/permissions';
import { InvoiceFormData } from '@/lib/validations/invoice';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { InvoiceForm } from '@/components/invoices/invoice-form';

const initialFormData: InvoiceFormData = {
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // 30 days from now
  customerId: '',
  currency: 'IDR',
  status: 'draft',
  paymentTerms: '',
  isIncludePPN: false,
  notes: '',
  items: [],
};

export default function NewInvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Check permission
    const userHasPermission = hasPermission(session.user, 'invoices:create');
    if (!userHasPermission) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  return (
    <PermissionGate permission='invoices:create'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiFileAddLine className='size-6' />
          </div>
        }
        title='New Invoice'
        description='Create a new invoice for your customer.'
      >
        <BackButton href='/invoices' label='Back to Invoices' />
      </Header>
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <InvoiceForm mode='create' initialFormData={initialFormData} />
      </div>
    </PermissionGate>
  );
}
