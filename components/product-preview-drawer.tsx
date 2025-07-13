'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiBuildingLine,
  RiExternalLinkLine,
  RiMapPinLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { type Product } from '@/hooks/use-products';
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
    variant: 'light' as const,
    color: 'green' as const,
  },
  out_of_stock: {
    label: 'Out of Stock',
    variant: 'light' as const,
    color: 'red' as const,
  },
  discontinued: {
    label: 'Discontinued',
    variant: 'light' as const,
    color: 'gray' as const,
  },
};

const conditionConfig = {
  new: {
    label: 'New',
    variant: 'light' as const,
    color: 'green' as const,
  },
  used: {
    label: 'Used',
    variant: 'light' as const,
    color: 'orange' as const,
  },
  refurbished: {
    label: 'Refurbished',
    variant: 'light' as const,
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

function ProductPreviewContent({ product }: { product: Product }) {
  return (
    <>
      <Divider.Root variant='solid-text'>Product Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-start justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='text-title-h4 text-text-strong-950'>
              {product.name}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {product.code} • {product.category || 'Uncategorized'}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {product.brand} {product.model}{' '}
              {product.year && `(${product.year})`}
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
          {formatCurrency(product.price, product.currency)}
        </div>
        <div className='mt-1 text-paragraph-sm text-text-sub-600'>
          per {product.unit}
        </div>
      </div>

      <Divider.Root variant='solid-text'>Details</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Location
          </div>
          <div className='mt-1 flex items-center gap-1 text-label-sm text-text-strong-950'>
            <RiMapPinLine className='size-4 text-text-soft-400' />
            {product.location || 'Not specified'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Supplier
          </div>
          <div className='mt-1 flex items-center gap-1 text-label-sm text-text-strong-950'>
            <RiBuildingLine className='size-4 text-text-soft-400' />
            {product.supplierName || 'Not specified'}
          </div>
          {product.supplierCode && (
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              Code: {product.supplierCode}
            </div>
          )}
        </div>

        {(product.engineModel ||
          product.enginePower ||
          product.operatingWeight) && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Technical Specifications
              </div>
              <div className='mt-1 space-y-1'>
                {product.engineModel && (
                  <div className='text-label-sm text-text-strong-950'>
                    Engine: {product.engineModel}
                  </div>
                )}
                {product.enginePower && (
                  <div className='text-label-sm text-text-strong-950'>
                    Power: {product.enginePower}
                  </div>
                )}
                {product.operatingWeight && (
                  <div className='text-label-sm text-text-strong-950'>
                    Weight: {product.operatingWeight}
                  </div>
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
            {formatDate(product.createdAt)}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Last Updated
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(product.updatedAt)}
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

function ProductPreviewFooter({ product }: { product: Product }) {
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open || !product) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className={isMobile ? 'max-w-full' : 'max-w-md'}>
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
