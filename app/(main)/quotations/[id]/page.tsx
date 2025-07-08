import { QuotationsErrorBoundary } from '../error-boundary';
import { QuotationDetailClient } from './quotation-detail-client';

interface PageProps {
  params: {
    id: string;
  };
}

export default function QuotationDetailPage({ params }: PageProps) {
  return (
    <QuotationsErrorBoundary>
      <QuotationDetailClient id={params.id} />
    </QuotationsErrorBoundary>
  );
}
