import * as Label from '@/components/ui/label';

interface DeliveryNoteNumberDisplayProps {
  deliveryNumber?: string | null;
}

export default function DeliveryNoteNumberDisplay({
  deliveryNumber,
}: DeliveryNoteNumberDisplayProps) {
  return (
    <div className='mb-4 flex flex-col gap-1'>
      <Label.Root htmlFor='deliveryNumber'>Delivery Number</Label.Root>
      <div className='text-sm p-2 text-text-sub-600'>{deliveryNumber}</div>
    </div>
  );
}
