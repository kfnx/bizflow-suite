import { RiFilterLine, RiSearch2Line, RiSortDesc } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';

export function QuotationsTableSkeleton() {
  return (
    <>
      {/* Filters Skeleton */}
      <div className='flex justify-between gap-4'>
        <div className='relative flex-1'>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input
                type='text'
                placeholder='Search quotations by number, customer, or notes...'
                disabled
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Select.Root disabled>
              <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
                <Select.TriggerIcon as={RiFilterLine} />
                <Select.Value placeholder='Status' />
              </Select.Trigger>
            </Select.Root>
          </div>

          <div className='flex items-center gap-2'>
            <Select.Root disabled>
              <Select.Trigger className='h-8 w-auto flex-1 min-[560px]:flex-none'>
                <Select.TriggerIcon as={RiSortDesc} />
                <Select.Value placeholder='Sort by' />
              </Select.Trigger>
            </Select.Root>
          </div>

          <Button.Root mode='ghost' size='xsmall' disabled>
            Clear filters
          </Button.Root>
        </div>
      </div>

      {/* Table Skeleton */}
      <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[960px]'>
        <Table.Header className='whitespace-nowrap'>
          <Table.Row>
            <Table.Head>Quotation</Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Valid Until</Table.Head>
            <Table.Head>Total</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Created By</Table.Head>
            <Table.Head className='w-0 px-5'></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, i) => (
            <Table.Row key={i}>
              <Table.Cell className='h-12'>
                <div className='flex flex-col gap-1'>
                  <div className='bg-gray-200 h-4 w-24 animate-pulse rounded' />
                  <div className='bg-gray-100 h-3 w-32 animate-pulse rounded' />
                </div>
              </Table.Cell>
              <Table.Cell className='h-12'>
                <div className='flex flex-col gap-1'>
                  <div className='bg-gray-200 h-4 w-32 animate-pulse rounded' />
                  <div className='bg-gray-100 h-3 w-20 animate-pulse rounded' />
                </div>
              </Table.Cell>
              <Table.Cell className='h-12'>
                <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
              </Table.Cell>
              <Table.Cell className='h-12'>
                <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
              </Table.Cell>
              <Table.Cell className='h-12'>
                <div className='flex flex-col gap-1'>
                  <div className='bg-gray-200 h-4 w-24 animate-pulse rounded' />
                  <div className='bg-gray-100 h-3 w-20 animate-pulse rounded' />
                </div>
              </Table.Cell>
              <Table.Cell className='h-12'>
                <div className='bg-gray-200 h-6 w-16 animate-pulse rounded' />
              </Table.Cell>
              <Table.Cell className='h-12'>
                <div className='flex flex-col gap-1'>
                  <div className='bg-gray-200 h-4 w-24 animate-pulse rounded' />
                  <div className='bg-gray-100 h-3 w-20 animate-pulse rounded' />
                </div>
              </Table.Cell>
              <Table.Cell className='h-12 w-0 px-5'>
                <div className='bg-gray-200 h-8 w-8 animate-pulse rounded' />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination Skeleton */}
      <div className='mt-auto'>
        <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
          <div className='bg-gray-200 h-8 w-28 animate-pulse rounded' />
          <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
          <div className='bg-gray-200 h-8 w-28 animate-pulse rounded' />
        </div>
        <div className='mt-10 hidden items-center gap-3 lg:flex'>
          <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
          <div className='flex gap-2'>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className='bg-gray-200 h-8 w-8 animate-pulse rounded'
              />
            ))}
          </div>
          <div className='bg-gray-200 h-8 w-20 animate-pulse rounded' />
        </div>
      </div>
    </>
  );
}
