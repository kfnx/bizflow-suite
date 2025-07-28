'use client';

import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiBuildingLine,
  RiEditLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { useCustomerDetail } from '@/hooks/use-customers';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import Header from '@/components/header';

interface CustomerDetailProps {
  id: string;
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const router = useRouter();
  const { data: customer, isLoading, error } = useCustomerDetail(id);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Loading customer details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-red-600'>
          Error loading customer: {error.message}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Customer not found
        </div>
      </div>
    );
  }

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

  const handleEdit = () => {
    router.push(`/customers/${customer.id}/edit`);
  };

  const handleBack = () => {
    router.push('/customers');
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <Icon className='size-6 text-text-sub-600' />
          </div>
        }
        title={customer.name}
        description={`Customer Code: ${customer.code}`}
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
            Back to Customers
          </Button.Root>
          <Button.Root
            variant='primary'
            size='medium'
            onClick={handleEdit}
            className='hidden lg:flex'
          >
            <Button.Icon as={RiEditLine} />
            Edit Customer
          </Button.Root>
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {/* Status and Type Badges */}
        <div className='flex flex-wrap items-center gap-2'>
          <Badge.Root variant='lighter' color={config?.color}>
            <Icon className='size-3' />
            {config?.label || customer.type}
          </Badge.Root>
          <Badge.Root
            variant='lighter'
            color={customer.isActive ? 'green' : 'gray'}
          >
            {customer.isActive ? 'Active' : 'Inactive'}
          </Badge.Root>
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
                    Customer Code
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {customer.code}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Customer Name
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {customer.name}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Customer Type
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {config?.label || customer.type}
                  </div>
                </div>

                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Status
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {customer.isActive
                      ? 'Active Customer'
                      : 'Inactive Customer'}
                  </div>
                </div>

                {customer.paymentTerms && (
                  <div>
                    <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                      Payment Terms
                    </div>
                    <div className='text-paragraph-sm text-text-strong-950'>
                      {customer.paymentTerms}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tax Information */}
            {(customer.npwp || customer.npwp16) && (
              <div>
                <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                  Tax Information
                </h3>
                <div className='space-y-4'>
                  {customer.npwp && (
                    <div>
                      <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                        NPWP
                      </div>
                      <div className='text-paragraph-sm text-text-strong-950'>
                        {customer.npwp}
                      </div>
                    </div>
                  )}

                  {customer.npwp16 && (
                    <div>
                      <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                        NPWP 16-Digit
                      </div>
                      <div className='text-paragraph-sm text-text-strong-950'>
                        {customer.npwp16}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Address and Contact Information */}
          <div className='space-y-6'>
            {/* Address Information */}
            {(customer.address ||
              customer.billingAddress ||
              customer.shippingAddress) && (
              <div>
                <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                  Address Information
                </h3>
                <div className='space-y-4'>
                  {customer.address && (
                    <div>
                      <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                        <RiMapPinLine className='mr-1 inline size-3' />
                        Address
                      </div>
                      <div className='text-paragraph-sm text-text-strong-950'>
                        {customer.address}
                      </div>
                      {(customer.city ||
                        customer.province ||
                        customer.country ||
                        customer.postalCode) && (
                        <div className='text-paragraph-sm text-text-sub-600'>
                          {[
                            customer.city,
                            customer.province,
                            customer.country,
                            customer.postalCode,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {customer.billingAddress && (
                    <div>
                      <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                        Billing Address
                      </div>
                      <div className='text-paragraph-sm text-text-strong-950'>
                        {customer.billingAddress}
                      </div>
                    </div>
                  )}

                  {customer.shippingAddress && (
                    <div>
                      <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                        Shipping Address
                      </div>
                      <div className='text-paragraph-sm text-text-strong-950'>
                        {customer.shippingAddress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Persons */}
            {customer.contactPersons && customer.contactPersons.length > 0 && (
              <div>
                <h3 className='mb-4 text-title-h4 text-text-strong-950'>
                  Contact Persons
                </h3>
                <div className='space-y-4'>
                  {customer.contactPersons.map((contact, index) => (
                    <div
                      key={contact.id || index}
                      className='bg-gray-50 rounded-lg border p-4'
                    >
                      <div className='mb-2 text-paragraph-sm font-medium text-text-strong-950'>
                        {contact.name}
                        {index === 0 && (
                          <Badge.Root
                            variant='lighter'
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
                {formatDate(customer.createdAt)}
              </div>
            </div>

            {customer.updatedAt &&
              customer.updatedAt !== customer.createdAt && (
                <div>
                  <div className='mb-1 text-subheading-xs uppercase text-text-soft-400'>
                    Last Updated
                  </div>
                  <div className='text-paragraph-sm text-text-strong-950'>
                    {formatDate(customer.updatedAt)}
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
            Edit Customer
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            onClick={handleBack}
            className='w-full'
          >
            <Button.Icon as={RiArrowLeftLine} />
            Back to Customers
          </Button.Root>
        </div>
      </div>
    </>
  );
}
