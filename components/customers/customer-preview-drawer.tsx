'use client';

import React from 'react';
import {
  RiBuildingLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiUserLine,
} from '@remixicon/react';

import { useCustomerDetail } from '@/hooks/use-customers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';

interface CustomerPreviewDrawerProps {
  customerId: string | null;
  open: boolean;
  onClose: () => void;
}

function CustomerPreviewContent({ customer }: { customer: any }) {
  const typeConfig = {
    individual: {
      label: 'Individual',
      color: 'blue' as const,
      icon: RiUserLine,
    },
    company: {
      label: 'Company',
      color: 'green' as const,
      icon: RiBuildingLine,
    },
  };

  const config = typeConfig[customer.type as keyof typeof typeConfig];
  const Icon = config?.icon || RiUserLine;

  return (
    <>
      <Divider.Root variant='solid-text'>Customer Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Icon className='size-5 min-w-5 text-text-sub-600' />
            <div>
              <div className='text-title-h4 text-text-strong-950'>
                {customer.name}
              </div>
              <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                {customer.code}
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Badge.Root variant='lighter' color={config?.color}>
            {config?.label || customer.type}
          </Badge.Root>
          <Badge.Root
            variant='lighter'
            color={customer.isActive ? 'green' : 'gray'}
          >
            {customer.isActive ? 'Active' : 'Inactive'}
          </Badge.Root>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Customer Type
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {config?.label || customer.type}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Status
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {customer.isActive ? 'Active Customer' : 'Inactive Customer'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        {customer.contactPersons?.length > 0 && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Primary Contact
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {customer.contactPersons[0].prefix}{' '}
                {customer.contactPersons[0].name}
              </div>
              {customer.contactPersons[0].email && (
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  {customer.contactPersons[0].email}
                </div>
              )}
              {customer.contactPersons[0].phone && (
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  {customer.contactPersons[0].phone}
                </div>
              )}
              {customer.contactPersons.length > 1 && (
                <div className='mt-1 text-paragraph-sm italic text-text-soft-400'>
                  +{customer.contactPersons.length - 1} more contacts
                </div>
              )}
            </div>
          </>
        )}

        {customer.address && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Address
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {customer.address}
              </div>
              {(customer.city || customer.country) && (
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  {[customer.city, customer.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </>
        )}

        {customer.npwp && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                NPWP
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {customer.npwp}
              </div>
            </div>
          </>
        )}

        {customer.paymentTerms && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Payment Terms
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {customer.paymentTerms}
              </div>
            </div>
          </>
        )}

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {new Date(customer.createdAt).toLocaleDateString()}
          </div>
        </div>

        {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Last Updated
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {new Date(customer.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CustomerPreviewFooter({ customer }: { customer: any }) {
  const handleEdit = () => {
    window.location.href = `/customers/${customer.id}/edit`;
  };

  const handleViewFull = () => {
    window.location.href = `/customers/${customer.id}`;
  };

  return (
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='neutral'
        mode='stroke'
        size='medium'
        className='w-full'
        onClick={handleViewFull}
      >
        <Button.Icon as={RiExternalLinkLine} />
        View Full
      </Button.Root>
      <Button.Root
        variant='primary'
        size='medium'
        className='w-full'
        onClick={handleEdit}
      >
        <Button.Icon as={RiEditLine} />
        Edit
      </Button.Root>
    </Drawer.Footer>
  );
}

export function CustomerPreviewDrawer({
  customerId,
  open,
  onClose,
}: CustomerPreviewDrawerProps) {
  const { data, isLoading, error } = useCustomerDetail(customerId || '');

  if (!open || !customerId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <RiLoader4Line className='text-gray-400 size-6 animate-spin' />
              <span className='text-sm text-gray-500 ml-2'>Loading...</span>
            </div>
          )}

          {error && (
            <div className='py-8 text-center'>
              <p className='text-sm text-red-600'>Error: {error.message}</p>
            </div>
          )}

          {data && !isLoading && !error && (
            <CustomerPreviewContent customer={data} />
          )}
        </Drawer.Body>

        {data && !isLoading && !error && (
          <CustomerPreviewFooter customer={data} />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
