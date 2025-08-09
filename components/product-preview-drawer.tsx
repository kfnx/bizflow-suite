'use client';

import {
  RiBuildingLine,
  RiExternalLinkLine,
  RiMapPinLine,
} from '@remixicon/react';

import { type Product } from '@/lib/db/schema';
import { type ProductWithRelations } from '@/hooks/use-products';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';

interface ProductPreviewDrawerProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const statusConfig = {
  in_stock: {
    label: 'In Stock',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  out_of_stock: {
    label: 'Out of Stock',
    variant: 'lighter' as const,
    color: 'red' as const,
  },
  discontinued: {
    label: 'Discontinued',
    variant: 'lighter' as const,
    color: 'gray' as const,
  },
};

const conditionConfig = {
  new: {
    label: 'New',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  used: {
    label: 'Used',
    variant: 'lighter' as const,
    color: 'orange' as const,
  },
  refurbished: {
    label: 'Refurbished',
    variant: 'lighter' as const,
    color: 'blue' as const,
  },
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
};

function ProductPreviewContent({ product }: { product: ProductWithRelations }) {
  return (
    <>
      <Divider.Root variant='solid-text'>Product Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-start justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='text-title-h4 text-text-strong-950'>
              {product.name || 'Unnamed Product'}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {product.code && (
                <span className='bg-gray-100 text-xs mr-2 rounded px-2 py-1 font-mono'>
                  {product.code}
                </span>
              )}
              {product.brandName && `${product.brandName} • `}
              {product.category || 'Uncategorized'}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {product.partNumber && `Model: ${product.partNumber}`}
              {product.machineNumber && ` • Machine: ${product.machineNumber}`}
            </div>
          </div>
          <div className='ml-4 flex flex-col gap-2'>
            <Badge.Root
              variant={
                statusConfig[product.status as keyof typeof statusConfig]
                  ?.variant
              }
              color={
                statusConfig[product.status as keyof typeof statusConfig]?.color
              }
            >
              {statusConfig[product.status as keyof typeof statusConfig]
                ?.label || product.status}
            </Badge.Root>
            <Badge.Root
              variant={
                conditionConfig[
                  product.condition as keyof typeof conditionConfig
                ]?.variant
              }
              color={
                conditionConfig[
                  product.condition as keyof typeof conditionConfig
                ]?.color
              }
            >
              {conditionConfig[
                product.condition as keyof typeof conditionConfig
              ]?.label || product.condition}
            </Badge.Root>
          </div>
        </div>

        <div className='text-title-h4 text-text-strong-950'>
          {formatCurrency(Number(product.price ?? 0), 'IDR')}
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Location & Supplier
          </div>
          <div className='mt-1 flex items-center gap-1 text-label-sm text-text-strong-950'>
            <RiMapPinLine className='size-4 text-text-soft-400' />
            {product.warehouseName || 'No warehouse assigned'}
          </div>
          <div className='mt-1 flex items-center gap-1 text-label-sm text-text-strong-950'>
            <RiBuildingLine className='size-4 text-text-soft-400' />
            {product.supplierName || 'No supplier assigned'}
            {product.supplierCode && (
              <div className='mr-1 text-paragraph-sm text-text-soft-400'>
                {product.supplierCode}
              </div>
            )}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        {/* Category-specific details */}
        {product.category === 'serialized' && (
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Serialized Product Details
            </div>
            <div className='mt-1 space-y-2'>
              {product.machineTypeName && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Machine Type:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.machineTypeName}
                  </span>
                </div>
              )}
              {product.partNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Part Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.partNumber}
                  </span>
                </div>
              )}
              {product.machineNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Machine Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.machineNumber}
                  </span>
                </div>
              )}
              {product.engineNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Engine Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.engineNumber}
                  </span>
                </div>
              )}
              {product.serialNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Serial Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.serialNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {product.category === 'non_serialized' && (
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Non-Serialized Product Details
            </div>
            <div className='mt-1 space-y-2'>
              {product.unitOfMeasureName && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Unit of Measure:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.unitOfMeasureName} (
                    {product.unitOfMeasureAbbreviation})
                  </span>
                </div>
              )}
              {product.batchOrLotNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Batch/Lot Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.batchOrLotNumber}
                  </span>
                </div>
              )}
              {product.partNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Part Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.partNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {product.category === 'bulk' && (
          <div>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              Bulk Product Details
            </div>
            <div className='mt-1 space-y-2'>
              {product.unitOfMeasureName && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Unit of Measure:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.unitOfMeasureName} (
                    {product.unitOfMeasureAbbreviation})
                  </span>
                </div>
              )}
              {product.partNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Part Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.partNumber}
                  </span>
                </div>
              )}
              {product.batchOrLotNumber && (
                <div className='flex justify-between'>
                  <span className='text-paragraph-sm text-text-sub-600'>
                    Batch/Lot Number:
                  </span>
                  <span className='text-label-sm text-text-strong-950'>
                    {product.batchOrLotNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Specifications (common for all categories) */}
        {product.additionalSpecs && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Technical Specifications
              </div>
              <div className='mt-1 space-y-2'>
                {product.additionalSpecs && (
                  <pre className='text-paragraph-sm text-text-sub-600'>
                    {product.additionalSpecs}
                  </pre>
                )}
              </div>
            </div>
          </>
        )}

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {product.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : '-'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Last Updated
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {product.updatedAt
              ? new Date(product.updatedAt).toLocaleDateString()
              : '-'}
          </div>
        </div>

        {product.description && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Description
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {product.description}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ProductPreviewFooter({ product }: { product: ProductWithRelations }) {
  const handleViewFull = () => {
    window.open(`/products/${product.id}`, '_blank');
  };

  return (
    <Drawer.Footer className='border-t'>
      <Button.Root
        variant='primary'
        size='medium'
        className='w-full'
        onClick={handleViewFull}
      >
        <Button.Icon as={RiExternalLinkLine} />
        View Full Details
      </Button.Root>
    </Drawer.Footer>
  );
}

export function ProductPreviewDrawer({
  product,
  open,
  onClose,
}: ProductPreviewDrawerProps) {
  if (!open || !product) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Quick Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          <ProductPreviewContent product={product} />
        </Drawer.Body>

        <ProductPreviewFooter product={product} />
      </Drawer.Content>
    </Drawer.Root>
  );
}
