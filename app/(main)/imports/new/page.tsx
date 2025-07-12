'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiBox3Line,
  RiBuildingLine,
  RiCalendarLine,
  RiDeleteBinLine,
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

interface ProductItem {
  id?: string;
  productId?: string;
  code: string;
  name: string;
  description?: string;
  category: 'serialized' | 'non_serialized' | 'bulk';
  priceRMB: string;
  quantity: string;
  notes?: string;

  // Common fields
  brandId?: string;
  condition: 'new' | 'used' | 'refurbished';
  year?: string;

  // Category-specific fields
  machineTypeId?: string;
  unitOfMeasureId?: string;
  modelOrPartNumber?: string;
  machineNumber?: string;
  engineNumber?: string;
  serialNumber?: string;
  model?: string;
  engineModel?: string;
  enginePower?: string;
  operatingWeight?: string;

  // Non-serialized specific
  itemName?: string;
  batchOrLotNumber?: string;
  itemDescription?: string;
}

interface ImportFormData {
  supplierId: string;
  warehouseId: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  exchangeRateRMB: string;
  notes: string;
  items: ProductItem[];
}

interface Supplier {
  id: string;
  name: string;
  code: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface MachineType {
  id: string;
  name: string;
}

interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
}

interface ProductItemFormProps {
  item: ProductItem;
  index: number;
  onUpdate: (item: ProductItem) => void;
  onRemove: () => void;
  brands: Brand[];
  machineTypes: MachineType[];
  unitOfMeasures: UnitOfMeasure[];
  canRemove: boolean;
  validationErrors: Record<string, string>;
}

function ProductItemForm({
  item,
  index,
  onUpdate,
  onRemove,
  brands,
  machineTypes,
  unitOfMeasures,
  canRemove,
  validationErrors,
}: ProductItemFormProps) {
  const handleFieldChange = (field: keyof ProductItem, value: any) => {
    onUpdate({ ...item, [field]: value });
  };

  const getFieldError = (field: string) => {
    return validationErrors[`items.${index}.${field}`];
  };

  return (
    <div className='rounded-lg border border-stroke-soft-200 p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h4 className='text-base text-gray-900 font-medium'>
          Product {index + 1}
        </h4>
        {canRemove && (
          <Button.Root
            type='button'
            variant='neutral'
            mode='ghost'
            size='small'
            onClick={onRemove}
          >
            <RiDeleteBinLine className='size-4' />
          </Button.Root>
        )}
      </div>

      <div className='space-y-6'>
        {/* Basic Information */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`code-${index}`}>
              Product Code <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiHashtag} />
                <Input.Input
                  id={`code-${index}`}
                  value={item.code}
                  onChange={(e) => handleFieldChange('code', e.target.value)}
                  placeholder='Enter product code'
                  required
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('code') && (
              <div className='text-xs text-red-600'>
                {getFieldError('code')}
              </div>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`name-${index}`}>
              Product Name <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiBox3Line} />
                <Input.Input
                  id={`name-${index}`}
                  value={item.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder='Enter product name'
                  required
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('name') && (
              <div className='text-xs text-red-600'>
                {getFieldError('name')}
              </div>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`category-${index}`}>
              Category <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={item.category}
              onValueChange={(value) => handleFieldChange('category', value)}
            >
              <Select.Trigger>
                <Select.TriggerIcon as={RiBox3Line} />
                <Select.Value placeholder='Select category' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='serialized'>Serialized</Select.Item>
                <Select.Item value='non_serialized'>Non-Serialized</Select.Item>
                <Select.Item value='bulk'>Bulk</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`condition-${index}`}>
              Condition <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={item.condition}
              onValueChange={(value) => handleFieldChange('condition', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder='Select condition' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='new'>New</Select.Item>
                <Select.Item value='used'>Used</Select.Item>
                <Select.Item value='refurbished'>Refurbished</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`brand-${index}`}>Brand</Label.Root>
            <Select.Root
              value={item.brandId || 'none'}
              onValueChange={(value) =>
                handleFieldChange(
                  'brandId',
                  value === 'none' ? undefined : value,
                )
              }
            >
              <Select.Trigger>
                <Select.Value placeholder='Select brand' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='none'>No brand</Select.Item>
                {brands.map((brand) => (
                  <Select.Item key={brand.id} value={brand.id}>
                    {brand.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        {/* Category-specific fields */}
        {item.category === 'serialized' && (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor={`machineType-${index}`}>
                Machine Type <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={item.machineTypeId || ''}
                onValueChange={(value) =>
                  handleFieldChange('machineTypeId', value)
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder='Select machine type' />
                </Select.Trigger>
                <Select.Content>
                  {machineTypes.map((type) => (
                    <Select.Item key={type.id} value={type.id}>
                      {type.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {getFieldError('machineTypeId') && (
                <div className='text-xs text-red-600'>
                  {getFieldError('machineTypeId')}
                </div>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor={`serialNumber-${index}`}>
                Serial Number
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id={`serialNumber-${index}`}
                    value={item.serialNumber || ''}
                    onChange={(e) =>
                      handleFieldChange(
                        'serialNumber',
                        e.target.value || undefined,
                      )
                    }
                    placeholder='Enter serial number'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>
        )}

        {(item.category === 'non_serialized' || item.category === 'bulk') && (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor={`unitOfMeasure-${index}`}>
                Unit of Measure <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={item.unitOfMeasureId || ''}
                onValueChange={(value) =>
                  handleFieldChange('unitOfMeasureId', value)
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder='Select unit' />
                </Select.Trigger>
                <Select.Content>
                  {unitOfMeasures.map((unit) => (
                    <Select.Item key={unit.id} value={unit.id}>
                      {unit.name} ({unit.abbreviation})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {getFieldError('unitOfMeasureId') && (
                <div className='text-xs text-red-600'>
                  {getFieldError('unitOfMeasureId')}
                </div>
              )}
            </div>

            {item.category === 'non_serialized' && (
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor={`itemName-${index}`}>
                  Item Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id={`itemName-${index}`}
                      value={item.itemName || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'itemName',
                          e.target.value || undefined,
                        )
                      }
                      placeholder='Enter item name'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
                {getFieldError('itemName') && (
                  <div className='text-xs text-red-600'>
                    {getFieldError('itemName')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pricing and Quantity */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`quantity-${index}`}>
              Quantity <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiHashtag} />
                <Input.Input
                  id={`quantity-${index}`}
                  type='number'
                  min='1'
                  value={item.quantity}
                  onChange={(e) =>
                    handleFieldChange('quantity', e.target.value)
                  }
                  placeholder='Enter quantity'
                  required
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('quantity') && (
              <div className='text-xs text-red-600'>
                {getFieldError('quantity')}
              </div>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`priceRMB-${index}`}>
              Price (RMB) <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiMoneyDollarCircleLine} />
                <Input.Input
                  id={`priceRMB-${index}`}
                  type='number'
                  step='0.01'
                  min='0'
                  value={item.priceRMB}
                  onChange={(e) =>
                    handleFieldChange('priceRMB', e.target.value)
                  }
                  placeholder='Enter price in RMB'
                  required
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('priceRMB') && (
              <div className='text-xs text-red-600'>
                {getFieldError('priceRMB')}
              </div>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`year-${index}`}>Year</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiCalendarLine} />
                <Input.Input
                  id={`year-${index}`}
                  type='number'
                  min='1900'
                  max='2100'
                  value={item.year || ''}
                  onChange={(e) =>
                    handleFieldChange('year', e.target.value || undefined)
                  }
                  placeholder='Enter year'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>

        {/* Description and Notes */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`description-${index}`}>
              Description
            </Label.Root>
            <TextArea.Root
              id={`description-${index}`}
              value={item.description || ''}
              onChange={(e) =>
                handleFieldChange('description', e.target.value || undefined)
              }
              rows={3}
              placeholder='Enter product description'
              simple
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`notes-${index}`}>Notes</Label.Root>
            <TextArea.Root
              id={`notes-${index}`}
              value={item.notes || ''}
              onChange={(e) =>
                handleFieldChange('notes', e.target.value || undefined)
              }
              rows={3}
              placeholder='Enter additional notes'
              simple
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewImportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);

  const [formData, setFormData] = useState<ImportFormData>({
    supplierId: '',
    warehouseId: '',
    importDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    exchangeRateRMB: '2250',
    notes: '',
    items: [createEmptyProductItem()],
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Create empty product item
  function createEmptyProductItem(): ProductItem {
    return {
      code: '',
      name: '',
      category: 'serialized',
      priceRMB: '',
      quantity: '1',
      condition: 'new',
    };
  }

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [
          suppliersRes,
          warehousesRes,
          brandsRes,
          machineTypesRes,
          unitOfMeasuresRes,
        ] = await Promise.all([
          fetch('/api/suppliers'),
          fetch('/api/warehouses'),
          fetch('/api/brands'),
          fetch('/api/machine-types'),
          fetch('/api/unit-of-measures'),
        ]);

        if (suppliersRes.ok) {
          const suppliersData = await suppliersRes.json();
          setSuppliers(suppliersData.data || []);
        }

        if (warehousesRes.ok) {
          const warehousesData = await warehousesRes.json();
          setWarehouses(warehousesData.data || []);
        }

        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData.data || []);
        }

        if (machineTypesRes.ok) {
          const machineTypesData = await machineTypesRes.json();
          setMachineTypes(machineTypesData.data || []);
        }

        if (unitOfMeasuresRes.ok) {
          const unitOfMeasuresData = await unitOfMeasuresRes.json();
          setUnitOfMeasures(unitOfMeasuresData.data || []);
        }
      } catch (error) {
        console.error('Error loading reference data:', error);
      }
    };

    loadReferenceData();
  }, []);

  const handleInputChange = (field: keyof ImportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Product item management functions
  const addProductItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyProductItem()],
    }));
  };

  const removeProductItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateProductItem = (index: number, updatedItem: ProductItem) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? updatedItem : item)),
    }));
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
    if (!formData.exchangeRateRMB.trim()) {
      errors.exchangeRateRMB = 'Exchange rate is required';
    }

    // Validate items
    if (formData.items.length === 0) {
      errors.items = 'At least one product is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.code.trim()) {
        errors[`items.${index}.code`] = 'Product code is required';
      }
      if (!item.name.trim()) {
        errors[`items.${index}.name`] = 'Product name is required';
      }
      if (!item.priceRMB.trim()) {
        errors[`items.${index}.priceRMB`] = 'Price is required';
      }
      if (!item.quantity.trim()) {
        errors[`items.${index}.quantity`] = 'Quantity is required';
      }

      // Category-specific validation
      if (item.category === 'serialized' && !item.machineTypeId) {
        errors[`items.${index}.machineTypeId`] =
          'Machine type is required for serialized products';
      }
      if (
        (item.category === 'non_serialized' || item.category === 'bulk') &&
        !item.unitOfMeasureId
      ) {
        errors[`items.${index}.unitOfMeasureId`] =
          'Unit of measure is required';
      }
      if (item.category === 'non_serialized' && !item.itemName?.trim()) {
        errors[`items.${index}.itemName`] =
          'Item name is required for non-serialized products';
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // Transform items for API
      const transformedItems = formData.items.map((item) => ({
        ...item,
        quantity: parseInt(item.quantity),
        year: item.year ? parseInt(item.year) : undefined,
      }));

      const response = await fetch('/api/imports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: transformedItems,
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

  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const priceRMB = parseFloat(item.priceRMB) || 0;
      return total + quantity * priceRMB;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const exchangeRate = parseFloat(formData.exchangeRateRMB) || 0;
    return subtotal * exchangeRate;
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
                      {suppliers.map((supplier) => (
                        <Select.Item key={supplier.id} value={supplier.id}>
                          {supplier.name} ({supplier.code})
                        </Select.Item>
                      ))}
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
                      {warehouses.map((warehouse) => (
                        <Select.Item key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </Select.Item>
                      ))}
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
                  <Label.Root htmlFor='exchangeRateRMB'>
                    Exchange Rate (RMB to IDR) <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiGlobalLine} />
                      <Input.Input
                        id='exchangeRateRMB'
                        type='number'
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

            {/* Products */}
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg text-gray-900 font-medium'>Products</h3>
                <Button.Root
                  type='button'
                  variant='neutral'
                  mode='stroke'
                  size='small'
                  onClick={addProductItem}
                >
                  <RiAddLine className='mr-2 size-4' />
                  Add Product
                </Button.Root>
              </div>

              <div className='space-y-6'>
                {formData.items.map((item, index) => (
                  <ProductItemForm
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdate={(updatedItem) =>
                      updateProductItem(index, updatedItem)
                    }
                    onRemove={() => removeProductItem(index)}
                    brands={brands}
                    machineTypes={machineTypes}
                    unitOfMeasures={unitOfMeasures}
                    canRemove={formData.items.length > 1}
                    validationErrors={validationErrors}
                  />
                ))}
              </div>

              {/* Total Calculation */}
              <div className='mt-6 rounded-lg border border-stroke-soft-200 p-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-paragraph-sm text-text-sub-600'>
                      Subtotal (RMB):
                    </span>
                    <span className='text-paragraph-sm text-text-strong-950'>
                      ¥{calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-paragraph-sm text-text-sub-600'>
                      Exchange Rate:
                    </span>
                    <span className='text-paragraph-sm text-text-strong-950'>
                      {formData.exchangeRateRMB || '0'} IDR per RMB
                    </span>
                  </div>
                  <Divider.Root />
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
