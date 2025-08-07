import { ErrorBoundary } from '@/components/error-boundary';

import { DeliveryNoteDetail } from './delivery-note-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function DeliveryNoteDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='delivery note detail'>
      <DeliveryNoteDetail id={params.id} />
    </ErrorBoundary>
  );
}
