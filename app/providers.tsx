'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as StateProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <SessionProvider>
      <StateProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </StateProvider>
    </SessionProvider>
  );
};
