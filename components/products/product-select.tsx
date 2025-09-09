'use client';

import { useState } from 'react';
import { RiShoppingCartLine } from '@remixicon/react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
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
}

export function ProductSelect({
  value,
  onValueChange,
  onProductSelect,
  error = false,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);

  // Use limit=-1 to get all products
  const { data: products, isLoading } = useProducts({
    limit: -1,
  });

  const selectedProduct = products?.data?.find(
    (product) => product.id === value,
  );

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);

    // Call the callback with the selected product data
    if (onProductSelect && products?.data) {
      const selectedProduct = products.data.find(
        (product) => product.id === selectedValue,
      );
      if (selectedProduct) {
        onProductSelect(selectedProduct);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button.Root
          variant='neutral'
          mode='stroke'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            error && 'border-red-500 focus-visible:ring-red-500',
            !selectedProduct && 'text-muted-foreground',
          )}
          disabled={isLoading}
        >
          <div className='flex items-center gap-2'>
            <RiShoppingCartLine className='h-4 w-4' />
            <span>
              {selectedProduct
                ? selectedProduct.name
                : isLoading
                  ? 'Loading products...'
                  : 'Select product'}
            </span>
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button.Root>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
        <Command>
          <CommandInput placeholder='Search products...' className='h-9 p-3' />
          <CommandList className='max-h-[280px]'>
            <CommandEmpty>
              {isLoading ? 'Loading products...' : 'No products found.'}
            </CommandEmpty>
            <CommandGroup>
              {products?.data?.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name} // value bisa nama atau ID, untuk search
                  onSelect={() => handleSelect(product.id)} // onSelect memanggil handler dengan ID
                  className='flex items-center justify-between'
                >
                  <div className='flex flex-col'>
                    <span>{product.name}</span>
                    <small className='text-muted-foreground'>
                      {product.category}
                    </small>
                  </div>
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4',
                      value === product.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
