'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Transfers } from './transfers';

export function TransfersPageContent() {
  const searchParams = useSearchParams();
  const [initialFilters, setInitialFilters] = useState({
    search: '',
    movementType: 'all' as 'all' | 'in' | 'out' | 'transfer' | 'adjustment',
    warehouseFrom: 'all',
    warehouseTo: 'all',
    productId: 'all',
    sortBy: 'date-desc',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setInitialFilters({
      search: searchParams?.get('search') || '',
      movementType: (searchParams?.get('movementType') || 'all') as
        | 'all'
        | 'in'
        | 'out'
        | 'transfer'
        | 'adjustment',
      warehouseFrom: searchParams?.get('warehouseFrom') || 'all',
      warehouseTo: searchParams?.get('warehouseTo') || 'all',
      productId: searchParams?.get('productId') || 'all',
      sortBy: searchParams?.get('sortBy') || 'date-desc',
      page: parseInt(searchParams?.get('page') || '1'),
      limit: parseInt(searchParams?.get('limit') || '10'),
    });
  }, [searchParams]);

  return <Transfers initialFilters={initialFilters} />;
}
