'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiBuildingLine,
  RiCloseLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useCustomerDetail } from '@/hooks/use-customers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Drawer from '@/components/ui/drawer';

interface CustomerPreviewDrawerProps {
  customerId: string | null;
  open: boolean;
  onClose: () => void;
}

function CustomerPreviewContent({ customer }: { customer: any }) {
  const handleEdit = () => {
    window.location.href = `/customers/${customer.id}/edit`;
  };

  const handleViewFull = () => {
    window.location.href = `/customers/${customer.id}`;
  };

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
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b pb-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Icon className='size-5 text-text-sub-600' />
              <div>
                <h2 className='text-xl text-gray-900 font-semibold'>
                  {customer.name}
                </h2>
                <p className='text-sm text-gray-600'>{customer.code}</p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge.Root variant='light' color={config?.color}>
              {config?.label || customer.type}
            </Badge.Root>
            {customer.isPPN && (
              <Badge.Root variant='light' color='green'>
                PPN
              </Badge.Root>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button.Root variant='primary' size='small' onClick={handleViewFull}>
            <RiExternalLinkLine className='size-4' />
            View Full Details
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={handleEdit}
          >
            <RiEditLine className='size-4' />
            Edit
          </Button.Root>
        </div>
      </div>

      {/* Quick Info */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            Customer Type
          </label>
          <p className='text-sm text-gray-900 mt-1 font-medium'>
            {config?.label || customer.type}
          </p>
        </div>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            PPN Status
          </label>
          <p className='text-sm text-gray-900 mt-1 font-medium'>
            {customer.isPPN ? 'PPN Customer' : 'Non-PPN Customer'}
          </p>
        </div>
      </div>

      {/* Primary Contact */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>
          Primary Contact
        </h3>
        {customer.contactPersons?.length > 0 ? (
          <div className='rounded-lg border p-3'>
            <div className='mb-2 flex items-center justify-between'>
              <h4 className='text-sm text-gray-900 font-medium'>
                {customer.contactPersons[0].name}
              </h4>
              <Badge.Root variant='light' color='blue' size='small'>
                Primary
              </Badge.Root>
            </div>
            <div className='space-y-1'>
              {customer.contactPersons[0].email && (
                <div className='flex items-center gap-2'>
                  <RiMailLine className='text-gray-400 size-4' />
                  <span className='text-sm text-gray-600'>
                    {customer.contactPersons[0].email}
                  </span>
                </div>
              )}
              {customer.contactPersons[0].phone && (
                <div className='flex items-center gap-2'>
                  <RiPhoneLine className='text-gray-400 size-4' />
                  <span className='text-sm text-gray-600'>
                    {customer.contactPersons[0].phone}
                  </span>
                </div>
              )}
            </div>
            {customer.contactPersons.length > 1 && (
              <div className='mt-2 text-center'>
                <p className='text-sm text-gray-500'>
                  +{customer.contactPersons.length - 1} more contacts
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className='text-sm text-gray-500'>No contact persons available</p>
        )}
      </div>

      {/* Address Preview */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>Address</h3>
        {customer.address ? (
          <div className='rounded-lg border p-3'>
            <div className='flex items-start gap-2'>
              <RiMapPinLine className='text-gray-400 mt-0.5 size-4' />
              <div>
                <p className='text-sm text-gray-900 font-medium'>
                  Primary Address
                </p>
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {customer.address}
                </p>
                {(customer.city || customer.country) && (
                  <p className='text-sm text-gray-600'>
                    {[customer.city, customer.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className='text-sm text-gray-500'>
            No address information available
          </p>
        )}
      </div>

      {/* Business Information */}
      {(customer.npwp || customer.paymentTerms) && (
        <div>
          <h3 className='text-sm text-gray-900 mb-3 font-medium'>
            Business Information
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            {customer.npwp && (
              <div>
                <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
                  NPWP
                </label>
                <p className='text-sm text-gray-900 mt-1 font-medium'>
                  {customer.npwp}
                </p>
              </div>
            )}
            {customer.paymentTerms && (
              <div>
                <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
                  Payment Terms
                </label>
                <p className='text-sm text-gray-900 mt-1 font-medium'>
                  {customer.paymentTerms}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className='text-xs text-gray-500 border-t pt-4'>
        Created on {formatDate(customer.createdAt)}
        {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
          <span> • Updated on {formatDate(customer.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}

export function CustomerPreviewDrawer({
  customerId,
  open,
  onClose,
}: CustomerPreviewDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, error } = useCustomerDetail(customerId || '');

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open || !customerId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className={isMobile ? 'max-w-full' : 'max-w-md'}>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-6 py-6'>
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
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
