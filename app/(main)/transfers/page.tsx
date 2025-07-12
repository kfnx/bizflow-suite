'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine, RiExchangeFundsLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import Header from '@/components/header';

import TransfersTable from './transfers-table';

interface StockMovement {
  id: string;
  warehouseIdFrom: string;
  warehouseFromName: string;
  warehouseIdTo: string;
  warehouseToName: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  movementType: string;
  invoiceId?: string;
  deliveryId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
}

interface TransfersFilters {
  search: string;
  movementType: string;
  warehouseFrom: string;
  warehouseTo: string;
  productId: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
}

export default function TransfersPage() {
  const router = useRouter();
  const [transfers, setTransfers] = useState<StockMovement[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<TransfersFilters>({
    search: '',
    movementType: 'all',
    warehouseFrom: '',
    warehouseTo: '',
    productId: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date-desc',
  });

  const fetchTransfers = async (
    page: number = 1,
    currentFilters: TransfersFilters = filters,
  ) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...currentFilters,
      });

      // Remove empty filters
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (!value || value === 'all') {
          params.delete(key);
        }
      });

      const response = await fetch(`/api/transfers?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transfers');
      }

      const result = await response.json();
      setTransfers(result.data);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError('Failed to load transfers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [warehousesRes, productsRes] = await Promise.all([
        fetch('/api/warehouses?limit=100'),
        fetch('/api/products?limit=100'),
      ]);

      if (warehousesRes.ok) {
        const warehousesData = await warehousesRes.json();
        setWarehouses(warehousesData.data || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      }
    } catch (err) {
      console.error('Error fetching reference data:', err);
    }
  };

  useEffect(() => {
    fetchReferenceData();
    fetchTransfers();
  }, []);

  const handleFilterChange = (key: keyof TransfersFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchTransfers(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchTransfers(page);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransfers(1, filters);
  };

  const clearFilters = () => {
    const clearedFilters: TransfersFilters = {
      search: '',
      movementType: 'all',
      warehouseFrom: '',
      warehouseTo: '',
      productId: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date-desc',
    };
    setFilters(clearedFilters);
    fetchTransfers(1, clearedFilters);
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiExchangeFundsLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Stock Movements & Transfers'
        description='Track all stock movements and transfers between warehouses.'
      >
        <Button.Root
          variant='primary'
          onClick={() => router.push('/transfers/new')}
        >
          <RiAddLine className='size-5' />
          New Transfer
        </Button.Root>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {/* Filters */}
        <div className='rounded-lg border border-stroke-soft-200 p-6'>
          <form onSubmit={handleSearchSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700 font-medium'>
                  Search
                </label>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      placeholder='Search products, notes, invoices...'
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700 font-medium'>
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
                <label className='text-sm text-gray-700 font-medium'>
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
                <label className='text-sm text-gray-700 font-medium'>
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
                <label className='text-sm text-gray-700 font-medium'>
                  Product
                </label>
                <Select.Root
                  value={filters.productId}
                  onValueChange={(value) =>
                    handleFilterChange('productId', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Any product' />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='all'>Any Product</Select.Item>
                    {products.map((product) => (
                      <Select.Item key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700 font-medium'>
                  Date From
                </label>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type='date'
                      value={filters.dateFrom}
                      onChange={(e) =>
                        handleFilterChange('dateFrom', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700 font-medium'>
                  Date To
                </label>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type='date'
                      value={filters.dateTo}
                      onChange={(e) =>
                        handleFilterChange('dateTo', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700 font-medium'>
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
                    <Select.Item value='product-desc'>
                      Product (Z-A)
                    </Select.Item>
                    <Select.Item value='movement-type-asc'>
                      Type (A-Z)
                    </Select.Item>
                    <Select.Item value='movement-type-desc'>
                      Type (Z-A)
                    </Select.Item>
                    <Select.Item value='quantity-asc'>
                      Quantity (Low-High)
                    </Select.Item>
                    <Select.Item value='quantity-desc'>
                      Quantity (High-Low)
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            <div className='flex gap-2'>
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
                Clear Filters
              </Button.Root>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className='rounded-lg border border-stroke-soft-200 bg-white'>
          {error ? (
            <div className='p-8 text-center text-red-600'>{error}</div>
          ) : (
            <TransfersTable
              transfers={transfers}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRefresh={() => fetchTransfers(pagination.page)}
            />
          )}
        </div>
      </div>
    </>
  );
}
