'use client';

import { RiBarChart2Line } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import SplitText from '@/components/split-text';
import { SummaryCountCards } from '@/components/summary-count-cards';

export default function PageHome() {
  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBarChart2Line className='size-6 text-text-sub-600' />
          </div>
        }
        title='Document Overview'
        description='Welcome back 👋🏻'
      />
      <div className='flex h-screen flex-col items-center'>
        <div className='flex w-full justify-end gap-4 px-16'>
          <ActionButton
            size='small'
            label='New Quotation'
            href='/quotations/new'
          />
          <ActionButton size='small' label='New Invoice' href='/invoices/new' />
          <ActionButton
            size='small'
            label='New Delivery'
            href='/delivery-notes/new'
          />
          <ActionButton size='small' label='New Import' href='/imports/new' />
        </div>

        {/* Summary Count Cards */}
        <div className='mt-8 w-full max-w-6xl'>
          <SummaryCountCards />
        </div>

        <SplitText
          text='Hello, Welcome to MySTI!'
          className='mt-16 text-center text-title-h2 font-semibold'
          delay={75}
          duration={1}
          ease='bounce.out'
          splitType='chars'
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin='-100px'
          textAlign='center'
        />
      </div>
    </>
  );
}
