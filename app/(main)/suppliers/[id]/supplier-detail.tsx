'use client';

import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiBuildingLine,
  RiEditLine,
  RiGlobalLine,
  RiMailLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiPhoneLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useSupplierDetail } from '@/hooks/use-suppliers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import Header from '@/components/header';

interface SupplierDetailProps {
  id: string;
}

export function SupplierDetail({ id }: SupplierDetailProps) {
  const router = useRouter();
  const { data: supplier, isLoading, error } = useSupplierDetail(id);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading supplier details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-red-600'>
          Error loading supplier: {error.message}
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Supplier not found
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/suppliers/${supplier.id}/edit`);
  };

  const handleBack = () => {
    router.push('/suppliers');
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBuildingLine className='size-6 text-text-sub-600' />
          </div>
        }
        title={supplier.name}
        description={`Supplier Code: ${supplier.code}`}
      >
        <div className='flex items-center gap-2'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            onClick={handleBack}
            className='hidden lg:flex'
          >
            <Button.Icon as={RiArrowLeftLine} />
            Back to Suppliers
          </Button.Root>
          <Button.Root
            variant='primary'
            size='medium'
            onClick={handleEdit}
            className='hidden lg:flex'
          >
            <Button.Icon as={RiEditLine} />
            Edit Supplier
          </Button.Root>
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {/* Status and Currency Badges */}
        <div className='flex flex-wrap items-center gap-2'>
          <Badge.Root variant='light' color='green'>
            <RiBuildingLine className='size-3' />
            Supplier
          </Badge.Root>
          <Badge.Root
            variant='light'
            color={supplier.isActive ? 'green' : 'gray'}
          >
            {supplier.isActive ? 'Active' : 'Inactive'}
          </Badge.Root>
          {supplier.transactionCurrency && (
            <Badge.Root variant='light' color='blue'>
              <RiMoneyDollarCircleLine className='size-3' />
              {supplier.transactionCurrency}
            </Badge.Root>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Basic Information */}
          <div className='space-y-6'>
            <div>
              <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                Basic Information
              </h3>
              <div className='space-y-4'>
                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Supplier Code
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {supplier.code}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Supplier Name
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {supplier.name}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Status
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {supplier.isActive
                      ? 'Active Supplier'
                      : 'Inactive Supplier'}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Transaction Currency
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {supplier.transactionCurrency || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                Location Information
              </h3>
              <div className='space-y-4'>
                {supplier.address && (
                  <div>
                    <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                      <RiMapPinLine className='mr-1 inline size-3' />
                      Address
                    </div>
                    <div className='text-paragraph-sm text-text-strong-950'>
                      {supplier.address}
                    </div>
                  </div>
                )}

                {supplier.city && (
                  <div>
                    <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                      City
                    </div>
                    <div className='text-paragraph-sm text-text-strong-950'>
                      {supplier.city}
                    </div>
                  </div>
                )}

                {supplier.province && (
                  <div>
                    <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                      Province/State
                    </div>
                    <div className='text-paragraph-sm text-text-strong-950'>
                      {supplier.province}
                    </div>
                  </div>
                )}

                {supplier.country && (
                  <div>
                    <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                      <RiGlobalLine className='mr-1 inline size-3' />
                      Country
                    </div>
                    <div className='text-paragraph-sm text-text-strong-950'>
                      {supplier.country}
                    </div>
                  </div>
                )}

                {supplier.postalCode && (
                  <div>
                    <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                      Postal Code
                    </div>
                    <div className='text-paragraph-sm text-text-strong-950'>
                      {supplier.postalCode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-6'>
            {/* Contact Persons */}
            {supplier.contactPersons && supplier.contactPersons.length > 0 && (
              <div>
                <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                  Contact Persons
                </h3>
                <div className='space-y-4'>
                  {supplier.contactPersons.map((contact, index) => (
                    <div
                      key={contact.id || index}
                      className='bg-gray-50 rounded-lg border p-4'
                    >
                      <div className='mb-2 text-paragraph-sm font-medium text-text-strong-950'>
                        {contact.name}
                        {index === 0 && (
                          <Badge.Root
                            variant='light'
                            color='blue'
                            className='ml-2'
                          >
                            Primary
                          </Badge.Root>
                        )}
                      </div>
                      <div className='space-y-1'>
                        {contact.email && (
                          <div className='flex items-center gap-2 text-paragraph-sm text-text-sub-600'>
                            <RiMailLine className='size-4' />
                            {contact.email}
                          </div>
                        )}
                        {contact.phone && (
                          <div className='flex items-center gap-2 text-paragraph-sm text-text-sub-600'>
                            <RiPhoneLine className='size-4' />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Information */}
            <div>
              <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                Business Information
              </h3>
              <div className='space-y-4'>
                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Supplier Type
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    Business Supplier
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Preferred Currency
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {supplier.transactionCurrency || 'USD (Default)'}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Business Status
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {supplier.isActive
                      ? 'Active Business Relationship'
                      : 'Inactive Business Relationship'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className='mt-8'>
          <Divider.Root variant='solid-text'>System Information</Divider.Root>
          <div className='grid grid-cols-1 gap-4 pt-4 md:grid-cols-2'>
            <div>
              <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                Created Date
              </div>
              <div className='text-paragraph-sm text-text-strong-950'>
                {formatDate(supplier.createdAt)}
              </div>
            </div>

            {supplier.updatedAt &&
              supplier.updatedAt !== supplier.createdAt && (
                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Last Updated
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {formatDate(supplier.updatedAt)}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className='flex flex-col gap-2 lg:hidden'>
          <Button.Root
            variant='primary'
            size='medium'
            onClick={handleEdit}
            className='w-full'
          >
            <Button.Icon as={RiEditLine} />
            Edit Supplier
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            onClick={handleBack}
            className='w-full'
          >
            <Button.Icon as={RiArrowLeftLine} />
            Back to Suppliers
          </Button.Root>
        </div>
      </div>
    </>
  );
}
