import { ErrorBoundary } from '@/components/error-boundary';
import { InvoiceDetail } from './invoice-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function InvoiceDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='invoice detail'>
      <InvoiceDetail id={params.id} />
    </ErrorBoundary>
  );
}
