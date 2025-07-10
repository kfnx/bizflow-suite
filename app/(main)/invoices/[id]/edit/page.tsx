import { InvoiceEdit } from './invoice-edit';

interface PageProps {
  params: {
    id: string;
  };
}

export default function InvoiceEditPage({ params }: PageProps) {
  return <InvoiceEdit id={params.id} />;
}
