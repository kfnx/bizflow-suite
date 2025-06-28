'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'jotai';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider>{children}</Provider>
    </SessionProvider>
  );
};
