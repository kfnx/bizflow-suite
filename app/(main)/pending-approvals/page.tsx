'use client';

import { RiCheckLine } from '@remixicon/react';

import Header from '@/components/header';
import { PendingQuotationApproval } from '@/components/pending-quotation-approval';

export default function PagePendingApprovals() {
  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiCheckLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Pending Approvals'
        description='Review and approve quotations waiting for your decision.'
      />

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <PendingQuotationApproval />
      </div>
    </>
  );
}
