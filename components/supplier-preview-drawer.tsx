'use client';

import React from 'react';
import {
  RiBuildingLine,
  RiEditLine,
  RiExternalLinkLine,
  RiLoader4Line,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useSupplierDetail } from '@/hooks/use-suppliers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';

interface SupplierPreviewDrawerProps {
  supplierId: string | null;
  open: boolean;
  onClose: () => void;
}

function SupplierPreviewContent({ supplier }: { supplier: any }) {
  return (
    <>
      <Divider.Root variant='solid-text'>Supplier Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center gap-2'>
          <RiBuildingLine className='size-5 min-w-5 text-text-sub-600' />
          <div>
            <div className='text-title-h4 text-text-strong-950'>
              {supplier.name}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {supplier.code}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge.Root
            variant='lighter'
            color={supplier.isActive ? 'green' : 'gray'}
          >
            {supplier.isActive ? 'Active' : 'Inactive'}
          </Badge.Root>
          {supplier.transactionCurrency && (
            <Badge.Root variant='lighter' color='blue'>
              {supplier.transactionCurrency}
            </Badge.Root>
          )}
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Status
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {supplier.isActive ? 'Active Supplier' : 'Inactive Supplier'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Country
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {supplier.country || 'Not specified'}
          </div>
        </div>

        {supplier.contactPersons?.length > 0 && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Primary Contact
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {supplier.contactPersons[0].prefix}{' '}
                {supplier.contactPersons[0].name}
              </div>
              {supplier.contactPersons[0].email && (
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  {supplier.contactPersons[0].email}
                </div>
              )}
              {supplier.contactPersons[0].phone && (
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  {supplier.contactPersons[0].phone}
                </div>
              )}
              {supplier.contactPersons.length > 1 && (
                <div className='mt-1 text-paragraph-sm italic text-text-soft-400'>
                  +{supplier.contactPersons.length - 1} more contacts
                </div>
              )}
            </div>
          </>
        )}

        {supplier.address && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Address
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {supplier.address}
              </div>
              {(supplier.city || supplier.country) && (
                <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                  {[supplier.city, supplier.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </>
        )}

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(supplier.createdAt)}
          </div>
        </div>

        {supplier.updatedAt && supplier.updatedAt !== supplier.createdAt && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Last Updated
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {formatDate(supplier.updatedAt)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function SupplierPreviewFooter({ supplier }: { supplier: any }) {
  const handleEdit = () => {
    window.location.href = `/suppliers/${supplier.id}/edit`;
  };

  const handleViewFull = () => {
    window.location.href = `/suppliers/${supplier.id}`;
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

export function SupplierPreviewDrawer({
  supplierId,
  open,
  onClose,
}: SupplierPreviewDrawerProps) {
  const { data, isLoading, error } = useSupplierDetail(supplierId || '');

  if (!open || !supplierId) return null;

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
            <SupplierPreviewContent supplier={data} />
          )}
        </Drawer.Body>

        {data && !isLoading && !error && (
          <SupplierPreviewFooter supplier={data} />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
