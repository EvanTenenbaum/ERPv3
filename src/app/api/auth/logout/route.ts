import { NextResponse } from 'next/server';

// Invalidate NextAuth session cookies by expiring them
export async function POST() {
  const res = NextResponse.json({ ok: true });
  // NextAuth cookie names for JWT sessions
  const cookies = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
  ];
  const expires = new Date(0).toUTCString();
  for (const name of cookies) {
    res.headers.append('Set-Cookie', `${name}=; Path=/; Expires=${expires}; HttpOnly; SameSite=Lax`);
  }
  return res;
}

