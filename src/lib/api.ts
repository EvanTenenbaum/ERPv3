export type APIError = { error: string; message?: string };

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  const contentType = res.headers.get('Content-Type') || '';
  const isJSON = contentType.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const err: APIError = typeof data === 'object' && data ? data : { error: 'unknown_error', message: String(data) };
    throw Object.assign(new Error(err.message || err.error || 'Request failed'), { status: res.status, data: err });
  }
  return data as T;
}

