'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiEditLine,
  RiErrorWarningLine,
  RiHashtag,
  RiInformationLine,
  RiSearchLine,
  RiStoreLine,
} from '@remixicon/react';

import { PRODUCT_CATEGORY, PRODUCT_CONDITION } from '@/lib/db/enum';
import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import type { UpdateProductData } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { SimplePageLoading } from '@/components/simple-page-loading';

interface EditProductPageProps {
  params: {
    id: string;
  };
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

interface Supplier {
  id: string;
  name: string;
  code: string;
}

interface Warehouse {
  id: string;
  name: string;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProduct(params.id);
  const updateProductMutation = useUpdateProduct();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoadingReference, setLoadingReference] = useState(false);

  const [formData, setFormData] = useState<UpdateProductData>({
    name: '',
    description: '',
    category: PRODUCT_CATEGORY.SERIALIZED,
    condition: 'new',
    brandId: '',
    machineTypeId: '',
    unitOfMeasureId: '',
    modelOrPartNumber: '',
    machineNumber: '',
    engineNumber: '',
    batchOrLotNumber: '',
    supplierId: '',
    warehouseId: '',
    year: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setLoadingReference(true);
        const [
          brandsRes,
          machineTypesRes,
          unitOfMeasuresRes,
          suppliersRes,
          warehousesRes,
        ] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/machine-types'),
          fetch('/api/unit-of-measures'),
          fetch('/api/suppliers'),
          fetch('/api/warehouses'),
        ]);

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

        if (suppliersRes.ok) {
          const suppliersData = await suppliersRes.json();
          setSuppliers(suppliersData.data || []);
        }

        if (warehousesRes.ok) {
          const warehousesData = await warehousesRes.json();
          setWarehouses(warehousesData.data || []);
        }
      } catch (error) {
        console.error('Error loading reference data:', error);
      } finally {
        setLoadingReference(false);
      }
    };

    loadReferenceData();
  }, []);

  // Load product data
  useEffect(() => {
    if (product && !isLoadingProduct) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'serialized',
        condition: product.condition || 'new',
        brandId: product.brandId || '',
        machineTypeId: product.machineTypeId || '',
        unitOfMeasureId: product.unitOfMeasureId || '',
        modelOrPartNumber: product.modelOrPartNumber || '',
        machineNumber: product.machineNumber || '',
        engineNumber: product.engineNumber || '',
        batchOrLotNumber: product.batchOrLotNumber || '',
        supplierId: product.supplierId || '',
        warehouseId: product.warehouseId || '',
        year: product.year || undefined,
      });
    }
  }, [product, isLoadingProduct]);

  const handleInputChange = (field: keyof UpdateProductData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.condition) {
      errors.condition = 'Condition is required';
    }

    // Category-specific validation
    if (formData.category === 'serialized') {
      if (!formData.machineTypeId) {
        errors.machineTypeId =
          'Machine type is required for serialized products';
      }
      if (!formData.machineNumber?.trim()) {
        errors.machineNumber =
          'Machine number is required for serialized products';
      }
    }

    if (
      formData.category === 'non_serialized' ||
      formData.category === 'bulk'
    ) {
      if (!formData.unitOfMeasureId) {
        errors.unitOfMeasureId = 'Unit of measure is required';
      }
    }

    if (formData.category === 'bulk') {
      if (!formData.modelOrPartNumber?.trim()) {
        errors.modelOrPartNumber =
          'Model/Part number is required for bulk products';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    updateProductMutation.mutate(
      {
        id: params.id,
        data: formData,
      },
      {
        onSuccess: () => {
          router.push(`/products/${params.id}`);
        },
      },
    );
  };

  if (isLoadingProduct) {
    return <SimplePageLoading>Loading product data...</SimplePageLoading>;
  }

  if (productError) {
    const isNotFound =
      productError.message.includes('not found') ||
      productError.message.includes('404');
    const isPermissionError =
      productError.message.includes('Forbidden') ||
      productError.message.includes('Unauthorized');

    return (
      <div className='flex h-full w-full flex-col items-center justify-center p-8 text-center'>
        <div className='mb-6 flex size-16 items-center justify-center rounded-full bg-red-50'>
          <RiErrorWarningLine className='size-8 text-red-500' />
        </div>

        <h3 className='text-gray-900 text-xl mb-2 font-semibold'>
          {isNotFound ? 'Product Not Found' : 'Error Loading Product'}
        </h3>

        <p className='text-gray-500 text-sm mb-6 max-w-md'>
          {isNotFound
            ? `The product with ID "${params.id}" could not be found. It may have been deleted or you may have an incorrect link.`
            : isPermissionError
              ? 'You do not have permission to access this product. Please contact your administrator if you believe this is an error.'
              : productError.message ||
                'An unexpected error occurred while loading the product data.'}
        </p>

        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            onClick={() => router.push('/products')}
          >
            <RiArrowLeftLine className='mr-2 size-4' />
            Back to Products
          </Button.Root>

          {isNotFound && (
            <Button.Root
              variant='primary'
              onClick={() => router.push('/products')}
            >
              <RiSearchLine className='mr-2 size-4' />
              Browse Products
            </Button.Root>
          )}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center p-8 text-center'>
        <div className='bg-gray-50 mb-6 flex size-16 items-center justify-center rounded-full'>
          <RiInformationLine className='text-gray-400 size-8' />
        </div>

        <h3 className='text-gray-900 text-xl mb-2 font-semibold'>
          Product Not Found
        </h3>

        <p className='text-gray-500 text-sm mb-6 max-w-md'>
          The product you&apos;re looking for doesn&apos;t exist or may have
          been removed. Please check the URL or return to the products list.
        </p>

        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            onClick={() => router.push('/products')}
          >
            <RiArrowLeftLine className='mr-2 size-4' />
            Back to Products
          </Button.Root>

          <Button.Root
            variant='primary'
            onClick={() => router.push('/products/new')}
          >
            <RiEditLine className='mr-2 size-4' />
            Create New Product
          </Button.Root>
        </div>
      </div>
    );
  }

  if (isLoadingReference) {
    return (
      <SimplePageLoading>Loading form reference data...</SimplePageLoading>
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
        title='Edit Product'
        description='Update product information and specifications.'
      >
        <BackButton href={`/products/${params.id}`} label='Back to Product' />
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
                  <Label.Root htmlFor='name'>
                    Name <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiStoreLine} />
                      <Input.Input
                        id='name'
                        value={formData.name || ''}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder='Enter product name'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.name && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.name}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='category'>
                    Category <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.category || ''}
                    onValueChange={(value) =>
                      handleInputChange('category', value)
                    }
                  >
                    <Select.Trigger id='category'>
                      <Select.Value placeholder='Select category' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value={PRODUCT_CATEGORY.SERIALIZED}>
                        Serialized
                      </Select.Item>
                      <Select.Item value={PRODUCT_CATEGORY.NON_SERIALIZED}>
                        Non-Serialized
                      </Select.Item>
                      <Select.Item value={PRODUCT_CATEGORY.BULK}>
                        Bulk
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.category && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.category}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='condition'>
                    Condition <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.condition || ''}
                    onValueChange={(value) =>
                      handleInputChange('condition', value)
                    }
                  >
                    <Select.Trigger id='condition'>
                      <Select.Value placeholder='Select condition' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value={PRODUCT_CONDITION.NEW}>
                        New
                      </Select.Item>
                      <Select.Item value={PRODUCT_CONDITION.USED}>
                        Used
                      </Select.Item>
                      <Select.Item value={PRODUCT_CONDITION.REFURBISHED}>
                        Refurbished
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.condition && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.condition}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='brandId'>Brand</Label.Root>
                  <Select.Root
                    value={formData.brandId || ''}
                    onValueChange={(value) =>
                      handleInputChange('brandId', value)
                    }
                  >
                    <Select.Trigger id='brandId'>
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
                  <Label.Root htmlFor='year'>Year</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiHashtag} />
                      <Input.Input
                        id='year'
                        type='number'
                        min='1900'
                        max='2100'
                        value={formData.year || ''}
                        onChange={(e) =>
                          handleInputChange(
                            'year',
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        placeholder='Enter year'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>

              <div className='mt-6'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='description'>Description</Label.Root>
                  <TextArea.Root
                    id='description'
                    value={formData.description || ''}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    rows={3}
                    placeholder='Enter product description'
                    simple
                  />
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Category-specific fields */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Specifications
              </h3>

              {formData.category === PRODUCT_CATEGORY.SERIALIZED && (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='machineTypeId'>
                      Machine Type <Label.Asterisk />
                    </Label.Root>
                    <Select.Root
                      value={formData.machineTypeId || ''}
                      onValueChange={(value) =>
                        handleInputChange('machineTypeId', value)
                      }
                    >
                      <Select.Trigger id='machineTypeId'>
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
                    {validationErrors.machineTypeId && (
                      <div className='text-xs text-red-600'>
                        {validationErrors.machineTypeId}
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='modelOrPartNumber'>
                      Model/Part Number
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiHashtag} />
                        <Input.Input
                          id='modelOrPartNumber'
                          value={formData.modelOrPartNumber || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'modelOrPartNumber',
                              e.target.value,
                            )
                          }
                          placeholder='Enter model or part number'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='machineNumber'>
                      Machine Number <Label.Asterisk />
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiHashtag} />
                        <Input.Input
                          id='machineNumber'
                          value={formData.machineNumber || ''}
                          onChange={(e) =>
                            handleInputChange('machineNumber', e.target.value)
                          }
                          placeholder='Enter machine number'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                    {validationErrors.machineNumber && (
                      <div className='text-xs text-red-600'>
                        {validationErrors.machineNumber}
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='engineNumber'>
                      Engine Number
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiHashtag} />
                        <Input.Input
                          id='engineNumber'
                          value={formData.engineNumber || ''}
                          onChange={(e) =>
                            handleInputChange('engineNumber', e.target.value)
                          }
                          placeholder='Enter engine number'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                </div>
              )}

              {(formData.category === PRODUCT_CATEGORY.NON_SERIALIZED ||
                formData.category === PRODUCT_CATEGORY.BULK) && (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div className='flex flex-col gap-2'>
                    <Label.Root htmlFor='unitOfMeasureId'>
                      Unit of Measure <Label.Asterisk />
                    </Label.Root>
                    <Select.Root
                      value={formData.unitOfMeasureId || ''}
                      onValueChange={(value) =>
                        handleInputChange('unitOfMeasureId', value)
                      }
                    >
                      <Select.Trigger id='unitOfMeasureId'>
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
                    {validationErrors.unitOfMeasureId && (
                      <div className='text-xs text-red-600'>
                        {validationErrors.unitOfMeasureId}
                      </div>
                    )}
                  </div>

                  {formData.category === PRODUCT_CATEGORY.BULK && (
                    <>
                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor='modelOrPartNumberBulk'>
                          Model/Part Number <Label.Asterisk />
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiHashtag} />
                            <Input.Input
                              id='modelOrPartNumberBulk'
                              value={formData.modelOrPartNumber || ''}
                              onChange={(e) =>
                                handleInputChange(
                                  'modelOrPartNumber',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter model or part number'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                        {validationErrors.modelOrPartNumber && (
                          <div className='text-xs text-red-600'>
                            {validationErrors.modelOrPartNumber}
                          </div>
                        )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor='batchOrLotNumber'>
                          Batch/Lot Number
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiHashtag} />
                            <Input.Input
                              id='batchOrLotNumber'
                              value={formData.batchOrLotNumber || ''}
                              onChange={(e) =>
                                handleInputChange(
                                  'batchOrLotNumber',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter batch or lot number'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>
                    </>
                  )}

                  {formData.category === PRODUCT_CATEGORY.NON_SERIALIZED && (
                    <div className='flex flex-col gap-2'>
                      <Label.Root htmlFor='batchOrLotNumberNonSer'>
                        Batch/Lot Number
                      </Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Icon as={RiHashtag} />
                          <Input.Input
                            id='batchOrLotNumberNonSer'
                            value={formData.batchOrLotNumber || ''}
                            onChange={(e) =>
                              handleInputChange(
                                'batchOrLotNumber',
                                e.target.value,
                              )
                            }
                            placeholder='Enter batch or lot number'
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push(`/products/${params.id}`)}
              disabled={updateProductMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={updateProductMutation.isPending}
            >
              {updateProductMutation.isPending
                ? 'Updating...'
                : 'Update Product'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
