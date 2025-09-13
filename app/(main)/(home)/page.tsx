'use client';

import { RiBarChart2Line } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import { KanbanBoard } from '@/components/kanban-board';
import SplitText from '@/components/split-text';

export default function PageHome() {
  return (
    <div className='bg-bg-weak-0 flex min-h-screen flex-col'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBarChart2Line className='size-6 text-text-sub-600' />
          </div>
        }
        title='Document Overview'
        description='Welcome back 👋🏻'
      >
        <div className='flex w-full flex-wrap justify-end gap-2 sm:gap-4'>
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
      </Header>
      <main className='mx-auto flex w-full max-w-full flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-2 flex justify-center'>
          <SplitText
            text='Hello, Welcome to MySTI!'
            className='text-center text-title-h2 font-semibold'
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
        <div>
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
}
