'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBuildingLine,
  RiGlobalLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
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
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    contactPersons: [{ name: '', email: '', phone: '' }],
    paymentTerms: 'NET 30',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = 'Customer code is required';
    }
    if (!formData.name.trim()) {
      errors.name = 'Customer name is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

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

  const handleInputChange = (
    field: string,
    value: string | boolean | Array<any>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
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
    handleInputChange('contactPersons', [
      ...formData.contactPersons,
      { name: '', email: '', phone: '' },
    ]);
  };

  const removeContactPerson = (index: number) => {
    if (formData.contactPersons.length > 1) {
      const updatedContactPersons = formData.contactPersons.filter(
        (_, i) => i !== index,
      );
      handleInputChange('contactPersons', updatedContactPersons);
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
          <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
            {/* Basic Information */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Basic Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='code'>
                    Customer Code <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiBuildingLine} />
                      <Input.Input
                        id='code'
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange('code', e.target.value)
                        }
                        placeholder='CUST001'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.code && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.code}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='name'>
                    Customer Name <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiBuildingLine} />
                      <Input.Input
                        id='name'
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder='PT Customer Pertama'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.name && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.name}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='type'>
                    Customer Type <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiUserLine} />
                      <Select.Value placeholder='Select customer type' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='individual'>Individual</Select.Item>
                      <Select.Item value='company'>Company</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='paymentTerms'>Payment Terms</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiGlobalLine} />
                      <Input.Input
                        id='paymentTerms'
                        value={formData.paymentTerms}
                        onChange={(e) =>
                          handleInputChange('paymentTerms', e.target.value)
                        }
                        placeholder='e.g., NET 30, NET 15'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Tax Information */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Tax Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='npwp'>NPWP</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiGlobalLine} />
                      <Input.Input
                        id='npwp'
                        value={formData.npwp}
                        onChange={(e) =>
                          handleInputChange('npwp', e.target.value)
                        }
                        placeholder='Enter NPWP number'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='npwp16'>NPWP 16</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiGlobalLine} />
                      <Input.Input
                        id='npwp16'
                        value={formData.npwp16}
                        onChange={(e) =>
                          handleInputChange('npwp16', e.target.value)
                        }
                        placeholder='Enter NPWP 16 number'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Address Information */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Address Information
              </h3>

              <div className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='address'>Primary Address</Label.Root>
                  <TextArea.Root
                    id='address'
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    rows={3}
                    placeholder='Enter primary address'
                    simple
                  />
                </div>

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='city'>City</Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiMapPinLine} />
                        <Input.Input
                          id='city'
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange('city', e.target.value)
                          }
                          placeholder='Enter city'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='province'>Province</Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiMapPinLine} />
                        <Input.Input
                          id='province'
                          value={formData.province}
                          onChange={(e) =>
                            handleInputChange('province', e.target.value)
                          }
                          placeholder='Enter province'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='country'>Country</Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiMapPinLine} />
                        <Input.Input
                          id='country'
                          value={formData.country}
                          onChange={(e) =>
                            handleInputChange('country', e.target.value)
                          }
                          placeholder='Enter country'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='postalCode'>Postal Code</Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiMapPinLine} />
                        <Input.Input
                          id='postalCode'
                          value={formData.postalCode}
                          onChange={(e) =>
                            handleInputChange('postalCode', e.target.value)
                          }
                          placeholder='Enter postal code'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='billingAddress'>
                    Billing Address
                  </Label.Root>
                  <TextArea.Root
                    id='billingAddress'
                    value={formData.billingAddress}
                    onChange={(e) =>
                      handleInputChange('billingAddress', e.target.value)
                    }
                    rows={3}
                    placeholder='Enter billing address (if different from primary)'
                    simple
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='shippingAddress'>
                    Shipping Address
                  </Label.Root>
                  <TextArea.Root
                    id='shippingAddress'
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      handleInputChange('shippingAddress', e.target.value)
                    }
                    rows={3}
                    placeholder='Enter shipping address (if different from primary)'
                    simple
                  />
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Contact Persons */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Contact Persons
              </h3>

              <div className='space-y-4'>
                {formData.contactPersons.map((contact, index) => (
                  <div
                    key={index}
                    className='rounded-lg border border-stroke-soft-200 p-4'
                  >
                    <div className='mb-4 flex items-center justify-between'>
                      <h4 className='text-sm text-gray-900 font-medium'>
                        Contact Person {index + 1}
                      </h4>
                      {formData.contactPersons.length > 1 && (
                        <Button.Root
                          type='button'
                          variant='neutral'
                          mode='ghost'
                          size='small'
                          onClick={() => removeContactPerson(index)}
                        >
                          Remove
                        </Button.Root>
                      )}
                    </div>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor={`contact-name-${index}`}>
                          Name
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiUserLine} />
                            <Input.Input
                              id={`contact-name-${index}`}
                              value={contact.name}
                              onChange={(e) =>
                                handleContactPersonChange(
                                  index,
                                  'name',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter name'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>

                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor={`contact-email-${index}`}>
                          Email
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiMailLine} />
                            <Input.Input
                              id={`contact-email-${index}`}
                              type='email'
                              value={contact.email}
                              onChange={(e) =>
                                handleContactPersonChange(
                                  index,
                                  'email',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter email'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>

                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor={`contact-phone-${index}`}>
                          Phone
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiPhoneLine} />
                            <Input.Input
                              id={`contact-phone-${index}`}
                              type='tel'
                              value={contact.phone}
                              onChange={(e) =>
                                handleContactPersonChange(
                                  index,
                                  'phone',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter phone'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>
                    </div>
                  </div>
                ))}

                <Button.Root
                  type='button'
                  variant='neutral'
                  mode='stroke'
                  size='small'
                  onClick={addContactPerson}
                >
                  Add Contact Person
                </Button.Root>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push('/customers')}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Customer'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
