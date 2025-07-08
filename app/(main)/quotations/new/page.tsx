'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { hasPermission } from '@/lib/permissions';
import { QuotationFormData } from '@/lib/validations/quotation';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

import QuotationForm from './quotation-form';

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
    return <div>Loading...</div>;
  }

  const HeaderComponent = () => (
    <Header
      icon={
        <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <svg
            className='size-6 text-text-sub-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
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
        <QuotationForm initialFormData={initialFormData} />
      </div>
    </PermissionGate>
  );
}
