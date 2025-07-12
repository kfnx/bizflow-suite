import { DefaultSession } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string | null;
      phone: string | null;
      avatar: string | null;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
  }
}
