'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBox3Line,
  RiBuildingLine,
  RiCalendarLine,
  RiGlobalLine,
  RiHashtag,
  RiImportLine,
  RiMoneyDollarCircleLine,
  RiReceiptLine,
  RiStoreLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface ImportFormData {
  supplierId: string;
  warehouseId: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  productId: string;
  exchangeRateRMB: string;
  priceRMB: string;
  quantity: string;
  notes: string;
}

export default function NewImportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ImportFormData>({
    supplierId: '',
    warehouseId: '',
    importDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    productId: '',
    exchangeRateRMB: '',
    priceRMB: '',
    quantity: '',
    notes: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleInputChange = (field: keyof ImportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.supplierId) {
      errors.supplierId = 'Supplier is required';
    }
    if (!formData.warehouseId) {
      errors.warehouseId = 'Warehouse is required';
    }
    if (!formData.invoiceNumber.trim()) {
      errors.invoiceNumber = 'Invoice number is required';
    }
    if (!formData.productId) {
      errors.productId = 'Product is required';
    }
    if (!formData.quantity.trim()) {
      errors.quantity = 'Quantity is required';
    }
    if (!formData.priceRMB.trim()) {
      errors.priceRMB = 'Price (RMB) is required';
    }
    if (!formData.exchangeRateRMB.trim()) {
      errors.exchangeRateRMB = 'Exchange rate is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement API call
      const response = await fetch('/api/imports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          priceRMB: parseFloat(formData.priceRMB),
          exchangeRateRMB: parseFloat(formData.exchangeRateRMB),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create import');
      }

      router.push('/imports');
    } catch (error) {
      console.error('Error creating import:', error);
      alert('Failed to create import. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const priceRMB = parseFloat(formData.priceRMB) || 0;
    const exchangeRate = parseFloat(formData.exchangeRateRMB) || 0;

    return quantity * priceRMB * exchangeRate;
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImportLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Import'
        description='Record a new product import from supplier.'
      >
        <BackButton href='/imports' label='Back to Imports' />
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
                  <Label.Root htmlFor='supplierId'>
                    Supplier <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.supplierId}
                    onValueChange={(value) =>
                      handleInputChange('supplierId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiBuildingLine} />
                      <Select.Value placeholder='Select supplier' />
                    </Select.Trigger>
                    <Select.Content>
                      {/* TODO: Add dynamic supplier options */}
                      <Select.Item value='supplier1'>Supplier 1</Select.Item>
                      <Select.Item value='supplier2'>Supplier 2</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.supplierId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.supplierId}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='warehouseId'>
                    Warehouse <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.warehouseId}
                    onValueChange={(value) =>
                      handleInputChange('warehouseId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiStoreLine} />
                      <Select.Value placeholder='Select warehouse' />
                    </Select.Trigger>
                    <Select.Content>
                      {/* TODO: Add dynamic warehouse options */}
                      <Select.Item value='warehouse1'>Warehouse 1</Select.Item>
                      <Select.Item value='warehouse2'>Warehouse 2</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.warehouseId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.warehouseId}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='importDate'>
                    Import Date <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiCalendarLine} />
                      <Input.Input
                        id='importDate'
                        type='date'
                        value={formData.importDate}
                        onChange={(e) =>
                          handleInputChange('importDate', e.target.value)
                        }
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='productId'>
                    Product <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.productId}
                    onValueChange={(value) =>
                      handleInputChange('productId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiBox3Line} />
                      <Select.Value placeholder='Select product' />
                    </Select.Trigger>
                    <Select.Content>
                      {/* TODO: Add dynamic product options */}
                      <Select.Item value='product1'>Product 1</Select.Item>
                      <Select.Item value='product2'>Product 2</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.productId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.productId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Invoice Information */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Invoice Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='invoiceNumber'>
                    Invoice Number <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiReceiptLine} />
                      <Input.Input
                        id='invoiceNumber'
                        value={formData.invoiceNumber}
                        onChange={(e) =>
                          handleInputChange('invoiceNumber', e.target.value)
                        }
                        placeholder='Enter invoice number'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.invoiceNumber && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.invoiceNumber}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='invoiceDate'>
                    Invoice Date <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiCalendarLine} />
                      <Input.Input
                        id='invoiceDate'
                        type='date'
                        value={formData.invoiceDate}
                        onChange={(e) =>
                          handleInputChange('invoiceDate', e.target.value)
                        }
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Quantity and Pricing */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Quantity and Pricing
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='quantity'>
                    Quantity <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiHashtag} />
                      <Input.Input
                        id='quantity'
                        type='number'
                        min='1'
                        value={formData.quantity}
                        onChange={(e) =>
                          handleInputChange('quantity', e.target.value)
                        }
                        placeholder='Enter quantity'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.quantity && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.quantity}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='priceRMB'>
                    Price (RMB) <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiMoneyDollarCircleLine} />
                      <Input.Input
                        id='priceRMB'
                        type='number'
                        step='0.01'
                        min='0'
                        value={formData.priceRMB}
                        onChange={(e) =>
                          handleInputChange('priceRMB', e.target.value)
                        }
                        placeholder='Enter price in RMB'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.priceRMB && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.priceRMB}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='exchangeRateRMB'>
                    Exchange Rate (RMB to IDR) <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiGlobalLine} />
                      <Input.Input
                        id='exchangeRateRMB'
                        type='number'
                        step='0.01'
                        min='0'
                        value={formData.exchangeRateRMB}
                        onChange={(e) =>
                          handleInputChange('exchangeRateRMB', e.target.value)
                        }
                        placeholder='Enter exchange rate'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.exchangeRateRMB && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.exchangeRateRMB}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Calculation */}
              <div className='mt-6 rounded-lg border border-stroke-soft-200 p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Total Amount (IDR):
                  </span>
                  <span className='text-paragraph-lg font-semibold text-text-strong-950'>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Notes */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Additional Information
              </h3>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='notes'>Notes</Label.Root>
                <TextArea.Root
                  id='notes'
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder='Enter additional notes (optional)'
                  simple
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push('/imports')}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Import'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
