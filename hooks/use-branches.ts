'use client';

import { useQuery } from '@tanstack/react-query';

export type Branch = {
  id: string;
  name: string;
};

export type BranchesResponse = {
  data: Branch[];
};

const fetchBranches = async (): Promise<BranchesResponse> => {
  const response = await fetch('/api/branches');
  if (!response.ok) {
    throw new Error('Failed to fetch branches');
  }
  return response.json();
};

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
