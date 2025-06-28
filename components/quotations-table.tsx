'use client';

import { useState } from 'react';
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiFileTextLine,
  RiMoreLine,
  RiUserLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Table from '@/components/ui/table';
import * as Badge from '@/components/ui/badge';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import { formatDate } from '@/utils/date-formatter';

export interface QuotationTableData {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerName: string;
  customerCode: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
  createdByUser: string;
  createdAt: string;
}

interface QuotationsTableProps {
  data: QuotationTableData[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    variant: 'light' as const,
    color: 'gray' as const,
  },
  sent: {
    label: 'Sent',
    variant: 'light' as const,
    color: 'blue' as const,
  },
  accepted: {
    label: 'Accepted',
    variant: 'light' as const,
    color: 'green' as const,
  },
  rejected: {
    label: 'Rejected',
    variant: 'light' as const,
    color: 'red' as const,
  },
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
};

export function QuotationsTable({
  data,
  onView,
  onEdit,
  onDelete,
}: QuotationsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAction = (action: 'view' | 'edit' | 'delete', id: string) => {
    setSelectedId(null);
    switch (action) {
      case 'view':
        onView?.(id);
        break;
      case 'edit':
        onEdit?.(id);
        break;
      case 'delete':
        onDelete?.(id);
        break;
    }
  };

  return (<Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head className='w-[200px]'>Quotation</Table.Head>
        <Table.Head className='w-[200px]'>Customer</Table.Head>
        <Table.Head className='w-[120px]'>Date</Table.Head>
        <Table.Head className='w-[120px]'>Valid Until</Table.Head>
        <Table.Head className='w-[120px] text-right'>Total</Table.Head>
        <Table.Head className='w-[100px]'>Status</Table.Head>
        <Table.Head className='w-[100px]'>Created By</Table.Head>
        <Table.Head className='w-[50px]'></Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {data.map((quotation) => {
        const status = statusConfig[quotation.status];
        return (
          <Table.Row key={quotation.id} className='group'>
            <Table.Cell>
              <div className='flex items-center gap-3'>
                <div className='bg-bg-subtle-50 flex size-10 shrink-0 items-center justify-center rounded-lg'>
                  <RiFileTextLine className='size-5 text-text-sub-600' />
                </div>
                <div className='flex flex-col'>
                  <div className='font-medium text-text-strong-950'>
                    {quotation.quotationNumber}
                  </div>
                  {quotation.notes && (
                    <div className='text-sm line-clamp-1 text-text-sub-600'>
                      {quotation.notes}
                    </div>
                  )}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className='flex items-center gap-2'>
                <div className='bg-bg-subtle-50 flex size-8 shrink-0 items-center justify-center rounded-full'>
                  <RiUserLine className='size-4 text-text-sub-600' />
                </div>
                <div className='flex flex-col'>
                  <div className='font-medium text-text-strong-950'>
                    {quotation.customerName}
                  </div>
                  <div className='text-sm text-text-sub-600'>
                    {quotation.customerCode}
                  </div>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className='flex items-center gap-1.5'>
                <RiCalendarLine className='size-4 text-text-sub-600' />
                <span className='text-sm text-text-strong-950'>
                  {formatDate(quotation.quotationDate)}
                </span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className='flex items-center gap-1.5'>
                <RiCalendarLine className='size-4 text-text-sub-600' />
                <span className='text-sm text-text-strong-950'>
                  {formatDate(quotation.validUntil)}
                </span>
              </div>
            </Table.Cell>
            <Table.Cell className='text-right'>
              <div className='flex flex-col'>
                <div className='font-semibold text-text-strong-950'>
                  {formatCurrency(quotation.total, quotation.currency)}
                </div>
                <div className='text-sm text-text-sub-600'>
                  {formatCurrency(quotation.subtotal, quotation.currency)}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <Badge.Root
                variant={status.variant}
                color={status.color}
                size='medium'
              >
                {status.label}
              </Badge.Root>
            </Table.Cell>
            <Table.Cell>
              <div className='text-sm text-text-strong-950'>
                {quotation.createdByUser}
              </div>
              <div className='text-xs text-text-sub-600'>
                {formatDate(quotation.createdAt)}
              </div>
            </Table.Cell>
            <Table.Cell>
              <Dropdown.Root
                open={selectedId === quotation.id}
                onOpenChange={(open) =>
                  setSelectedId(open ? quotation.id : null)
                }
              >
                <Dropdown.Trigger asChild>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='small'
                    className='opacity-0 group-hover:opacity-100'
                  >
                    <Button.Icon as={RiMoreLine} />
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content align='end'>
                  <Dropdown.Item
                    onClick={() => handleAction('view', quotation.id)}
                  >
                    View Details
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleAction('edit', quotation.id)}
                  >
                    Edit Quotation
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item
                    onClick={() => handleAction('delete', quotation.id)}
                    className='text-danger-600'
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table.Root>
  );
}

export function QuotationTablePagination() {
  return (
    <div className='mt-auto'>
      <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
        >
          Previous
        </Button.Root>
        <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
          Page 2 of 16
        </span>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
        >
          Next
        </Button.Root>
      </div>
      <div className='mt-10 hidden items-center gap-3 lg:flex'>
        <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          Page 2 of 16
        </span>

        <Pagination.Root>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Item current>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Item>...</Pagination.Item>
          <Pagination.Item>16</Pagination.Item>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root size='xsmall' defaultValue='7'>
            <Select.Trigger className='w-auto'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={'7'}>7 / page</Select.Item>
              <Select.Item value={'15'}>15 / page</Select.Item>
              <Select.Item value={'50'}>50 / page</Select.Item>
              <Select.Item value={'100'}>100 / page</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
