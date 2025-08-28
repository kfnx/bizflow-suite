'use client';

import { useQuery } from '@tanstack/react-query';

export type SummaryCountItem = {
  total: number;
  byStatus: Record<string, number>;
};

export type SummaryCountsData = {
  quotations: SummaryCountItem;
  invoices: SummaryCountItem;
  deliveryNotes: SummaryCountItem;
  products: SummaryCountItem;
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
