import { DefaultSession } from 'next-auth';
import { DefaultJWT, JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      avatar: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
  }
}
