'use client';

import * as React from 'react';
import { RiSearchLine } from '@remixicon/react';

import { useProducts } from '@/hooks/use-products';
import { useWarehouses } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';

interface TransfersFiltersProps {
  filters: {
    search: string;
    movementType: 'all' | 'in' | 'out' | 'transfer' | 'adjustment';
    warehouseFrom: string;
    warehouseTo: string;
    productId: string;
    sortBy: string;
    page: number;
    limit: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function TransfersFilters({
  filters,
  onFiltersChange,
}: TransfersFiltersProps) {
  const [localSearch, setLocalSearch] = React.useState(filters.search);

  // Fetch reference data
  const { data: warehousesData } = useWarehouses({ limit: 100 });
  const { data: productsData } = useProducts({ limit: 100 });

  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: localSearch, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      movementType: 'all',
      warehouseFrom: 'all',
      warehouseTo: 'all',
      productId: 'all',
      sortBy: 'date-desc',
      page: 1,
      limit: filters.limit,
    });
  };

  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
      <form onSubmit={handleSearchSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Search
            </label>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder='Search products, notes, invoices...'
                />
                <Input.Affix>
                  <RiSearchLine className='size-5 text-text-sub-600' />
                </Input.Affix>
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Movement Type
            </label>
            <Select.Root
              value={filters.movementType}
              onValueChange={(value) =>
                handleFilterChange('movementType', value)
              }
            >
              <Select.Trigger>
                <Select.Value placeholder='All types' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='all'>All Types</Select.Item>
                <Select.Item value='in'>In</Select.Item>
                <Select.Item value='out'>Out</Select.Item>
                <Select.Item value='transfer'>Transfer</Select.Item>
                <Select.Item value='adjustment'>Adjustment</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              From Warehouse
            </label>
            <Select.Root
              value={filters.warehouseFrom}
              onValueChange={(value) =>
                handleFilterChange('warehouseFrom', value)
              }
            >
              <Select.Trigger>
                <Select.Value placeholder='Any warehouse' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='all'>Any Warehouse</Select.Item>
                {warehouses.map((warehouse) => (
                  <Select.Item key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              To Warehouse
            </label>
            <Select.Root
              value={filters.warehouseTo}
              onValueChange={(value) =>
                handleFilterChange('warehouseTo', value)
              }
            >
              <Select.Trigger>
                <Select.Value placeholder='Any warehouse' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='all'>Any Warehouse</Select.Item>
                {warehouses.map((warehouse) => (
                  <Select.Item key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Product
            </label>
            <Select.Root
              value={filters.productId}
              onValueChange={(value) => handleFilterChange('productId', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder='Any product' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='all'>Any Product</Select.Item>
                {products.map((product) => (
                  <Select.Item key={product.id} value={product.id}>
                    {product.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-subheading-sm text-text-strong-950'>
              Sort By
            </label>
            <Select.Root
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder='Sort by' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='date-desc'>Latest First</Select.Item>
                <Select.Item value='date-asc'>Oldest First</Select.Item>
                <Select.Item value='product-asc'>Product (A-Z)</Select.Item>
                <Select.Item value='product-desc'>Product (Z-A)</Select.Item>
                <Select.Item value='movement-type-asc'>Type (A-Z)</Select.Item>
                <Select.Item value='movement-type-desc'>Type (Z-A)</Select.Item>
                <Select.Item value='quantity-asc'>
                  Quantity (Low-High)
                </Select.Item>
                <Select.Item value='quantity-desc'>
                  Quantity (High-Low)
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col justify-end gap-2'>
            <div className='grid grid-cols-2 gap-2'>
              <Button.Root type='submit' variant='primary' size='small'>
                Search
              </Button.Root>
              <Button.Root
                type='button'
                variant='neutral'
                mode='ghost'
                size='small'
                onClick={clearFilters}
              >
                Clear
              </Button.Root>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
