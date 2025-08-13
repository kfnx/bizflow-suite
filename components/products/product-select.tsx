'use client';

import { RiShoppingCartLine } from '@remixicon/react';

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
  // Use limit=-1 to get all products
  const { data: products, isLoading } = useProducts({
    limit: -1,
  });

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
      <Select.Content>
        {products?.data?.map((product) => (
          <Select.Item key={product.id} value={product.id}>
            {product.name}{' '}
            <small className='text-text-soft-400'>{product.category}</small>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
