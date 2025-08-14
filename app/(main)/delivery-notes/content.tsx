'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { DeliveryNotes } from '@/app/(main)/delivery-notes/delivery-notes';

import type { DeliveryNotesFilters, DeliveryNoteStatus } from './filters';

export function DeliveryNotesPageContent() {
  const searchParams = useSearchParams();
  const [initialFilters, setInitialFilters] = useState<DeliveryNotesFilters>({
    search: '',
    status: 'all' as DeliveryNoteStatus,
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setInitialFilters({
      search: searchParams?.get('search') || '',
      status: (searchParams?.get('status') || 'all') as DeliveryNoteStatus,
      sortBy: searchParams?.get('sortBy') || 'newest-first',
      page: parseInt(searchParams?.get('page') || '1'),
      limit: parseInt(searchParams?.get('limit') || '10'),
    });
  }, [searchParams]);

  return <DeliveryNotes initialFilters={initialFilters} />;
}
