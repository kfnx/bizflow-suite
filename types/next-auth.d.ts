import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string | null;
      role: string;
      phone: string | null;
      avatar: string | null;
      isAdmin: boolean;
      branchId: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string | null;
    role: string;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
    branchId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
    branchId: string | null;
  }
}
