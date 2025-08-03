import { useQuery } from '@tanstack/react-query';

async function fetchInvoiceNumber(): Promise<string> {
  const response = await fetch(`/api/invoices/preview-number`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch invoice number');
  }

  const data = await response.json();
  return data.data.invoiceNumber;
}

export function useInvoiceNumber() {
  return useQuery({
    queryKey: ['invoice-number'],
    queryFn: fetchInvoiceNumber,
    staleTime: 0, // Always fetch fresh number
    gcTime: 0, // Don't cache
  });
}