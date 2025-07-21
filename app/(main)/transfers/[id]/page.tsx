import { ErrorBoundary } from '@/components/error-boundary';

import { TransferDetail } from './transfer-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TransferDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='transfer detail'>
      <TransferDetail id={params.id} />
    </ErrorBoundary>
  );
}