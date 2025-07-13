'use client';

import { useSupplierDetail } from '@/hooks/use-suppliers';
import { ErrorBoundary } from '@/components/error-boundary';

import { SupplierDetail } from './supplier-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function SupplierDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='supplier detail'>
      <SupplierDetail id={params.id} />
    </ErrorBoundary>
  );
}
