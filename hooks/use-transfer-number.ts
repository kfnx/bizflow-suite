import { useQuery } from '@tanstack/react-query';

async function fetchTransferNumber(): Promise<string> {
  const response = await fetch(`/api/transfers/latest-number`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transfer number');
  }

  const data = await response.json();
  return data.data.transferNumber;
}

export function useTransferNumber() {
  return useQuery({
    queryKey: ['transfer-number'],
    queryFn: fetchTransferNumber,
    staleTime: 0, // Always fetch fresh number
    gcTime: 0, // Don't cache
  });
}
