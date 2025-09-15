'use client';

import { useState } from 'react';
import {
  RiCheckLine,
  RiExpandUpDownLine,
  RiShoppingCartLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { useProducts } from '@/hooks/use-products';
import type { ProductWithRelations } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover-radix';

interface ProductSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  onProductSelect?: (product: ProductWithRelations) => void;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ProductSelect({
  value,
  onValueChange,
  onProductSelect,
  error = false,
  placeholder = 'Select product',
  disabled = false,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);

  const {
    data: products,
    isLoading,
    error: fetchError,
  } = useProducts({
    limit: -1,
  });

  const selectedProduct = products?.data?.find(
    (product) => product.id === value,
  );

  const handleSelect = (productId: string) => {
    if (value === productId) {
      setOpen(false);
      return;
    }

    onValueChange(productId);
    setOpen(false);

    if (onProductSelect && products?.data) {
      const selected = products.data.find((p) => p.id === productId);
      if (selected) onProductSelect(selected);
    }
  };

  const getSearchValue = (product: ProductWithRelations) => {
    return `${product.name} ${product.category}`.toLowerCase();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button.Root
          variant='neutral'
          mode='stroke'
          role='combobox'
          aria-expanded={open}
          aria-label={
            selectedProduct ? `Selected: ${selectedProduct.name}` : placeholder
          }
          className={cnExt(
            'h-auto min-h-10 w-full justify-between',
            error && 'border-red-500 focus-visible:ring-red-500',
            !selectedProduct && 'text-muted-foreground',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          disabled={isLoading || disabled || !!fetchError}
          type='button'
        >
          <div className='flex flex-1 items-center gap-2 text-left'>
            <RiShoppingCartLine className='h-4 w-4 flex-shrink-0' />
            <span className='flex-1 truncate'>
              {fetchError ? (
                'Error loading products'
              ) : isLoading ? (
                'Loading products...'
              ) : selectedProduct ? (
                <>
                  {selectedProduct.name}{' '}
                  <small className='text-text-soft-400'>
                    {selectedProduct.category}
                  </small>
                </>
              ) : (
                placeholder
              )}
            </span>
          </div>
          <RiExpandUpDownLine className='ml-2 h-4 w-6 shrink-0 opacity-50' />
        </Button.Root>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder='Search products...' className='h-9 p-3' />
          <CommandList className='max-h-[280px]'>
            <CommandEmpty>
              {isLoading
                ? 'Loading products...'
                : fetchError
                  ? 'Error loading products'
                  : 'No products found.'}
            </CommandEmpty>
            {products?.data && products.data.length > 0 && (
              <CommandGroup>
                {products.data.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={getSearchValue(product)}
                    onSelect={() => handleSelect(product.id)}
                    className='flex cursor-pointer items-center justify-between'
                  >
                    <div className='flex flex-1 flex-col'>
                      <span className='font-medium'>{product.name}</span>
                      <div className='text-xs flex items-center gap-2 text-muted-foreground'>
                        <span className='capitalize'>{product.category}</span>
                        {product.price && (
                          <>
                            <span>•</span>
                            <span>{product.price.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <RiCheckLine
                      className={cnExt(
                        'ml-2 h-6 w-6',
                        value === product.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
