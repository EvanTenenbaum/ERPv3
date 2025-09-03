import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const u = process.env.AUTH_USER || 'admin';
        const p = process.env.AUTH_PASS || 'admin';
        if (credentials?.username === u && credentials?.password === p) {
          return { id: '1', name: u } as any;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
};

