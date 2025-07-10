import { PermissionGate } from '@/components/auth/permission-gate';
import InvoiceEditForm from './invoice-edit-form';

interface InvoiceEditProps {
  id: string;
}

export function InvoiceEdit({ id }: InvoiceEditProps) {
  return (
    <PermissionGate 
      permission="invoices:update"
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text-strong-950">Access Denied</h2>
            <p className="text-text-sub-600">You don&apos;t have permission to edit invoices.</p>
          </div>
        </div>
      }
    >
      <InvoiceEditForm id={id} />
    </PermissionGate>
  );
}
