import { NextResponse } from 'next/server';
import { erpFetch, readERPEnv, resourcePath } from '@/lib/server/erpnext';

export async function GET(req: Request) {
  const env = readERPEnv();
  if (!env) return NextResponse.json({ error: 'nexterp_credentials_missing' }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const path = resourcePath('Purchase Invoice');
  try {
    const res = await erpFetch(env, path, { method: 'GET', searchParams });
    const text = await res.text();
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
  } catch (e) {
    return NextResponse.json({ error: 'nexterp_unreachable' }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const env = readERPEnv();
  if (!env) return NextResponse.json({ error: 'nexterp_credentials_missing' }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const { id, action } = body || {};
  if (action === 'mark_paid' && id) {
    // Attempt to mark the invoice as paid in ERPNext by updating the doc
    // Implementers may need to adjust fields depending on their workflow
    const payload = { status: 'Paid' } as any;
    try {
      const res = await erpFetch(env, resourcePath('Purchase Invoice', String(id)), {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      return new NextResponse(text, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
    } catch (e) {
      return NextResponse.json({ error: 'nexterp_unreachable' }, { status: 503 });
    }
  }

  return NextResponse.json({ error: 'unsupported_action' }, { status: 400 });
}
