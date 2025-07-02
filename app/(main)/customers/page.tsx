'use client';

import { useCallback, useState } from 'react';
import { RiUserLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import { CustomersTable } from '@/components/customers-table';
import Header from '@/components/header';

import { Filters, type CustomersFilters } from './filters';

export default function PageCustomers() {
  const [filters, setFilters] = useState<CustomersFilters>({
    search: '',
    type: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = useCallback((newFilters: CustomersFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  const HeaderComponent = () => {
    return (
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiUserLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Customers'
        description='Manage your customer database and contact information.'
      >
        <ActionButton
          className='hidden lg:flex'
          label='New Customer'
          href='/customers/new'
        />
      </Header>
    );
  };

  return (
    <>
      <HeaderComponent />

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters onFiltersChange={handleFiltersChange} />
        <CustomersTable
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </>
  );
}
