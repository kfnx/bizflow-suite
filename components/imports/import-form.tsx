'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiBuildingLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiExchangeCnyLine,
  RiReceiptLine,
  RiStoreLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { PRODUCT_CATEGORY } from '@/lib/db/enum';
import {
  formatNumberWithDots,
  parseNumberFromDots,
} from '@/utils/number-formatter';
import { useBrands, type Brand as BrandType } from '@/hooks/use-brands';
import { useCreateImport, useUpdateImport } from '@/hooks/use-imports';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useWarehouses } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';

interface ProductItem {
  id?: string;
  productId?: string;
  name: string;
  description?: string;
  category: 'serialized' | 'non_serialized' | 'bulk';
  priceRMB: string;
  quantity: string;
  notes?: string;
  brandId?: string;
  condition: 'new' | 'used' | 'refurbished';
  machineTypeId?: string;
  unitOfMeasureId?: string;
  partNumber?: string;
  modelNumber?: string;
  engineNumber?: string;
  serialNumber?: string;
  additionalSpecs?: string;
  batchOrLotNumber?: string;
}

interface ImportFormData {
  supplierId: string;
  warehouseId: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  billOfLadingNumber?: string;
  billOfLadingDate?: string;
  exchangeRateRMBtoIDR: string;
  notes: string;
  items: ProductItem[];
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
  brands: BrandType[];
  machineTypes: MachineType[];
  unitOfMeasures: UnitOfMeasure[];
  canRemove: boolean;
  validationErrors: Record<string, string>;
  exchangeRateRMBtoIDR: string;
  brandsLoading?: boolean;
  onValidateSerialNumber?: (serial: string) => void;
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
  exchangeRateRMBtoIDR,
  brandsLoading = false,
  onValidateSerialNumber,
}: ProductItemFormProps) {
  const handleFieldChange = (field: keyof ProductItem, value: any) => {
    // Handle category changes - reset quantity to 1 only when changing category
    if (field === 'category') {
      // When changing to serialized, reset quantity to 1 and set unitOfMeasureId to 'Unit'
      // But allow manual quantity changes afterward
      const updatedItem = { ...item, [field]: value };
      if (value === 'serialized') {
        updatedItem.quantity = '1';
        // Find the 'Unit' unit of measure and set it
        const unitUoM = unitOfMeasures.find((uom) => uom.name === 'Unit');
        if (unitUoM) {
          updatedItem.unitOfMeasureId = unitUoM.id;
        }
      }
      onUpdate(updatedItem);
    } else {
      // For all other fields including quantity, allow normal updates
      onUpdate({ ...item, [field]: value });
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors[`items.${index}.${field}`];
  };

  return (
    <div className='rounded-lg border border-stroke-soft-200 p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h4 className='text-base text-gray-900 font-medium'>
          Item #{index + 1}
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
      <div className='mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <Label.Root htmlFor={`category-${index}`}>
            Type <Label.Asterisk />
          </Label.Root>
          <Select.Root
            value={item.category}
            onValueChange={(value) => handleFieldChange('category', value)}
          >
            <Select.Trigger id={`category-${index}`}>
              <Select.Value placeholder='Select type' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='serialized'>Serialized</Select.Item>
              <Select.Item value='non_serialized'>Non-Serialized</Select.Item>
              <Select.Item value='bulk'>Bulk</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        <div className='flex flex-col gap-2'>
          <Label.Root htmlFor={`brandInput-${index}`}>
            Brand <Label.Asterisk />
          </Label.Root>
          <Select.Root
            value={item.brandId || ''}
            onValueChange={(value) => handleFieldChange('brandId', value)}
            disabled={brandsLoading}
          >
            <Select.Trigger id={`brandInput-${index}`}>
              <Select.Value
                placeholder={
                  brandsLoading ? 'Loading brands...' : 'Select brand'
                }
              />
            </Select.Trigger>
            <Select.Content>
              {brands.map((brand) => (
                <Select.Item key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          {getFieldError('brandId') && (
            <div className='text-xs text-red-600'>
              {getFieldError('brandId')}
            </div>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <Label.Root htmlFor={`name-${index}`}>
            Name <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`name-${index}`}
                value={item.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder='Enter item name'
              />
            </Input.Wrapper>
          </Input.Root>
          {getFieldError('name') && (
            <div className='text-xs text-red-600'>{getFieldError('name')}</div>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <Label.Root htmlFor={`description-${index}`}>Description</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`description-${index}`}
                value={item.description || ''}
                onChange={(e) =>
                  handleFieldChange('description', e.target.value)
                }
                placeholder='Enter description (optional)'
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <div className='flex flex-col gap-2'>
          <Label.Root htmlFor={`condition-${index}`}>
            Condition <Label.Asterisk />
          </Label.Root>
          <Select.Root
            value={item.condition}
            onValueChange={(value) => handleFieldChange('condition', value)}
          >
            <Select.Trigger id={`condition-${index}`}>
              <Select.Value placeholder='Select condition' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='new'>New</Select.Item>
              <Select.Item value='used'>Used</Select.Item>
              <Select.Item value='refurbished'>Refurbished</Select.Item>
            </Select.Content>
          </Select.Root>
          {getFieldError('condition') && (
            <div className='text-xs text-red-600'>
              {getFieldError('condition')}
            </div>
          )}
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
              <Select.Trigger id={`machineType-${index}`}>
                <Select.Value placeholder='Select type' />
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
              Serial Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`serialNumber-${index}`}
                  value={item.serialNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('serialNumber', e.target.value)
                  }
                  onBlur={(e) => onValidateSerialNumber?.(e.target.value)}
                  placeholder='e.g. SD32'
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('serialNumber') && (
              <div className='text-xs text-red-600'>
                {getFieldError('serialNumber')}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`modelNumber-${index}`}>
              Model Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`modelNumber-${index}`}
                  value={item.modelNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('modelNumber', e.target.value)
                  }
                  placeholder='e.g. SD32'
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('modelNumber') && (
              <div className='text-xs text-red-600'>
                {getFieldError('modelNumber')}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`engineNumber-${index}`}>
              Engine Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`engineNumber-${index}`}
                  value={item.engineNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('engineNumber', e.target.value)
                  }
                  placeholder='Engine Number'
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('engineNumber') && (
              <div className='text-xs text-red-600'>
                {getFieldError('engineNumber')}
              </div>
            )}
          </div>
          <div className='col-span-full flex flex-col gap-2'>
            <Label.Root htmlFor={`additionalSpecs-${index}`}>
              Additional Specifications
            </Label.Root>
            <TextArea.Root
              id={`additionalSpecs-${index}`}
              value={item.additionalSpecs || ''}
              onChange={(e) =>
                handleFieldChange('additionalSpecs', e.target.value)
              }
              rows={3}
              placeholder={`example:
engine model WD10G220E23 220 hp
operating weight 18,500 kg
year 2023`}
              simple
            />
          </div>
        </div>
      )}
      {item.category === 'non_serialized' && (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`batchLotNumber-${index}`}>
              Batch/Lot Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`batchLotNumber-${index}`}
                  value={item.batchOrLotNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('batchOrLotNumber', e.target.value)
                  }
                  placeholder='Batch or Lot Number'
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('batchOrLotNumber') && (
              <div className='text-xs text-red-600'>
                {getFieldError('batchOrLotNumber')}
              </div>
            )}
          </div>
        </div>
      )}
      {item.category === 'bulk' && (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`modelPartNumber-${index}`}>
              Part Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`modelPartNumber-${index}`}
                  value={item.partNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('partNumber', e.target.value)
                  }
                  placeholder='Part Number'
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('partNumber') && (
              <div className='text-xs text-red-600'>
                {getFieldError('partNumber')}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`batchLotNumberBulk-${index}`}>
              Batch/Lot Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`batchLotNumberBulk-${index}`}
                  value={item.batchOrLotNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('batchOrLotNumber', e.target.value)
                  }
                  placeholder='Batch or Lot Number'
                />
              </Input.Wrapper>
            </Input.Root>
            {getFieldError('batchOrLotNumber') && (
              <div className='text-xs text-red-600'>
                {getFieldError('batchOrLotNumber')}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Common fields for all categories: QTY, Unit Price (RMB), Total (RMB), Unit (IDR), Total (IDR) */}
      <div className='mt-4 grid grid-cols-12 gap-6'>
        <div className='col-span-2 flex flex-col gap-2'>
          <Label.Root htmlFor={`quantity-${index}`}>
            QTY <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`quantity-${index}`}
                type='number'
                min='1'
                value={item.quantity}
                onChange={(e) => handleFieldChange('quantity', e.target.value)}
                placeholder='1'
                disabled={item.category === PRODUCT_CATEGORY.SERIALIZED}
              />
            </Input.Wrapper>
          </Input.Root>
          {getFieldError('quantity') && (
            <div className='text-xs text-red-600'>
              {getFieldError('quantity')}
            </div>
          )}
        </div>
        <div className='col-span-5 flex flex-col gap-2'>
          <Label.Root htmlFor={`priceRMB-${index}`}>
            Price (RMB) <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`priceRMB-${index}`}
                type='text'
                value={formatNumberWithDots(item.priceRMB)}
                onChange={(e) => {
                  const rawValue = parseNumberFromDots(e.target.value);
                  handleFieldChange('priceRMB', rawValue);
                }}
                placeholder='0.00'
              />
            </Input.Wrapper>
          </Input.Root>
          {getFieldError('priceRMB') && (
            <div className='text-xs text-red-600'>
              {getFieldError('priceRMB')}
            </div>
          )}
        </div>
        <div className='col-span-5 flex flex-col gap-2'>
          <Label.Root htmlFor={`totalRMB-${index}`}>Total (RMB)</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`totalRMB-${index}`}
                type='text'
                value={formatNumberWithDots(
                  (
                    (parseFloat(item.quantity) || 0) *
                    (parseFloat(item.priceRMB) || 0)
                  ).toFixed(2),
                )}
                readOnly
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <div className='col-span-2 flex flex-col gap-2'>
          <Label.Root htmlFor={`unit-${index}`}>
            Unit
            <Label.Asterisk />
          </Label.Root>
          <Select.Root
            value={item.unitOfMeasureId || ''}
            onValueChange={(value) =>
              handleFieldChange('unitOfMeasureId', value)
            }
            disabled={item.category === PRODUCT_CATEGORY.SERIALIZED}
          >
            <Select.Trigger id={`unit-${index}`}>
              <Select.Value placeholder='Select' />
            </Select.Trigger>
            <Select.Content>
              {unitOfMeasures.map((unit) => (
                <Select.Item key={unit.id} value={unit.id}>
                  {unit.name}
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
        <div className='col-span-5 flex flex-col gap-2'>
          <Label.Root htmlFor={`priceIDR-${index}`}>Price (IDR)</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`priceIDR-${index}`}
                type='text'
                value={formatNumberWithDots(
                  (
                    (parseFloat(item.priceRMB) || 0) *
                    (parseFloat(exchangeRateRMBtoIDR) || 0)
                  ).toFixed(0),
                )}
                readOnly
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <div className='col-span-5 flex flex-col gap-2'>
          <Label.Root htmlFor={`totalIDR-${index}`}>Total (IDR)</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`totalIDR-${index}`}
                type='text'
                value={formatNumberWithDots(
                  (
                    (parseFloat(item.quantity) || 0) *
                    (parseFloat(item.priceRMB) || 0) *
                    (parseFloat(exchangeRateRMBtoIDR) || 0)
                  ).toFixed(0),
                )}
                readOnly
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
    </div>
  );
}

interface ImportFormProps {
  mode: 'create' | 'edit';
  initialData?: ImportFormData;
  importId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ImportForm({
  mode,
  initialData,
  importId,
  onSuccess,
  onCancel,
}: ImportFormProps) {
  const router = useRouter();
  const createImportMutation = useCreateImport();
  const updateImportMutation = useUpdateImport();
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);

  // Create empty product item
  function createEmptyProductItem(): ProductItem {
    // Find the 'Unit' unit of measure if available
    const unitUoM = unitOfMeasures.find((uom) => uom.name === 'Unit');

    return {
      category: 'serialized',
      name: '',
      description: '',
      priceRMB: '',
      quantity: '1',
      condition: 'new',
      modelNumber: '',
      engineNumber: '',
      brandId: '',
      unitOfMeasureId: unitUoM ? unitUoM.id : '',
      batchOrLotNumber: '',
      partNumber: '',
      additionalSpecs: '',
    };
  }

  const [formData, setFormData] = useState<ImportFormData>(
    initialData || {
      supplierId: '',
      warehouseId: '',
      importDate: new Date().toISOString().split('T')[0],
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      billOfLadingNumber: '',
      billOfLadingDate: new Date().toISOString().split('T')[0],
      exchangeRateRMBtoIDR: '2250',
      notes: '',
      items: [createEmptyProductItem()],
    },
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Debounced validators cache
  const [serialValidationTimer, setSerialValidationTimer] =
    useState<NodeJS.Timeout | null>(null);

  const validateSerialNumber = async (
    index: number,
    serialRaw: string,
  ): Promise<void> => {
    const serial = serialRaw.trim();
    const fieldKey = `items.${index}.serialNumber`;

    // Clear when empty
    if (!serial) {
      setValidationErrors((prev) => ({ ...prev, [fieldKey]: '' }));
      return;
    }

    // Check duplicate within form
    const duplicatesInForm = formData.items.some(
      (it, i) => i !== index && it.serialNumber?.trim() === serial,
    );
    if (duplicatesInForm) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldKey]: 'Duplicate with another item in this form',
      }));
      return;
    }

    // Debounce network check
    if (serialValidationTimer) clearTimeout(serialValidationTimer);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?limit=5&search=${encodeURIComponent(serial)}`,
        );
        if (!res.ok) return; // silent fail
        const data = await res.json();
        const exists = (data?.data || []).some(
          (p: any) => p.serialNumber && p.serialNumber === serial,
        );
        setValidationErrors((prev) => ({
          ...prev,
          [fieldKey]: exists ? 'Serial number already exists' : '',
        }));
      } catch (err) {
        // ignore; server-side will still validate
      }
    }, 300);
    setSerialValidationTimer(timer);
  };

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [machineTypesRes, unitOfMeasuresRes] = await Promise.all([
          fetch('/api/machine-types'),
          fetch('/api/unit-of-measures'),
        ]);

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
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.supplierId) {
      errors.supplierId = 'Supplier is required';
    }
    if (!formData.warehouseId) {
      errors.warehouseId = 'Warehouse is required';
    }
    if (!formData.importDate) {
      errors.importDate = 'Import date is required';
    }

    if (!formData.invoiceNumber.trim()) {
      errors.invoiceNumber = 'Invoice number is required';
    }
    if (!formData.invoiceDate) {
      errors.invoiceDate = 'Invoice date is required';
    }
    if (!formData.exchangeRateRMBtoIDR.trim()) {
      errors.exchangeRateRMBtoIDR = 'Exchange rate is required';
    }

    // Validate items
    if (formData.items.length === 0) {
      errors.items = 'At least one product is required';
    }

    formData.items.forEach((item, index) => {
      // Common mandatory fields for all product types (except description)
      if (!item.name.trim()) {
        errors[`items.${index}.name`] = 'Name is required';
      }
      if (!item.brandId?.trim()) {
        errors[`items.${index}.brandId`] = 'Brand is required';
      }
      if (!item.condition) {
        errors[`items.${index}.condition`] = 'Condition is required';
      }
      if (!item.priceRMB.trim()) {
        errors[`items.${index}.priceRMB`] = 'Price is required';
      } else {
        const price = parseFloat(item.priceRMB);
        if (isNaN(price) || price <= 0) {
          errors[`items.${index}.priceRMB`] =
            'Price must be a valid number greater than 0';
        }
      }
      if (!item.quantity.trim()) {
        errors[`items.${index}.quantity`] = 'Quantity is required';
      } else {
        const quantity = parseInt(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          errors[`items.${index}.quantity`] =
            'Quantity must be a valid number greater than 0';
        }
      }

      // Category-specific validation
      if (item.category === 'serialized') {
        if (!item.machineTypeId) {
          errors[`items.${index}.machineTypeId`] =
            'Machine type is required for serialized products';
        }
        if (!item.serialNumber?.trim()) {
          errors[`items.${index}.serialNumber`] =
            'Serial number is required for serialized products';
        }
        if (!item.engineNumber?.trim()) {
          errors[`items.${index}.engineNumber`] =
            'Engine number is required for serialized products';
        }
      }

      if (
        (item.category === 'non_serialized' || item.category === 'bulk') &&
        !item.unitOfMeasureId
      ) {
        errors[`items.${index}.unitOfMeasureId`] =
          'Unit of measure is required';
      }

      // Batch/Lot Number validation for non-serialized and bulk
      if (item.category === 'non_serialized' || item.category === 'bulk') {
        if (!item.batchOrLotNumber?.trim()) {
          errors[`items.${index}.batchOrLotNumber`] =
            'Batch/Lot number is required';
        }
      }

      if (item.category === 'bulk') {
        if (!item.partNumber?.trim()) {
          errors[`items.${index}.partNumber`] =
            'Part number is required for bulk products';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      // Show a single summary toast instead of multiple toasts
      const errorCount = Object.keys(errors).length;
      toast.error(
        `Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''}`,
        {
          description: 'Check the highlighted fields below',
        },
      );
      setValidationErrors(errors);
      return;
    }

    // Transform items for API - convert empty strings to undefined for optional fields
    const transformedItems = formData.items.map((item) => ({
      id: item.id || undefined,
      productId: item.productId || undefined,
      name: item.name,
      description: item.description?.trim() || undefined,
      category: item.category,
      priceRMB: item.priceRMB,
      quantity: parseInt(item.quantity),
      notes: item.notes?.trim() || undefined,
      brandId: item.brandId?.trim() || undefined,
      condition: item.condition,
      machineTypeId: item.machineTypeId?.trim() || undefined,
      unitOfMeasureId: item.unitOfMeasureId?.trim() || undefined,
      partNumber: item.partNumber?.trim() || undefined,
      engineNumber: item.engineNumber?.trim() || undefined,
      serialNumber: item.serialNumber?.trim() || undefined,
      additionalSpecs: item.additionalSpecs?.trim() || undefined,
      batchOrLotNumber: item.batchOrLotNumber?.trim() || undefined,
      modelNumber: item.modelNumber?.trim() || undefined,
    }));

    const submitData = {
      ...formData,
      items: transformedItems,
    };

    try {
      if (mode === 'create') {
        await createImportMutation.mutateAsync(submitData);
      } else {
        await updateImportMutation.mutateAsync({
          id: importId!,
          data: submitData,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/imports');
      }
    } catch (error) {
      console.error(
        `Error ${mode === 'create' ? 'creating' : 'updating'} import:`,
        error,
      );
      toast.error(
        `Failed to ${mode === 'create' ? 'create' : 'update'} import`,
        {
          description:
            error instanceof Error ? error.message : 'Please try again.',
        },
      );
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
    const exchangeRate = parseFloat(formData.exchangeRateRMBtoIDR) || 0;
    return subtotal * exchangeRate;
  };

  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses();

  // Get all brands for filtering
  const { data: allBrands, isLoading: brandsLoading } = useBrands();

  // Helper function to get filtered brands based on product category
  const getFilteredBrands = (
    category: 'serialized' | 'non_serialized' | 'bulk',
  ) => {
    if (!allBrands?.data) return [];

    if (category === 'serialized') {
      return allBrands.data.filter((brand) => brand.type === 'machine');
    } else {
      // For non_serialized and bulk, use sparepart brands
      return allBrands.data.filter((brand) => brand.type === 'sparepart');
    }
  };

  const isPending =
    createImportMutation.isPending || updateImportMutation.isPending;

  return (
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
                  disabled={!suppliers}
                >
                  <Select.Trigger>
                    <Select.TriggerIcon as={RiBuildingLine} />
                    <Select.Value
                      placeholder={
                        suppliersLoading
                          ? 'Loading suppliers...'
                          : 'Select supplier'
                      }
                    />
                  </Select.Trigger>
                  {suppliers?.data.length && (
                    <Select.Content>
                      {suppliers.data.map((supplier) => (
                        <Select.Item
                          key={supplier.id}
                          value={supplier.id}
                          disabled={!supplier.isActive}
                        >
                          {supplier.name} ({supplier.code}){' '}
                          {!supplier.isActive && '(Inactive)'}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  )}
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
                  disabled={!warehouses}
                >
                  <Select.Trigger>
                    <Select.TriggerIcon as={RiStoreLine} />
                    <Select.Value
                      placeholder={
                        warehousesLoading
                          ? 'Loading warehouses...'
                          : 'Select warehouse'
                      }
                    />
                  </Select.Trigger>
                  {warehouses?.data.length && (
                    <Select.Content>
                      {warehouses.data.map((warehouse) => (
                        <Select.Item
                          key={warehouse.id}
                          value={warehouse.id}
                          disabled={!warehouse.isActive}
                        >
                          {warehouse.name} {!warehouse.isActive && '(Inactive)'}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  )}
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

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='billOfLadingNumber'>
                  Bill of Lading Number
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiReceiptLine} />
                    <Input.Input
                      id='billOfLadingNumber'
                      value={formData.billOfLadingNumber}
                      onChange={(e) =>
                        handleInputChange('billOfLadingNumber', e.target.value)
                      }
                      placeholder='Enter bill of lading number (optional)'
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='billOfLadingDate'>
                  Bill of Lading Date
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiCalendarLine} />
                    <Input.Input
                      id='billOfLadingDate'
                      type='date'
                      value={formData.billOfLadingDate}
                      onChange={(e) =>
                        handleInputChange('billOfLadingDate', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='exchangeRateRMBtoIDR'>
                  Exchange Rate (RMB to IDR) <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiExchangeCnyLine} />
                    <Input.Input
                      id='exchangeRateRMBtoIDR'
                      type='text'
                      value={formatNumberWithDots(
                        formData.exchangeRateRMBtoIDR,
                      )}
                      onChange={(e) => {
                        const rawValue = parseNumberFromDots(e.target.value);
                        handleInputChange('exchangeRateRMBtoIDR', rawValue);
                      }}
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

          {/* Products */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
              Items
            </h3>

            <div className='space-y-6'>
              {formData.items.map((item, index) => (
                <ProductItemForm
                  key={index}
                  item={item}
                  index={index}
                  onUpdate={(updatedItem) =>
                    updateProductItem(index, updatedItem)
                  }
                  onRemove={() => removeProductItem(index)}
                  brands={getFilteredBrands(item.category)}
                  machineTypes={machineTypes}
                  unitOfMeasures={unitOfMeasures}
                  canRemove={formData.items.length > 1}
                  validationErrors={validationErrors}
                  exchangeRateRMBtoIDR={formData.exchangeRateRMBtoIDR}
                  brandsLoading={brandsLoading}
                  onValidateSerialNumber={(serial) =>
                    validateSerialNumber(index, serial)
                  }
                />
              ))}
            </div>

            <div className='mt-4 flex justify-end'>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                onClick={addProductItem}
                type='button'
              >
                <RiAddLine className='size-4' />
                Add Item
              </Button.Root>
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
                    {formData.exchangeRateRMBtoIDR || '0'} IDR per RMB
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
            onClick={onCancel || (() => router.push('/imports'))}
            disabled={isPending}
          >
            Cancel
          </Button.Root>
          <Button.Root type='submit' variant='primary' disabled={isPending}>
            {isPending
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Import'
                : 'Update Import'}
          </Button.Root>
        </div>
      </form>
    </div>
  );
}
