'use client';

import { RiAddLine } from '@remixicon/react';

import { useCustomers } from '@/hooks/use-customers';
import * as Select from '@/components/ui/select';

interface CustomerSelectWithAddProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CustomerSelectWithAdd({
  value,
  onValueChange,
  placeholder = 'Select a customer',
}: CustomerSelectWithAddProps) {
  const { data: customers } = useCustomers();

  return (
    <Select.Root
      value={value}
      onValueChange={(newValue) => {
        if (newValue === 'ADD_NEW_CUSTOMER') {
          window.open('/customers/new', '_blank');
        } else {
          onValueChange(newValue);
        }
      }}
    >
      <Select.Trigger>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content>
        {customers?.data?.map((customer) => (
          <Select.Item
            key={customer.id}
            value={customer.id}
            disabled={!customer.isActive}
          >
            <span>{customer.name}</span>
            <small>•</small>
            <small>{customer.code}</small>
            <small>•</small>
            <small>
              {customer.type === 'company' ? 'Company' : 'Individual'}
            </small>
            {!customer.isActive && '(Inactive)'}
          </Select.Item>
        ))}
        <Select.Separator />
        <Select.Item value='ADD_NEW_CUSTOMER'>
          <div className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            <span>Add New Customer</span>
          </div>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
