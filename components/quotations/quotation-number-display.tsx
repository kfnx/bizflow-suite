import * as Label from '@/components/ui/label';

interface QuotationNumberDisplayProps {
  quotationNumber?: string | null;
}

export default function QuotationNumberDisplay({
  quotationNumber,
}: QuotationNumberDisplayProps) {
  return (
    <div className='mb-4 flex flex-col gap-1'>
      <Label.Root htmlFor='quotationNumber'>Quotation Number</Label.Root>
      <div className='text-sm p-2 text-text-sub-600'>{quotationNumber}</div>
    </div>
  );
}
