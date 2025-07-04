'use client';

import { RiBarChart2Line } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';

export default function PageHome() {
  return (
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
  );
}
