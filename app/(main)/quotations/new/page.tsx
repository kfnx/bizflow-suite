import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
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

async function getQuotationNumber(): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/quotations/preview-number`, {
      cache: 'no-store', // Disable caching to get fresh number
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data.quotationNumber;
  } catch (error) {
    console.error('Error fetching quotation number:', error);
    return null;
  }
}

export default async function NewQuotationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Check permission
  const userHasPermission = hasPermission(
    session.user.role,
    'quotations:create',
  );
  if (!userHasPermission) {
    redirect('/unauthorized');
  }

  // Fetch quotation number server-side
  const quotationNumber = await getQuotationNumber();

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
        <Suspense fallback={<div>Loading...</div>}>
          <QuotationForm
            initialFormData={initialFormData}
            quotationNumber={quotationNumber || ''}
          />
        </Suspense>
      </div>
    </PermissionGate>
  );
}
