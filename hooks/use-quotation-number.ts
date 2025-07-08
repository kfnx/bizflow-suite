import { useQuery } from '@tanstack/react-query';

async function fetchQuotationNumber(): Promise<string> {
  const baseUrl =
    process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/quotations/preview-number`, {
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
