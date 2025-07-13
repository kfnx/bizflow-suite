'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBox3Line,
  RiBuildingLine,
  RiCalendarLine,
  RiEditLine,
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

interface ImportItem {
  id?: string;
  productId?: string;
  category: 'serialized' | 'non_serialized' | 'bulk';
  priceRMB: string;
  quantity: number;
  total: string;
  notes?: string;
  name: string;
  description?: string;
  brandId: string;
  // Product creation fields
  machineTypeId?: string;
  unitOfMeasureId?: string;
  modelOrPartNumber?: string;
  machineNumber?: string;
  engineNumber?: string;
  batchOrLotNumber?: string;
  serialNumber?: string;
  model?: string;
  year?: number;
  condition: 'new' | 'used' | 'refurbished';
  engineModel?: string;
  enginePower?: string;
  operatingWeight?: string;
}

interface EditImportData {
  supplierId: string;
  warehouseId: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  exchangeRateRMBtoIDR: string;
  notes: string;
  items: ImportItem[];
}

interface EditImportPageProps {
  params: {
    id: string;
  };
}

export default function EditImportPage({ params }: EditImportPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditImportData>({
    supplierId: '',
    warehouseId: '',
    importDate: '',
    invoiceNumber: '',
    invoiceDate: '',
    exchangeRateRMBtoIDR: '2250',
    notes: '',
    items: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch import data from API
  useEffect(() => {
    const fetchImportData = async () => {
      try {
        const response = await fetch(`/api/imports/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Import not found');
          } else {
            setError('Failed to load import data');
          }
          setIsLoading(false);
          return;
        }

        const result = await response.json();
        const importData = result.data;

        // Transform API data to form data
        setFormData({
          supplierId: importData.supplierId || '',
          warehouseId: importData.warehouseId || '',
          importDate: importData.importDate
            ? new Date(importData.importDate).toISOString().split('T')[0]
            : '',
          invoiceNumber: importData.invoiceNumber || '',
          invoiceDate: importData.invoiceDate
            ? new Date(importData.invoiceDate).toISOString().split('T')[0]
            : '',
          exchangeRateRMBtoIDR:
            importData.exchangeRateRMBtoIDR?.toString() || '0',
          notes: importData.notes || '',
          items:
            importData.items?.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              productCode: item.productCode || '',
              name: item.name || '',
              productDescription: item.productDescription,
              productCategory: item.productCategory || 'non_serialized',
              priceRMB: item.priceRMB?.toString() || '0',
              quantity: item.quantity || 0,
              total: item.total?.toString() || '0',
              notes: item.notes,
              machineTypeId: item.machineTypeId,
              unitOfMeasureId: item.unitOfMeasureId,
              brandId: item.brandId,
              modelOrPartNumber: item.modelOrPartNumber,
              machineNumber: item.machineNumber,
              engineNumber: item.engineNumber,
              batchOrLotNumber: item.batchOrLotNumber,
              description: item.description,
              serialNumber: item.serialNumber,
              model: item.model,
              year: item.year,
              condition: item.condition || 'new',
              engineModel: item.engineModel,
              enginePower: item.enginePower,
              operatingWeight: item.operatingWeight,
            })) || [],
        });
      } catch (err) {
        console.error('Error fetching import data:', err);
        setError('Failed to load import data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImportData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        {error}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    setIsUpdating(true);

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
    if (!formData.items || formData.items.length === 0) {
      errors.items = 'At least one product item is required';
    }
    if (
      !formData.exchangeRateRMBtoIDR ||
      parseFloat(formData.exchangeRateRMBtoIDR) <= 0
    ) {
      errors.exchangeRateRMBtoIDR = 'Exchange rate must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsUpdating(false);
      return;
    }

    try {
      // Prepare data for API
      const apiData = {
        supplierId: formData.supplierId,
        warehouseId: formData.warehouseId,
        importDate: formData.importDate,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        exchangeRateRMBtoIDR: formData.exchangeRateRMBtoIDR,
        notes: formData.notes,
        items: formData.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          description: item.description,
          category: item.category,
          priceRMB: item.priceRMB,
          quantity: item.quantity,
          notes: item.notes,
          machineTypeId: item.machineTypeId,
          unitOfMeasureId: item.unitOfMeasureId,
          brandId: item.brandId,
          modelOrPartNumber: item.modelOrPartNumber,
          machineNumber: item.machineNumber,
          engineNumber: item.engineNumber,
          batchOrLotNumber: item.batchOrLotNumber,
          serialNumber: item.serialNumber,
          model: item.model,
          year: item.year,
          condition: item.condition,
          engineModel: item.engineModel,
          enginePower: item.enginePower,
          operatingWeight: item.operatingWeight,
        })),
      };

      const response = await fetch(`/api/imports/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update import');
      }

      router.push('/imports');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the import');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: keyof EditImportData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  const calculateTotal = () => {
    const exchangeRate = parseFloat(formData.exchangeRateRMBtoIDR) || 0;
    const itemsTotal = formData.items.reduce((total, item) => {
      const itemTotal = item.quantity * parseFloat(item.priceRMB);
      return total + itemTotal;
    }, 0);

    return itemsTotal * exchangeRate;
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6' />
          </div>
        }
        title='Edit Import'
        description={`Update import record.`}
      >
        <BackButton href='/imports' label='Back to Imports' />
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

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-1'>
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

            {/* Exchange Rate */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Exchange Rate
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-1'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='exchangeRateRMBtoIDR'>
                    Exchange Rate (RMB to IDR) <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiGlobalLine} />
                      <Input.Input
                        id='exchangeRateRMBtoIDR'
                        type='number'
                        min='0'
                        value={formData.exchangeRateRMBtoIDR}
                        onChange={(e) =>
                          handleInputChange(
                            'exchangeRateRMBtoIDR',
                            e.target.value,
                          )
                        }
                        placeholder='Enter exchange rate'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.exchangeRateRMBtoIDR && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.exchangeRateRMBtoIDR}
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
              disabled={isUpdating}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Import'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
