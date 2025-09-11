import { DefaultSession } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string | null;
      phone: string | null;
      avatar: string | null;
      isAdmin: boolean;
      branchId: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    firstName: string;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
    branchId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    firstName: string;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
    branchId: string | null;
  }
}
