'use client';

import { useMemo, useState } from 'react';
import { RiSearchLine, RiShoppingCartLine } from '@remixicon/react';

import { useProducts } from '@/hooks/use-products';
import type { ProductWithRelations } from '@/hooks/use-products';
import * as Select from '@/components/ui/select';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Use limit=-1 to get all products
  const { data: products, isLoading } = useProducts({
    limit: -1,
  });

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products?.data) return [];

    if (!searchQuery.trim()) return products.data;

    return products.data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products?.data, searchQuery]);

  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Select.Root
      value={value}
      onValueChange={handleValueChange}
      disabled={isLoading}
    >
      <Select.Trigger className={error ? 'border-error-500' : ''}>
        <Select.TriggerIcon as={RiShoppingCartLine} />
        <Select.Value
          placeholder={isLoading ? 'Loading products...' : 'Select product'}
        />
      </Select.Trigger>
      <Select.Content className='max-h-[350px]'>
        {/* Search Input */}
        <div className='sticky -top-2 z-10 border-b border-stroke-soft-200 bg-white p-2'>
          <div className='relative'>
            <RiSearchLine className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-text-soft-400' />
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className='text-sm focus:ring-primary-500 w-full rounded-md border border-stroke-soft-200 py-2 pl-10 pr-3 focus:outline-none focus:ring-2'
            />
          </div>
        </div>

        {/* Product List */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className='text-sm p-3 text-center text-text-soft-400'>
              {searchQuery ? 'No products found' : 'No products available'}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Select.Item key={product.id} value={product.id}>
                <div>
                  <span>{product.name}</span>
                  <small className='ml-1 text-text-soft-400'>
                    {product.category}
                  </small>
                </div>
              </Select.Item>
            ))
          )}
        </div>
      </Select.Content>
    </Select.Root>
  );
}
