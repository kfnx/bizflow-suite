import { ErrorBoundary } from '@/components/error-boundary';

import { WarehouseDetail } from './warehouse-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function WarehouseDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='warehouse detail'>
      <WarehouseDetail id={params.id} />
    </ErrorBoundary>
  );
}