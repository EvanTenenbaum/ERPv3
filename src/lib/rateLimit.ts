type Bucket = { tokens: number; lastRefill: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, opts?: { capacity?: number; refillPerSec?: number }): boolean {
  const capacity = opts?.capacity ?? 30; // 30 requests
  const refillPerSec = opts?.refillPerSec ?? 1; // 1 token/sec
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { tokens: capacity, lastRefill: now };
    buckets.set(key, b);
  }
  const delta = (now - b.lastRefill) / 1000;
  b.tokens = Math.min(capacity, b.tokens + delta * refillPerSec);
  b.lastRefill = now;
  if (b.tokens < 1) return false;
  b.tokens -= 1;
  return true;
}

export function ipFromHeaders(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

