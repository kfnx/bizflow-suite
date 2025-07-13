'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiEditLine,
  RiEyeLine,
  RiStoreLine,
  RiUserLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import Header from '@/components/header';
import { WarehousePreviewDrawer } from '@/components/warehouse-preview-drawer';

import WarehousesTable from './warehouses-table';

interface Warehouse {
  id: string;
  name: string;
  address?: string;
  managerId?: string;
  managerName?: string;
  managerLastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WarehousesFilters {
  search: string;
  isActive: string;
  sortBy: string;
}

export default function WarehousesPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );

  const [filters, setFilters] = useState<WarehousesFilters>({
    search: '',
    isActive: 'all',
    sortBy: 'name-asc',
  });

  const fetchWarehouses = async (
    page: number = 1,
    currentFilters: WarehousesFilters = filters,
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

      const response = await fetch(`/api/warehouses?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch warehouses');
      }

      const result = await response.json();
      setWarehouses(result.data);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      setError('Failed to load warehouses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleFilterChange = (key: keyof WarehousesFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchWarehouses(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchWarehouses(page);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWarehouses(1, filters);
  };

  const clearFilters = () => {
    const clearedFilters: WarehousesFilters = {
      search: '',
      isActive: 'all',
      sortBy: 'name-asc',
    };
    setFilters(clearedFilters);
    fetchWarehouses(1, clearedFilters);
  };

  const handleWarehouseClick = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
  };

  const handleCloseDrawer = () => {
    setSelectedWarehouseId(null);
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiStoreLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Warehouses'
        description='Manage warehouse locations and inventory.'
      >
        <Button.Root
          variant='primary'
          onClick={() => router.push('/warehouses/new')}
        >
          <RiAddLine className='size-5' />
          Add Warehouse
        </Button.Root>
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        {/* Filters */}
        <div className='rounded-lg border border-stroke-soft-200 p-6'>
          <form onSubmit={handleSearchSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
                      placeholder='Search warehouses, addresses, managers...'
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700 font-medium'>
                  Status
                </label>
                <Select.Root
                  value={filters.isActive}
                  onValueChange={(value) =>
                    handleFilterChange('isActive', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='All status' />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='all'>All Status</Select.Item>
                    <Select.Item value='true'>Active</Select.Item>
                    <Select.Item value='false'>Inactive</Select.Item>
                  </Select.Content>
                </Select.Root>
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
                    <Select.Item value='name-asc'>Name (A-Z)</Select.Item>
                    <Select.Item value='name-desc'>Name (Z-A)</Select.Item>
                    <Select.Item value='manager-asc'>Manager (A-Z)</Select.Item>
                    <Select.Item value='manager-desc'>
                      Manager (Z-A)
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

        {/* Results */}
        <div className='rounded-lg border border-stroke-soft-200 bg-white'>
          {error ? (
            <div className='p-8 text-center text-red-600'>{error}</div>
          ) : (
            <WarehousesTable
              warehouses={warehouses}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRefresh={() => fetchWarehouses(pagination.page)}
              onWarehouseClick={handleWarehouseClick}
            />
          )}
        </div>
      </div>

      <WarehousePreviewDrawer
        warehouseId={selectedWarehouseId}
        open={!!selectedWarehouseId}
        onClose={handleCloseDrawer}
      />
    </>
  );
}
