import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authConfig as any);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user: session.user || null });
}
