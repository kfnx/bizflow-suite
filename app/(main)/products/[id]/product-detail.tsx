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
import { formatCurrency } from '@/utils/number-formatter';
import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
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
  const [isEditingTechnical, setIsEditingTechnical] = useState(false);
  const [editedAdditionalSpecs, setEditedAdditionalSpecs] = useState('');

  const handleEditTechnical = () => {
    setEditedAdditionalSpecs(productData?.additionalSpecs || '');
    setIsEditingTechnical(true);
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

  const handleCancelTechnical = () => {
    setIsEditingTechnical(false);
    setEditedAdditionalSpecs('');
  };

  if (isLoading) {
    return <Loading className='w-full p-8' />;
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
        <BackButton href='/products' label='Back to Products' />
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
                Brand
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {productData.brandName || 'Not specified'}
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

              {productData.machineModel && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Machine Model
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.machineModel}
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
          </div>
        </div>
      </div>
    </>
  );
}
