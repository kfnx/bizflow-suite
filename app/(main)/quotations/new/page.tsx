'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiFileAddLine } from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { hasPermission } from '@/lib/permissions';
import { QuotationFormData } from '@/lib/validations/quotation';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { NewQuotationForm } from '@/components/quotations/new-quotation-form';

const initialFormData: QuotationFormData = {
  quotationNumber: '', // Will be populated by the form component
  quotationDate: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // 30 days from now
  customerId: '',
  isIncludePPN: false,
  currency: 'IDR',
  status: QUOTATION_STATUS.DRAFT,
  items: [],
};

export default function NewQuotationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Check permission
    const userHasPermission = hasPermission(
      session.user.role,
      'quotations:create',
    );
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

  const HeaderComponent = () => (
    <Header
      icon={
        <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <RiFileAddLine className='size-6' />
        </div>
      }
      title='New Quotation'
      description='Create a new quotation for your customer.'
    >
      <BackButton href='/quotations' label='Back to Quotations' />
    </Header>
  );

  return (
    <PermissionGate permission='quotations:create'>
      <HeaderComponent />
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <NewQuotationForm initialFormData={initialFormData} />
      </div>
    </PermissionGate>
  );
}
