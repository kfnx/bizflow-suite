'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { QUOTATION_STATUS } from '@/lib/db/enum';

import { Quotations } from './quotations';

export function QuotationsPageContent() {
  const searchParams = useSearchParams();
  const [initialFilters, setInitialFilters] = useState({
    search: '',
    status: 'all' as 'all' | QUOTATION_STATUS,
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setInitialFilters({
      search: searchParams?.get('search') || '',
      status: (searchParams?.get('status') || 'all') as
        | 'all'
        | QUOTATION_STATUS,
      sortBy: searchParams?.get('sortBy') || 'newest-first',
      page: parseInt(searchParams?.get('page') || '1'),
      limit: parseInt(searchParams?.get('limit') || '10'),
    });
  }, [searchParams]);

  return <Quotations initialFilters={initialFilters} />;
}
