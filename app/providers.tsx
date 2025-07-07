'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as StateProvider } from 'jotai';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <StateProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position='top-right' richColors />
        </QueryClientProvider>
      </StateProvider>
    </SessionProvider>
  );
};
