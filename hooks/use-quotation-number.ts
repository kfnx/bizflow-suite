import { useQuery } from '@tanstack/react-query';

async function fetchQuotationNumber(): Promise<string> {
  const response = await fetch(`/api/quotations/latest-number`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quotation number');
  }

  const data = await response.json();
  return data.data.quotationNumber;
}

export function useQuotationNumber() {
  return useQuery({
    queryKey: ['quotation-number'],
    queryFn: fetchQuotationNumber,
    staleTime: 0, // Always fetch fresh number
    gcTime: 0, // Don't cache
  });
}
