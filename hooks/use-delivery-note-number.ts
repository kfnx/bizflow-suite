import { useQuery } from '@tanstack/react-query';

async function fetchDeliveryNoteNumber(): Promise<string> {
  const response = await fetch(`/api/delivery-notes/latest-number`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch delivery note number');
  }

  const data = await response.json();
  return data.data.deliveryNumber;
}

export function useDeliveryNoteNumber() {
  return useQuery({
    queryKey: ['delivery-note-number'],
    queryFn: fetchDeliveryNoteNumber,
    staleTime: 0, // Always fetch fresh number
    gcTime: 0, // Don't cache
  });
}
