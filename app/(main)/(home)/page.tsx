'use client';

import { RiBarChart2Line } from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { ActionButton } from '@/components/action-button';
import { DebugUserRole } from '@/components/debug-user-role';
import Header from '@/components/header';
import { PendingQuotationApproval } from '@/components/pending-quotation-approval';

export default function PageHome() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'guest';
  const canViewPendingApprovals = ['manager', 'director'].includes(userRole);

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBarChart2Line className='size-6 text-text-sub-600' />
          </div>
        }
        title='Documents Overview'
        description='Welcome back 👋🏻'
      >
        <ActionButton
          className='hidden lg:flex'
          label='New Quotation'
          href='/quotations'
        />
        <ActionButton
          className='hidden lg:flex'
          label='New Invoice'
          href='/invoices'
        />
        <ActionButton
          className='hidden lg:flex'
          label='New Delivery Note'
          href='/delivery-notes'
        />
        {/* <MoveMoneyButton className='hidden lg:flex' /> */}
      </Header>

      <div className='flex flex-col gap-6 overflow-hidden px-4 pb-6 lg:px-8 lg:pt-1'>
        {/* Pending Approvals Section - Only for Manager and Director */}
        {canViewPendingApprovals && (
          <div className='mx-auto w-full max-w-4xl'>
            <PendingQuotationApproval />
          </div>
        )}
      </div>

      {/* Debug component - remove after testing */}
      <DebugUserRole />
    </>
  );
}
