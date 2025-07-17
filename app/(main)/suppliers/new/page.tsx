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

interface ContactPerson {
  name: string;
  email: string;
  phone: string;
}

interface SupplierFormData {
  code: string;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  transactionCurrency: string;
  isActive: boolean;
  contactPersons: ContactPerson[];
}

export default function NewSupplierPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>({
    code: '',
    name: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    transactionCurrency: 'USD',
    isActive: true,
    contactPersons: [{ name: '', email: '', phone: '' }],
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleInputChange = (
    field: keyof SupplierFormData,
    value: string | boolean | ContactPerson[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleContactPersonChange = (
    index: number,
    field: keyof ContactPerson,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = 'Supplier code is required';
    }
    if (!formData.name.trim()) {
      errors.name = 'Supplier name is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create supplier');
      }

      router.push('/suppliers');
    } catch (error) {
      console.error('Error creating supplier:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to create supplier',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBuildingLine className='size-6' />
          </div>
        }
        title='New Supplier'
        description='Add a new supplier to your database.'
      >
        <BackButton href='/suppliers' label='Back to Suppliers' />
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
                    Supplier Code <Label.Asterisk />
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
                        required
                        placeholder='Enter supplier code'
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
                    Supplier Name <Label.Asterisk />
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
                        required
                        placeholder='Enter supplier name'
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
            </div>

            <Divider.Root />

            {/* Address Information */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Address Information
              </h3>

              <div className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='address'>Business Address</Label.Root>
                  <TextArea.Root
                    id='address'
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    rows={3}
                    placeholder='Enter business address'
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
                    <Label.Root htmlFor='province'>Province/State</Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiMapPinLine} />
                        <Input.Input
                          id='province'
                          value={formData.province}
                          onChange={(e) =>
                            handleInputChange('province', e.target.value)
                          }
                          placeholder='Enter province or state'
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
              onClick={() => router.push('/suppliers')}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Supplier'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
