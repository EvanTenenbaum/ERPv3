// Server-only helpers for ERPNext forwarding

export type ERPEnv = {
  host: string;
  apiKey: string;
  apiSecret: string;
};

export function readERPEnv(): ERPEnv | null {
  const host = process.env.NEXTERP_HOST;
  const apiKey = process.env.NEXTERP_API_KEY;
  const apiSecret = process.env.NEXTERP_API_SECRET;
  if (!host || !apiKey || !apiSecret) return null;
  return { host, apiKey, apiSecret };
}

export function buildERPUrl(host: string, path: string, search?: URLSearchParams) {
  const base = host.endsWith('/') ? host.slice(0, -1) : host;
  const u = new URL(path.startsWith('/') ? path : `/${path}`, base);
  if (search) {
    for (const [k, v] of search.entries()) u.searchParams.append(k, v);
  }
  return u.toString();
}

export async function erpFetch(
  env: ERPEnv,
  path: string,
  init?: RequestInit & { searchParams?: URLSearchParams }
): Promise<Response> {
  const url = buildERPUrl(env.host, path, init?.searchParams);
  const { searchParams, headers, ...rest } = init || {};
  const hdrs = new Headers(headers);
  hdrs.set('Authorization', `token ${env.apiKey}:${env.apiSecret}`);
  hdrs.set('Content-Type', hdrs.get('Content-Type') || 'application/json');
  return fetch(url, { ...rest, headers: hdrs, cache: 'no-store' });
}

export function resourcePath(resource: string, name?: string) {
  const encoded = encodeURIComponent(resource);
  return name
    ? `/api/resource/${encoded}/${encodeURIComponent(name)}`
    : `/api/resource/${encoded}`;
}

