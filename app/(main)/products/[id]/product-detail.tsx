'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBox3Line,
  RiDeleteBinLine,
  RiEditLine,
  RiInformationLine,
  RiSettings3Line,
} from '@remixicon/react';

import { useProduct, type ProductWithRelations } from '@/hooks/use-products';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface ProductDetailProps {
  id: string;
}

export function ProductDetail({ id }: ProductDetailProps) {
  const router = useRouter();
  const { data: productData, isLoading, error } = useProduct(id);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/products/${id}/edit`);
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
        {/* Action Buttons */}
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-end'>
          <Button.Root variant='neutral' mode='stroke' onClick={handleEdit}>
            <RiEditLine className='mr-2 size-4' />
            Edit Product
          </Button.Root>
        </div>

        {/* Product Overview */}
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <h3 className='text-lg text-gray-900 mb-4 font-medium'>
            Product Information
          </h3>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
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

            {productData.year && (
              <div>
                <div className='text-subheading-xs uppercase text-text-soft-400'>
                  Year
                </div>
                <div className='mt-1 text-label-sm text-text-strong-950'>
                  {productData.year}
                </div>
              </div>
            )}
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
                    {productData.machineTypeId}
                  </div>
                </div>
              )}

              {productData.modelOrPartNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Model/Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.modelOrPartNumber}
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
                    {productData.unitOfMeasureId}
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

              {productData.modelOrPartNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Model/Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.modelOrPartNumber}
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
                    {productData.unitOfMeasureId}
                  </div>
                </div>
              )}

              {productData.modelOrPartNumber && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Model/Part Number
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.modelOrPartNumber}
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
        {(productData.engineModel ||
          productData.enginePower ||
          productData.operatingWeight) && (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Technical Specifications
            </h3>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {productData.engineModel && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Engine Model
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.engineModel}
                  </div>
                </div>
              )}

              {productData.enginePower && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Engine Power
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.enginePower}
                  </div>
                </div>
              )}

              {productData.operatingWeight && (
                <div>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Operating Weight
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {productData.operatingWeight}
                  </div>
                </div>
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
