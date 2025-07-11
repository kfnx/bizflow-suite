'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiArrowLeftLine,
  RiDeleteBin2Line,
  RiUserLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';
import { Root as TextareaRoot } from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'company',
    npwp: '',
    npwp16: '',
    billingAddress: '',
    shippingAddress: '',
    contactPersons: [{ name: '', email: '', phone: '' }],
    paymentTerms: 'NET 30',
    isPPN: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      router.push('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactPersonChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedContactPersons = [...formData.contactPersons];
    updatedContactPersons[index] = {
      ...updatedContactPersons[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      contactPersons: updatedContactPersons,
    }));
  };

  const addContactPerson = () => {
    setFormData((prev) => ({
      ...prev,
      contactPersons: [
        ...prev.contactPersons,
        { name: '', email: '', phone: '' },
      ],
    }));
  };

  const removeContactPerson = (index: number) => {
    if (formData.contactPersons.length > 1) {
      const updatedContactPersons = formData.contactPersons.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        contactPersons: updatedContactPersons,
      }));
    }
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiUserLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Customer'
        description='Add a new customer to your database.'
      >
        <BackButton href='/customers' label='Back to Customers' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Basic Information
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='code'>
                  Customer Code <span className='text-red-500'>*</span>
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='code'
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder='CUST001'
                    required
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='name'>
                  Customer Name <span className='text-red-500'>*</span>
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='name'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder='PT Customer Pertama'
                    required
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='type'>Customer Type</Label.Root>
                <Select.Root
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='individual'>Individual</Select.Item>
                    <Select.Item value='company'>Company</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='paymentTerms'>Payment Terms</Label.Root>
                <Select.Root
                  value={formData.paymentTerms}
                  onValueChange={(value) =>
                    handleInputChange('paymentTerms', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='NET 15'>NET 15</Select.Item>
                    <Select.Item value='NET 30'>NET 30</Select.Item>
                    <Select.Item value='NET 45'>NET 45</Select.Item>
                    <Select.Item value='NET 60'>NET 60</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Tax Information
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='npwp'>NPWP</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='npwp'
                    value={formData.npwp}
                    onChange={(e) => handleInputChange('npwp', e.target.value)}
                    placeholder='12.345.678.9-123.456'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='npwp16'>NPWP 16 Digit</Label.Root>
                <Input.Root>
                  <Input.Input
                    id='npwp16'
                    value={formData.npwp16}
                    onChange={(e) =>
                      handleInputChange('npwp16', e.target.value)
                    }
                    placeholder='12.345.678.9-123.456'
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <Switch.Root
                    id='isPPN'
                    checked={formData.isPPN}
                    onCheckedChange={(checked) =>
                      handleInputChange('isPPN', checked)
                    }
                  />
                  <Label.Root htmlFor='isPPN'>Include PPN</Label.Root>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-heading-sm font-semibold text-text-strong-950'>
                Contact Information
              </h2>
              <Button.Root
                type='button'
                mode='ghost'
                size='small'
                onClick={addContactPerson}
              >
                <RiAddLine className='mr-2 size-4' />
                Add Contact Person
              </Button.Root>
            </div>
            <div className='space-y-4'>
              {formData.contactPersons.map((contact, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-stroke-soft-200 p-4'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <h3 className='text-sm font-medium text-text-strong-950'>
                      Contact Person {index + 1}
                    </h3>
                    {formData.contactPersons.length > 1 && (
                      <Button.Root
                        type='button'
                        mode='ghost'
                        size='small'
                        onClick={() => removeContactPerson(index)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <RiDeleteBin2Line className='size-4' />
                      </Button.Root>
                    )}
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <div className='flex flex-col gap-2'>
                      <Label.Root htmlFor={`contactPersonName-${index}`}>
                        Name
                      </Label.Root>
                      <Input.Root>
                        <Input.Input
                          id={`contactPersonName-${index}`}
                          value={contact.name}
                          onChange={(e) =>
                            handleContactPersonChange(
                              index,
                              'name',
                              e.target.value,
                            )
                          }
                          placeholder='John Doe'
                          className='px-3'
                        />
                      </Input.Root>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Label.Root htmlFor={`contactPersonEmail-${index}`}>
                        Email
                      </Label.Root>
                      <Input.Root>
                        <Input.Input
                          id={`contactPersonEmail-${index}`}
                          type='email'
                          value={contact.email}
                          onChange={(e) =>
                            handleContactPersonChange(
                              index,
                              'email',
                              e.target.value,
                            )
                          }
                          placeholder='contact@company.com'
                          className='px-3'
                        />
                      </Input.Root>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Label.Root htmlFor={`contactPersonPhone-${index}`}>
                        Phone
                      </Label.Root>
                      <Input.Root>
                        <Input.Input
                          id={`contactPersonPhone-${index}`}
                          value={contact.phone}
                          onChange={(e) =>
                            handleContactPersonChange(
                              index,
                              'phone',
                              e.target.value,
                            )
                          }
                          placeholder='+6281234567890'
                          className='px-3'
                        />
                      </Input.Root>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-sm mb-4 font-semibold text-text-strong-950'>
              Addresses
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='billingAddress'>
                  Billing Address
                </Label.Root>
                <TextareaRoot
                  id='billingAddress'
                  value={formData.billingAddress}
                  onChange={(e) =>
                    handleInputChange('billingAddress', e.target.value)
                  }
                  placeholder='Enter billing address...'
                  rows={3}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='shippingAddress'>
                  Shipping Address
                </Label.Root>
                <TextareaRoot
                  id='shippingAddress'
                  value={formData.shippingAddress}
                  onChange={(e) =>
                    handleInputChange('shippingAddress', e.target.value)
                  }
                  placeholder='Enter shipping address...'
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end gap-3'>
            <Button.Root
              type='button'
              mode='ghost'
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' mode='filled' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Customer'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
