import { ErrorBoundary } from '@/components/error-boundary';

import { ProductDetail } from './product-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <ErrorBoundary context='product detail'>
      <ProductDetail id={params.id} />
    </ErrorBoundary>
  );
}
