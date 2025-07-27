'use client';

import { useState } from 'react';
import {
  RiBox3Line,
  RiCloseLine,
  RiEditLine,
  RiInformationLine,
  RiSaveLine,
  RiSettings3Line,
} from '@remixicon/react';

import { PRODUCT_CATEGORY } from '@/lib/db/enum';
import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface ProductDetailProps {
  id: string;
}

export function ProductDetail({ id }: ProductDetailProps) {
  const { data: productData, isLoading, error } = useProduct(id);
  const updateProductMutation = useUpdateProduct();
  const [isEditingCondition, setIsEditingCondition] = useState(false);
  const [isEditingTechnical, setIsEditingTechnical] = useState(false);
  const [editedCondition, setEditedCondition] = useState('');
  const [editedAdditionalSpecs, setEditedAdditionalSpecs] = useState('');

  const handleEditCondition = () => {
    setEditedCondition(productData?.condition || '');
    setIsEditingCondition(true);
  };

  const handleEditTechnical = () => {
    setEditedAdditionalSpecs(productData?.additionalSpecs || '');
    setIsEditingTechnical(true);
  };

  const handleSaveCondition = async () => {
    if (!productData) return;

    try {
      await updateProductMutation.mutateAsync({
        id: productData.id,
        data: { condition: editedCondition },
      });
      setIsEditingCondition(false);
    } catch (error) {
      console.error('Failed to update condition:', error);
    }
  };

  const handleSaveTechnical = async () => {
    if (!productData) return;

    try {
      await updateProductMutation.mutateAsync({
        id: productData.id,
        data: { additionalSpecs: editedAdditionalSpecs },
      });
      setIsEditingTechnical(false);
    } catch (error) {
      console.error('Failed to update technical specs:', error);
    }
  };

  const handleCancelCondition = () => {
    setIsEditingCondition(false);
    setEditedCondition('');
  };

  const handleCancelTechnical = () => {
    setIsEditingTechnical(false);
    setEditedAdditionalSpecs('');
  };

  const formatCurrency = (amount: number, currency: string = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'green';
      case 'out_of_stock':
        return 'red';
      case 'discontinued':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'green';
      case 'used':
        return 'orange';
      case 'refurbished':
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-red-600'>Error loading product details</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Product not found</p>
      </div>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBox3Line className='size-6 text-text-sub-600' />
          </div>
        }
        title={productData.name}
        description={`Product details • ${productData.category || 'Uncategorized'}`}
      >
        <div className='flex items-center gap-3'>
          <Badge.Root
            variant='light'
            color={getStatusBadgeColor(productData.status as string)}
          >
            {productData.status?.replace('_', ' ').toUpperCase()}
          </Badge.Root>
          <Badge.Root
            variant='light'
            color={getConditionBadgeColor(productData.condition as string)}
          >
            {productData.condition?.toUpperCase()}
          </Badge.Root>
          <BackButton href='/products' label='Back to Products' />
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {/* Product Overview */}
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <h3 className='text-lg text-gray-900 mb-4 font-medium'>
            Product Information
          </h3>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Product Code
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.code || 'Not specified'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Category
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.category?.replace('_', ' ').toUpperCase() ||
                  'Uncategorized'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Price
              </div>
              <div className='mt-1 text-label-sm font-semibold text-text-strong-950'>
                {productData.price
                  ? formatCurrency(Number(productData.price))
                  : 'Not set'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Quantity
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.quantity?.toLocaleString() || '0'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Supplier
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.supplierName || 'Not specified'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Brand
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.brandName || 'Not specified'}
              </div>
            </div>
            <div>
              <div className='flex items-center'>
                <div className='text-subheading-xs uppercase text-text-soft-400'>
                  Condition
                </div>
                {!isEditingCondition && (
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='xsmall'
                    onClick={handleEditCondition}
                    disabled={updateProductMutation.isPending}
                  >
                    <RiEditLine className='size-3' />
                    Edit
                  </Button.Root>
                )}
              </div>
              {isEditingCondition ? (
                <div className='mt-1 flex items-center gap-2'>
                  <Select.Root
                    value={editedCondition}
                    onValueChange={setEditedCondition}
                  >
                    <Select.Trigger className='flex-1'>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='new'>New</Select.Item>
                      <Select.Item value='used'>Used</Select.Item>
                      <Select.Item value='refurbished'>Refurbished</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Button.Root
                    variant='primary'
                    size='xsmall'
                    onClick={handleSaveCondition}
                    disabled={updateProductMutation.isPending}
                  >
                    <RiSaveLine className='size-3' />
                  </Button.Root>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='xsmall'
                    onClick={handleCancelCondition}
                    disabled={updateProductMutation.isPending}
                  >
                    <RiCloseLine className='size-3' />
                  </Button.Root>
                </div>
              ) : (
                <div className='mt-1 text-label-sm text-text-strong-950'>
                  {productData.condition?.replace('_', ' ').toUpperCase() ||
                    'Not specified'}
                </div>
              )}
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Warehouse
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.warehouseName || 'Not specified'}
              </div>
            </div>
          </div>

          {productData.description && (
            <div className='mt-6'>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Description
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.description}
              </div>
            </div>
          )}

          {productData.importNotes && (
            <div className='mt-6'>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Import Notes
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.importNotes}
              </div>
            </div>
          )}
        </div>

        {/* Category-Specific Details */}
        {productData.category === 'serialized' && (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <RiSettings3Line className='size-5 text-text-sub-600' />
              <h3 className='text-lg text-gray-900 font-medium'>
                Serialized Product Details
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {productData.machineTypeId && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Machine Type
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.machineTypeName || productData.machineTypeId}
                  </div>
                </div>
              )}

              {productData.modelNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Model Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.modelNumber}
                  </div>
                </div>
              )}

              {productData.partNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.partNumber}
                  </div>
                </div>
              )}

              {productData.partNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.partNumber}
                  </div>
                </div>
              )}

              {productData.machineNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Machine Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.machineNumber}
                  </div>
                </div>
              )}

              {productData.engineNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Engine Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.engineNumber}
                  </div>
                </div>
              )}

              {productData.serialNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Serial Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.serialNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {productData.category === 'non_serialized' && (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <RiInformationLine className='size-5 text-text-sub-600' />
              <h3 className='text-lg text-gray-900 font-medium'>
                Non-Serialized Product Details
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {productData.unitOfMeasureId && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Unit of Measure
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.unitOfMeasureName
                      ? `${productData.unitOfMeasureName} (${productData.unitOfMeasureAbbreviation || productData.unitOfMeasureId})`
                      : productData.unitOfMeasureId}
                  </div>
                </div>
              )}

              {productData.batchOrLotNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Batch/Lot Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.batchOrLotNumber}
                  </div>
                </div>
              )}

              {productData.partNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.partNumber}
                  </div>
                </div>
              )}

              {productData.partNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.partNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {productData.category === 'bulk' && (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <RiBox3Line className='size-5 text-text-sub-600' />
              <h3 className='text-lg text-gray-900 font-medium'>
                Bulk Product Details
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {productData.unitOfMeasureId && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Unit of Measure
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.unitOfMeasureName
                      ? `${productData.unitOfMeasureName} (${productData.unitOfMeasureAbbreviation || productData.unitOfMeasureId})`
                      : productData.unitOfMeasureId}
                  </div>
                </div>
              )}

              {productData.partNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.partNumber}
                  </div>
                </div>
              )}

              {productData.partNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.partNumber}
                  </div>
                </div>
              )}

              {productData.batchOrLotNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Batch/Lot Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.batchOrLotNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        {productData.category === PRODUCT_CATEGORY.SERIALIZED && (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg text-gray-900 font-medium'>
                Technical Specifications
              </h3>
              {!isEditingTechnical && (
                <Button.Root
                  variant='neutral'
                  mode='ghost'
                  size='xsmall'
                  onClick={handleEditTechnical}
                  disabled={updateProductMutation.isPending}
                >
                  <RiEditLine className='mr-1 size-4' />
                  Edit
                </Button.Root>
              )}
              {isEditingTechnical && (
                <div className='flex items-center gap-2'>
                  <Button.Root
                    variant='primary'
                    size='xsmall'
                    onClick={handleSaveTechnical}
                    disabled={updateProductMutation.isPending}
                  >
                    <RiSaveLine className='mr-1 size-4' />
                    Save
                  </Button.Root>
                  <Button.Root
                    variant='neutral'
                    mode='ghost'
                    size='xsmall'
                    onClick={handleCancelTechnical}
                    disabled={updateProductMutation.isPending}
                  >
                    <RiCloseLine className='mr-1 size-4' />
                    Cancel
                  </Button.Root>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Additional Specs
              </div>
              {isEditingTechnical ? (
                <TextArea.Root
                  id='additionalSpecs'
                  value={editedAdditionalSpecs}
                  onChange={(e) => setEditedAdditionalSpecs(e.target.value)}
                  rows={3}
                  placeholder='Enter additionalSpecs'
                  className='mt-2 w-full'
                />
              ) : (
                <pre className='mt-1 text-label-sm text-text-strong-950'>
                  {productData.additionalSpecs || 'Not specified'}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <h3 className='text-lg text-gray-900 mb-4 font-medium'>
            Record Information
          </h3>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Created Date
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.createdAt
                  ? new Date(productData.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Last Updated
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.updatedAt
                  ? new Date(productData.updatedAt).toLocaleDateString()
                  : 'Unknown'}
              </div>
            </div>

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Status
              </div>
              <div className='mt-1'>
                <Badge.Root
                  variant='light'
                  color={getStatusBadgeColor(productData.status as string)}
                >
                  {productData.status?.replace('_', ' ').toUpperCase()}
                </Badge.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
