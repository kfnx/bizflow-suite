import * as Label from '@/components/ui/label';

interface InvoiceNumberDisplayProps {
  invoiceNumber?: string | null;
}

export default function InvoiceNumberDisplay({
  invoiceNumber,
}: InvoiceNumberDisplayProps) {
  return (
    <div className='mb-4 flex flex-col gap-1'>
      <Label.Root htmlFor='invoiceNumber'>Invoice Number</Label.Root>
      <div className='text-sm p-2 text-text-sub-600'>{invoiceNumber}</div>
    </div>
  );
}