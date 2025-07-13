import { ErrorBoundary } from '@/components/error-boundary';

import { ImportDetail } from './import-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ImportDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='import detail'>
      <ImportDetail id={params.id} />
    </ErrorBoundary>
  );
}
