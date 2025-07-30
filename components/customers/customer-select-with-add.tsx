'use client';

import { useState } from 'react';
import { RiAddLine, RiUserLine } from '@remixicon/react';

import { useCustomers } from '@/hooks/use-customers';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';

interface CustomerSelectWithAddProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CustomerSelectWithAdd({
  value,
  onValueChange,
  placeholder = 'Select a customer',
  required = false,
}: CustomerSelectWithAddProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
  });

  const { data: customers, refetch: refetchCustomers } = useCustomers();

  const handleAddCustomer = async () => {
    if (!newCustomerData.name || !newCustomerData.code) {
      alert('Please fill in customer name and code');
      return;
    }

    setIsAddingCustomer(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomerData),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const result = await response.json();

      // Refresh customers list
      await refetchCustomers();

      // Select the new customer
      onValueChange(result.data.id);

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      setNewCustomerData({
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
      });

      alert('Customer created successfully!');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer. Please try again.');
    } finally {
      setIsAddingCustomer(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof newCustomerData,
    value: string,
  ) => {
    setNewCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Select.Root
        value={value}
        onValueChange={(newValue) => {
          if (newValue === 'ADD_NEW_CUSTOMER') {
            setIsAddDialogOpen(true);
          } else {
            onValueChange(newValue);
          }
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value='ADD_NEW_CUSTOMER'>
            <div className='flex items-center gap-2'>
              <RiAddLine className='size-4' />
              <span>Add New Customer</span>
            </div>
          </Select.Item>
          <Select.Separator />
          {customers?.data?.map((customer) => (
            <Select.Item key={customer.id} value={customer.id}>
              <div className='flex flex-col'>
                <div className='font-medium'>{customer.name}</div>
                <div className='text-xs text-text-sub-600 flex items-center gap-2'>
                  <span>{customer.code}</span>
                  {customer.type && (
                    <>
                      <span>•</span>
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                        customer.type === 'company'
                          ? 'bg-primary-50 text-primary-700' 
                          : 'bg-success-50 text-success-700'
                      }`}>
                        {customer.type === 'company' ? 'Company' : 'Individual'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Modal.Root open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <Modal.Content className='sm:max-w-md'>
          <Modal.Header>
            <Modal.Title>Add New Customer</Modal.Title>
            <Modal.Description>
              Create a new customer to add to your database.
            </Modal.Description>
          </Modal.Header>

          <div className='space-y-4 p-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='customerName'>
                  Customer Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='customerName'
                      value={newCustomerData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder='Enter customer name'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='customerCode'>
                  Customer Code <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='customerCode'
                      value={newCustomerData.code}
                      onChange={(e) =>
                        handleInputChange('code', e.target.value)
                      }
                      placeholder='Enter customer code'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='customerEmail'>Email</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='customerEmail'
                    type='email'
                    value={newCustomerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder='Enter email address'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='customerPhone'>Phone</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='customerPhone'
                    value={newCustomerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Enter phone number'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='customerAddress'>Address</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='customerAddress'
                    value={newCustomerData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder='Enter customer address'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>

          <Modal.Footer>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isAddingCustomer}
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant='primary'
              onClick={handleAddCustomer}
              disabled={
                isAddingCustomer ||
                !newCustomerData.name ||
                !newCustomerData.code
              }
            >
              {isAddingCustomer ? 'Adding...' : 'Add Customer'}
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
