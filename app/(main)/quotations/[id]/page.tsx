import { Suspense } from 'react';

import { QuotationsErrorBoundary } from '../error-boundary';
import { QuotationDetailClient } from './quotation-detail-client';
import { QuotationDetailSkeleton } from './quotation-detail-skeleton';

interface PageProps {
  params: {
    id: string;
  };
}

export default function QuotationDetailPage({ params }: PageProps) {
  return (
    <QuotationsErrorBoundary>
      <Suspense fallback={<QuotationDetailSkeleton />}>
        <QuotationDetailClient id={params.id} />
      </Suspense>
    </QuotationsErrorBoundary>
  );
}
