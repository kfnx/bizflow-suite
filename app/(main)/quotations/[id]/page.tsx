import { ErrorBoundary } from '@/components/error-boundary';
import { QuotationDetail } from './quotation-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function QuotationDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='quotation detail'>
      <QuotationDetail id={params.id} />
    </ErrorBoundary>
  );
}
