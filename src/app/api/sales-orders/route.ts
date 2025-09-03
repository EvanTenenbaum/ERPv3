import { NextResponse } from 'next/server';
import { erpFetch, readERPEnv, resourcePath } from '@/lib/server/erpnext';

export async function GET(req: Request) {
  const env = readERPEnv();
  if (!env) return NextResponse.json({ error: 'nexterp_credentials_missing' }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || undefined;
  const path = resourcePath('Sales Order', id || undefined);
  if (id) searchParams.delete('id');
  try {
    const res = await erpFetch(env, path, { method: 'GET', searchParams });
    const text = await res.text();
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
  } catch (e) {
    return NextResponse.json({ error: 'nexterp_unreachable' }, { status: 503 });
  }
}
