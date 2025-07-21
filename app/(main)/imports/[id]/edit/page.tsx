'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiBuildingLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiEditLine,
  RiExchangeCnyLine,
  RiImportLine,
  RiReceiptLine,
  RiStoreLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { IMPORT_STATUS, PRODUCT_CATEGORY } from '@/lib/db/enum';
import {
  formatNumberWithDots,
  parseNumberFromDots,
} from '@/utils/number-formatter';
import { useImport, useUpdateImport } from '@/hooks/use-imports';
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
  batchOrLotNumber?: string;
  modelNumber?: string;
}

interface EditImportData {
  supplierId: string;
  warehouseId: string;
  importDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  exchangeRateRMBtoIDR: string;
  notes: string;
  items: ProductItem[];
}

interface EditImportPageProps {
  params: {
    id: string;
  };
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
  exchangeRateRMBtoIDR: string;
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
}: ProductItemFormProps) {
  const handleFieldChange = (field: keyof ProductItem, value: any) => {
    // Handle category changes - reset quantity to 1 only when changing category
    if (field === 'category') {
      // When changing to serialized, reset quantity to 1
      // But allow manual quantity changes afterward
      const updatedItem = { ...item, [field]: value };
      if (value === 'serialized') {
        updatedItem.quantity = '1';
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
          <Label.Root htmlFor={`brandInput-${index}`}>Brand</Label.Root>
          <Select.Root
            value={item.brandId || ''}
            onValueChange={(value) => handleFieldChange('brandId', value)}
          >
            <Select.Trigger id={`brandInput-${index}`}>
              <Select.Value placeholder='Select brand' />
            </Select.Trigger>
            <Select.Content>
              {brands.map((brand) => (
                <Select.Item key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
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
                placeholder='Enter description'
              />
            </Input.Wrapper>
          </Input.Root>
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
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`modelNumber-${index}`}>
              Model Number
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
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`machineNumber-${index}`}>
              Machine Number <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`machineNumber-${index}`}
                  value={item.machineNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('machineNumber', e.target.value)
                  }
                  placeholder='Serial/Machine Number'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`engineNumber-${index}`}>
              Engine Number
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
          </div>
        </div>
      )}
      {item.category === 'non_serialized' && (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`unit-${index}`}>Unit</Label.Root>
            <Select.Root
              value={item.unitOfMeasureId || ''}
              onValueChange={(value) =>
                handleFieldChange('unitOfMeasureId', value)
              }
            >
              <Select.Trigger id={`unit-${index}`}>
                <Select.Value placeholder='Select unit' />
              </Select.Trigger>
              <Select.Content>
                {unitOfMeasures.map((unit) => (
                  <Select.Item key={unit.id} value={unit.id}>
                    {unit.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`batchLotNumber-${index}`}>
              Batch/Lot Number
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
          </div>
        </div>
      )}
      {item.category === 'bulk' && (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`unitBulk-${index}`}>Unit</Label.Root>
            <Select.Root
              value={item.unitOfMeasureId || ''}
              onValueChange={(value) =>
                handleFieldChange('unitOfMeasureId', value)
              }
            >
              <Select.Trigger id={`unitBulk-${index}`}>
                <Select.Value placeholder='Select unit' />
              </Select.Trigger>
              <Select.Content>
                {unitOfMeasures.map((unit) => (
                  <Select.Item key={unit.id} value={unit.id}>
                    {unit.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`modelPartNumber-${index}`}>
              Model/Part Number
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id={`modelPartNumber-${index}`}
                  value={item.modelOrPartNumber || ''}
                  onChange={(e) =>
                    handleFieldChange('modelOrPartNumber', e.target.value)
                  }
                  placeholder='Part Number'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor={`batchLotNumberBulk-${index}`}>
              Batch/Lot Number
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
          </div>
        </div>
      )}
      {/* Common fields for all categories: QTY, Unit Price (RMB), Total (RMB), Unit (IDR), Total (IDR) */}
      <div className='mt-4 grid grid-cols-1 gap-6 sm:grid-cols-5'>
        <div className='flex flex-col gap-2'>
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
        <div className='flex flex-col gap-2'>
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
        <div className='flex flex-col gap-2'>
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
        <div className='flex flex-col gap-2'>
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
        <div className='flex flex-col gap-2'>
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

export default function EditImportPage({ params }: EditImportPageProps) {
  const router = useRouter();
  const {
    data: importData,
    isLoading: isLoadingImport,
    error: importError,
  } = useImport(params.id);
  const updateImportMutation = useUpdateImport();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);
  const [isLoadingReference, setLoadingReference] = useState(false);

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

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    // Handle various date formats and convert to YYYY-MM-DD
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Create empty product item
  function createEmptyProductItem(): ProductItem {
    return {
      category: 'serialized',
      name: '',
      description: '',
      priceRMB: '',
      quantity: '1',
      condition: 'new',
      modelNumber: '',
      machineNumber: '',
      engineNumber: '',
      brandId: '',
      machineTypeId: '', // Add this for serialized products
      unitOfMeasureId: '',
      batchOrLotNumber: '',
      modelOrPartNumber: '',
    };
  }

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setLoadingReference(true);
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
      } finally {
        setLoadingReference(false);
      }
    };

    loadReferenceData();
  }, []);

  // Load import data
  useEffect(() => {
    if (importData && !isLoadingImport) {
      setFormData({
        supplierId: importData.supplierId,
        warehouseId: importData.warehouseId,
        importDate: formatDateForInput(importData.importDate),
        invoiceNumber: importData.invoiceNumber,
        invoiceDate: formatDateForInput(importData.invoiceDate),
        exchangeRateRMBtoIDR: importData.exchangeRateRMBtoIDR.toString(),
        notes: importData.notes || '',
        items:
          importData.items?.map((item) => ({
            id: item.id,
            productId: item.productId || undefined,
            name: item.name || '',
            description: item.description || '',
            category: item.category,
            priceRMB: item.priceRMB || '',
            quantity: item.quantity?.toString() || '1',
            notes: item.notes || '',
            brandId: item.brandId || '',
            condition: item.condition,
            year: item.year?.toString() || '',
            machineTypeId: item.machineTypeId || '',
            unitOfMeasureId: item.unitOfMeasureId || '',
            modelOrPartNumber: item.modelOrPartNumber || '',
            machineNumber: item.machineNumber || '',
            engineNumber: item.engineNumber || '',
            serialNumber: item.serialNumber || '',
            model: item.model || '',
            engineModel: item.engineModel || '',
            enginePower: item.enginePower || '',
            operatingWeight: item.operatingWeight || '',
            batchOrLotNumber: item.batchOrLotNumber || '',
            modelNumber: item.modelNumber || '',
          })) || [],
      });
    }
  }, [importData, isLoadingImport]);

  const handleInputChange = (field: keyof EditImportData, value: string) => {
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
      if (!item.name.trim()) {
        errors[`items.${index}.name`] = 'Name is required';
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
        if (!item.machineNumber?.trim()) {
          errors[`items.${index}.machineNumber`] =
            'Machine number is required for serialized products';
        }
        // Note: modelNumber, engineNumber, and brandId are optional for serialized products
      }

      if (
        (item.category === 'non_serialized' || item.category === 'bulk') &&
        !item.unitOfMeasureId
      ) {
        errors[`items.${index}.unitOfMeasureId`] =
          'Unit of measure is required';
      }
      if (item.category === 'bulk') {
        if (!item.modelOrPartNumber?.trim()) {
          errors[`items.${index}.modelOrPartNumber`] =
            'Model/Part number is required for bulk products';
        }
        // Note: batchOrLotNumber, description, and brandId are optional for bulk products
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
      year: item.year && item.year.trim() ? parseInt(item.year) : undefined,
      machineTypeId: item.machineTypeId?.trim() || undefined,
      unitOfMeasureId: item.unitOfMeasureId?.trim() || undefined,
      modelOrPartNumber: item.modelOrPartNumber?.trim() || undefined,
      machineNumber: item.machineNumber?.trim() || undefined,
      engineNumber: item.engineNumber?.trim() || undefined,
      serialNumber: item.serialNumber?.trim() || undefined,
      model: item.model?.trim() || undefined,
      engineModel: item.engineModel?.trim() || undefined,
      enginePower: item.enginePower?.trim() || undefined,
      operatingWeight: item.operatingWeight?.trim() || undefined,
      batchOrLotNumber: item.batchOrLotNumber?.trim() || undefined,
      modelNumber: item.modelNumber?.trim() || undefined,
    }));

    const updateData = {
      ...formData,
      items: transformedItems,
    };

    try {
      await updateImportMutation.mutateAsync({
        id: params.id,
        data: updateData,
      });
      router.push('/imports');
    } catch (error) {
      console.error('Error updating import:', error);
      toast.error('Failed to update import', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      });
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

  if (isLoadingImport) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-text-sub-600'>
        Loading import data...
      </div>
    );
  }

  if (importError) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-red-600'>
        Error loading import data
      </div>
    );
  }

  if (!importData) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-text-sub-600'>
        Import not found
      </div>
    );
  }

  // Check if import can be edited (only pending imports)
  if (importData.status !== IMPORT_STATUS.PENDING) {
    const statusMessage =
      importData.status === IMPORT_STATUS.VERIFIED
        ? 'This import cannot be edited because it has already been verified.'
        : 'This import cannot be edited due to its current status.';

    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='text-center'>
          <p className='text-text-sub-600'>{statusMessage}</p>
          <Button.Root className='mt-4' onClick={() => router.push('/imports')}>
            Back to Imports
          </Button.Root>
        </div>
      </div>
    );
  }

  if (isLoadingReference) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-text-sub-600'>
        Loading form reference data...
      </div>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Edit Import'
        description='Update import record and items.'
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
              </div>
            </div>

            <Divider.Root />

            {/* Products */}
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg text-gray-900 font-medium'>Items</h3>
                <Button.Root
                  type='button'
                  variant='neutral'
                  mode='stroke'
                  size='small'
                  onClick={addProductItem}
                >
                  <RiAddLine className='mr-2 size-4' />
                  Add item
                </Button.Root>
              </div>

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
                    brands={brands}
                    machineTypes={machineTypes}
                    unitOfMeasures={unitOfMeasures}
                    canRemove={formData.items.length > 1}
                    validationErrors={validationErrors}
                    exchangeRateRMBtoIDR={formData.exchangeRateRMBtoIDR}
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
              onClick={() => router.push('/imports')}
              disabled={updateImportMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={updateImportMutation.isPending}
            >
              {updateImportMutation.isPending ? 'Updating...' : 'Update Import'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
