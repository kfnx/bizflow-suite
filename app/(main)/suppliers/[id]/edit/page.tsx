'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBuildingLine,
  RiEditLine,
  RiGlobalLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
} from '@remixicon/react';

import { useSupplierDetail, useUpdateSupplier } from '@/hooks/use-suppliers';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface EditSupplierData {
  code: string;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  transactionCurrency: string;
  isActive: boolean;
  contactPersons: Array<{
    id?: string;
    name: string;
    email: string;
    phone: string;
  }>;
}

interface EditSupplierPageProps {
  params: {
    id: string;
  };
}

export default function EditSupplierPage({ params }: EditSupplierPageProps) {
  const router = useRouter();
  const {
    data: supplierData,
    isLoading: supplierLoading,
    error: supplierError,
  } = useSupplierDetail(params.id);
  const updateSupplierMutation = useUpdateSupplier();

  const [formData, setFormData] = useState<EditSupplierData>({
    code: '',
    name: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    transactionCurrency: 'RMB',
    isActive: true,
    contactPersons: [{ name: '', email: '', phone: '' }],
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Populate form data when supplier data is loaded
  useEffect(() => {
    if (supplierData) {
      setFormData({
        code: supplierData.code || '',
        name: supplierData.name || '',
        address: supplierData.address || '',
        city: supplierData.city || '',
        province: supplierData.province || '',
        country: supplierData.country || '',
        postalCode: supplierData.postalCode || '',
        transactionCurrency: supplierData.transactionCurrency || 'USD',
        isActive:
          supplierData.isActive !== undefined ? supplierData.isActive : true,
        contactPersons:
          supplierData.contactPersons && supplierData.contactPersons.length > 0
            ? supplierData.contactPersons.map((cp) => ({
                id: cp.id,
                name: cp.name,
                email: cp.email || '',
                phone: cp.phone || '',
              }))
            : [{ name: '', email: '', phone: '' }],
      });
    }
  }, [supplierData]);

  if (supplierLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  if (supplierError) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        Error: {supplierError.message}
      </div>
    );
  }

  if (!supplierData) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        Supplier not found
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      return;
    }

    try {
      await updateSupplierMutation.mutateAsync({
        supplierId: params.id,
        supplierData: formData,
      });

      // Navigate back to suppliers list
      router.push('/suppliers');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the supplier');
      }
    }
  };

  const handleInputChange = (
    field: keyof EditSupplierData,
    value: string | boolean | Array<any>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  const handleContactPersonChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedContacts = [...formData.contactPersons];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    handleInputChange('contactPersons', updatedContacts);
  };

  const addContactPerson = () => {
    handleInputChange('contactPersons', [
      ...formData.contactPersons,
      { name: '', email: '', phone: '' },
    ]);
  };

  const removeContactPerson = (index: number) => {
    if (formData.contactPersons.length > 1) {
      const updatedContacts = formData.contactPersons.filter(
        (_, i) => i !== index,
      );
      handleInputChange('contactPersons', updatedContacts);
    }
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6' />
          </div>
        }
        title='Edit Supplier'
        description={`Update ${supplierData.name}'s information.`}
      >
        <BackButton href='/suppliers' label='Back to Suppliers' />
      </Header>
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
            {error && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {error}
              </div>
            )}

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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('code', e.target.value)
                        }
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
                    Supplier Name <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiBuildingLine} />
                      <Input.Input
                        id='name'
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('name', e.target.value)
                        }
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
                  <Label.Root htmlFor='transactionCurrency'>
                    Transaction Currency <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.transactionCurrency}
                    defaultValue='RMB'
                    onValueChange={(value) =>
                      handleInputChange('transactionCurrency', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiGlobalLine} />
                      <Select.Value placeholder='Select currency' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='RMB'>RMB</Select.Item>
                      <Select.Item value='USD'>USD</Select.Item>
                      <Select.Item value='EUR'>EUR</Select.Item>
                      <Select.Item value='IDR'>IDR</Select.Item>
                      <Select.Item value='CNY'>CNY</Select.Item>
                      <Select.Item value='SGD'>SGD</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='isActive'>Status</Label.Root>
                  <Select.Root
                    value={formData.isActive ? 'active' : 'inactive'}
                    onValueChange={(value) =>
                      handleInputChange('isActive', value === 'active')
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiBuildingLine} />
                      <Select.Value placeholder='Select status' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='active'>Active</Select.Item>
                      <Select.Item value='inactive'>Inactive</Select.Item>
                    </Select.Content>
                  </Select.Root>
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
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
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
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
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
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
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
              disabled={updateSupplierMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={updateSupplierMutation.isPending}
            >
              {updateSupplierMutation.isPending
                ? 'Updating...'
                : 'Update Supplier'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
