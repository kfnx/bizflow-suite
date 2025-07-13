'use client';

import { useCustomerDetail } from '@/hooks/use-customers';
import { ErrorBoundary } from '@/components/error-boundary';

import { CustomerDetail } from './customer-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CustomerDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='customer detail'>
      <CustomerDetail id={params.id} />
    </ErrorBoundary>
  );
}
