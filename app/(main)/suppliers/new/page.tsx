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
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

const countries = [
  'Indonesia',
  'China',
  'Japan',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'South Korea',
  'India',
  'Australia',
  'United States',
  'Germany',
  'United Kingdom',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Romania',
  'Bulgaria',
  'Greece',
  'Portugal',
  'Ireland',
  'Canada',
  'Mexico',
  'Brazil',
  'Argentina',
  'Chile',
  'Colombia',
  'Peru',
  'Venezuela',
  'Uruguay',
  'Paraguay',
  'Ecuador',
  'Bolivia',
  'Other',
];

const currencies = [
  'RMB', // chinese yuan
  'USD',
  'IDR',
  'SGD',
];

interface SupplierFormData {
  code: string;
  name: string;
  country: string;
  address: string;
  postalCode: string;
  transactionCurrency: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
}

export default function NewSupplierPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SupplierFormData>({
    code: '',
    name: '',
    country: '',
    address: '',
    postalCode: '',
    transactionCurrency: 'USD',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
  });

  const handleInputChange = (field: keyof SupplierFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          {/* Basic Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-xs text-text-900 mb-4 font-semibold'>
              Basic Information
            </h2>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='space-y-2'>
                <Label.Root htmlFor='code'>
                  Supplier Code <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiBuildingLine} />
                    <Input.Input
                      id='code'
                      type='text'
                      placeholder='Enter supplier code'
                      value={formData.code}
                      onChange={(e) =>
                        handleInputChange('code', e.target.value)
                      }
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='space-y-2'>
                <Label.Root htmlFor='name'>
                  Supplier Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiBuildingLine} />
                    <Input.Input
                      id='name'
                      type='text'
                      placeholder='Enter supplier name'
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='space-y-2'>
                <Label.Root htmlFor='country'>Country</Label.Root>
                <Select.Root
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <Select.Trigger>
                    <Select.TriggerIcon as={RiMapPinLine} />
                    <Select.Value placeholder='Select country' />
                  </Select.Trigger>
                  <Select.Content>
                    {countries.map((country) => (
                      <Select.Item key={country} value={country}>
                        {country}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className='space-y-2'>
                <Label.Root htmlFor='transactionCurrency'>
                  Transaction Currency
                </Label.Root>
                <Select.Root
                  value={formData.transactionCurrency}
                  onValueChange={(value) =>
                    handleInputChange('transactionCurrency', value)
                  }
                >
                  <Select.Trigger>
                    <Select.TriggerIcon as={RiGlobalLine} />
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {currencies.map((currency) => (
                      <Select.Item key={currency} value={currency}>
                        {currency}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-xs text-text-900 mb-4 font-semibold'>
              Address Information
            </h2>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='space-y-2 lg:col-span-2'>
                <Label.Root htmlFor='address'>Address</Label.Root>
                <Textarea.Root
                  id='address'
                  placeholder='Enter complete address'
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange('address', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className='space-y-2'>
                <Label.Root htmlFor='postalCode'>Postal Code</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiMapPinLine} />
                    <Input.Input
                      id='postalCode'
                      type='text'
                      placeholder='Enter postal code'
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange('postalCode', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h2 className='text-heading-xs text-text-900 mb-4 font-semibold'>
              Contact Information
            </h2>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <div className='space-y-2'>
                <Label.Root htmlFor='contactPersonName'>
                  Contact Person Name
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiUserLine} />
                    <Input.Input
                      id='contactPersonName'
                      type='text'
                      placeholder='Enter contact person name'
                      value={formData.contactPersonName}
                      onChange={(e) =>
                        handleInputChange('contactPersonName', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='space-y-2'>
                <Label.Root htmlFor='contactPersonEmail'>
                  Contact Person Email
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiMailLine} />
                    <Input.Input
                      id='contactPersonEmail'
                      type='email'
                      placeholder='Enter contact person email'
                      value={formData.contactPersonEmail}
                      onChange={(e) =>
                        handleInputChange('contactPersonEmail', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='space-y-2'>
                <Label.Root htmlFor='contactPersonPhone'>
                  Contact Person Phone
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiPhoneLine} />
                    <Input.Input
                      id='contactPersonPhone'
                      type='tel'
                      placeholder='Enter contact person phone'
                      value={formData.contactPersonPhone}
                      onChange={(e) =>
                        handleInputChange('contactPersonPhone', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end gap-3'>
            <Button.Root
              type='button'
              mode='ghost'
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Supplier'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
