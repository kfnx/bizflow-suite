import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/lib/db';
import { accounts, sessions, users, verificationTokens } from '@/lib/db/schema';

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', {
          email: credentials?.email,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          console.log('Searching for user in database...');
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          console.log('Database query result:', user);

          if (!user.length) {
            console.log('User not found');
            return null;
          }

          const dbUser = user[0];

          if (!dbUser.isActive) {
            console.log('User is not active');
            return null;
          }

          console.log('Verifying password...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            dbUser.password,
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }

          console.log('Authentication successful for user:', dbUser.email);
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: `${dbUser.firstName} ${dbUser.lastName}`,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            role: dbUser.role || 'user',
            phone: dbUser.phone,
            avatar: dbUser.avatar,
            isAdmin: dbUser.isAdmin || false,
            branchId: dbUser.branchId,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.avatar = user.avatar;
        token.isAdmin = user.isAdmin;
        token.branchId = user.branchId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string | null;
        session.user.avatar = token.avatar as string | null;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.branchId = token.branchId as string | null;
      }
      return session;
    },
  },
};
