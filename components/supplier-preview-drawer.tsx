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
  RiMoneyDollarCircleLine,
  RiPhoneLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useSupplierDetail } from '@/hooks/use-suppliers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Drawer from '@/components/ui/drawer';

interface SupplierPreviewDrawerProps {
  supplierId: string | null;
  open: boolean;
  onClose: () => void;
}

function SupplierPreviewContent({ supplier }: { supplier: any }) {
  const handleEdit = () => {
    window.location.href = `/suppliers/${supplier.id}/edit`;
  };

  const handleViewFull = () => {
    window.location.href = `/suppliers/${supplier.id}`;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b pb-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <RiBuildingLine className='size-5 text-text-sub-600' />
              <div>
                <h2 className='text-xl text-gray-900 font-semibold'>
                  {supplier.name}
                </h2>
                <p className='text-sm text-gray-600'>{supplier.code}</p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge.Root
              variant='light'
              color={supplier.isActive ? 'green' : 'gray'}
            >
              {supplier.isActive ? 'Active' : 'Inactive'}
            </Badge.Root>
            {supplier.transactionCurrency && (
              <Badge.Root variant='light' color='blue'>
                {supplier.transactionCurrency}
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
            Status
          </label>
          <p className='text-sm text-gray-900 mt-1 font-medium'>
            {supplier.isActive ? 'Active Supplier' : 'Inactive Supplier'}
          </p>
        </div>
        <div>
          <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
            Currency
          </label>
          <p className='text-sm text-gray-900 mt-1 font-medium'>
            {supplier.transactionCurrency || 'Not specified'}
          </p>
        </div>
      </div>

      {/* Primary Contact */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>
          Primary Contact
        </h3>
        {supplier.contactPersons?.length > 0 ? (
          <div className='rounded-lg border p-3'>
            <div className='mb-2 flex items-center justify-between'>
              <h4 className='text-sm text-gray-900 font-medium'>
                {supplier.contactPersons[0].name}
              </h4>
              <Badge.Root variant='light' color='blue' size='small'>
                Primary
              </Badge.Root>
            </div>
            <div className='space-y-1'>
              {supplier.contactPersons[0].email && (
                <div className='flex items-center gap-2'>
                  <RiMailLine className='text-gray-400 size-4' />
                  <span className='text-sm text-gray-600'>
                    {supplier.contactPersons[0].email}
                  </span>
                </div>
              )}
              {supplier.contactPersons[0].phone && (
                <div className='flex items-center gap-2'>
                  <RiPhoneLine className='text-gray-400 size-4' />
                  <span className='text-sm text-gray-600'>
                    {supplier.contactPersons[0].phone}
                  </span>
                </div>
              )}
            </div>
            {supplier.contactPersons.length > 1 && (
              <div className='mt-2 text-center'>
                <p className='text-sm text-gray-500'>
                  +{supplier.contactPersons.length - 1} more contacts
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
        {supplier.address ? (
          <div className='rounded-lg border p-3'>
            <div className='flex items-start gap-2'>
              <RiMapPinLine className='text-gray-400 mt-0.5 size-4' />
              <div>
                <p className='text-sm text-gray-900 font-medium'>
                  Business Address
                </p>
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {supplier.address}
                </p>
                {(supplier.city || supplier.country) && (
                  <p className='text-sm text-gray-600'>
                    {[supplier.city, supplier.country]
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

      {/* Footer Info */}
      <div className='text-xs text-gray-500 border-t pt-4'>
        Created on {formatDate(supplier.createdAt)}
        {supplier.updatedAt && supplier.updatedAt !== supplier.createdAt && (
          <span> • Updated on {formatDate(supplier.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}

export function SupplierPreviewDrawer({
  supplierId,
  open,
  onClose,
}: SupplierPreviewDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, error } = useSupplierDetail(supplierId || '');

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

  if (!open || !supplierId) return null;

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
            <SupplierPreviewContent supplier={data} />
          )}
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
