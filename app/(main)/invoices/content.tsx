'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { INVOICE_STATUS } from '@/lib/db/enum';

import { type InvoicesFilters } from './filters';
import { Invoices } from './invoices';

export function InvoicesPageContent() {
  const searchParams = useSearchParams();
  const [initialFilters, setInitialFilters] = useState<InvoicesFilters>({
    search: '',
    status: 'all' as 'all' | INVOICE_STATUS,
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setInitialFilters({
      search: searchParams?.get('search') || '',
      status: (searchParams?.get('status') || 'all') as 'all' | INVOICE_STATUS,
      sortBy: searchParams?.get('sortBy') || 'newest-first',
      page: parseInt(searchParams?.get('page') || '1'),
      limit: parseInt(searchParams?.get('limit') || '10'),
    });
  }, [searchParams]);

  return <Invoices initialFilters={initialFilters} />;
}