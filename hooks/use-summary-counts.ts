'use client';

import { useQuery } from '@tanstack/react-query';

export type SummaryCountsData = {
  quotations: number;
  invoices: number;
  deliveryNotes: number;
  products: number;
};

const fetchSummaryCounts = async (): Promise<{ data: SummaryCountsData }> => {
  const response = await fetch('/api/summary-counts');
  if (!response.ok) {
    throw new Error('Failed to fetch summary counts');
  }
  return response.json();
};

export function useSummaryCounts() {
  return useQuery({
    queryKey: ['summary-counts'],
    queryFn: fetchSummaryCounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}