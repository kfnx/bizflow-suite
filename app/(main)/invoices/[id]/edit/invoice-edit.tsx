import InvoiceEditForm from './invoice-edit-form';

interface InvoiceEditProps {
  id: string;
}

export function InvoiceEdit({ id }: InvoiceEditProps) {
  return <InvoiceEditForm id={id} />;
}
