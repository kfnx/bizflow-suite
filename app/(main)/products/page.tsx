'use client';

import { Suspense, useCallback, useState } from 'react';
import { RiBox1Line } from '@remixicon/react';

import Header from '@/components/header';
import { ProductsTable } from '@/components/products/products-table';

import { Filters, type ProductsFilters } from './filters';

export default function PageProducts() {
  const [filters, setFilters] = useState<ProductsFilters>({
    search: '',
    status: 'all',
    category: 'all',
    brand: 'all',
    location: 'all',
    sortBy: '',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = useCallback((newFilters: ProductsFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBox1Line className='size-6 text-text-sub-600' />
          </div>
        }
        title='Products'
        description='Manage your product catalog and inventory.'
      />

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Suspense fallback={<div>Loading filters...</div>}>
          <Filters onFiltersChange={handleFiltersChange} />
        </Suspense>
        <ProductsTable
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </>
  );
}
