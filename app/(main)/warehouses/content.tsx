'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Warehouses } from './warehouses';

export function WarehousesPageContent() {
  const searchParams = useSearchParams();
  const [initialFilters, setInitialFilters] = useState({
    search: '',
    isActive: 'all' as 'all' | 'true' | 'false',
    sortBy: 'name-asc',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setInitialFilters({
      search: searchParams?.get('search') || '',
      isActive: (searchParams?.get('isActive') || 'all') as
        | 'all'
        | 'true'
        | 'false',
      sortBy: searchParams?.get('sortBy') || 'name-asc',
      page: parseInt(searchParams?.get('page') || '1'),
      limit: parseInt(searchParams?.get('limit') || '10'),
    });
  }, [searchParams]);

  return <Warehouses initialFilters={initialFilters} />;
}
