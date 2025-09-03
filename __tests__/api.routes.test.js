/** @jest-environment node */

const { GET: getCustomers } = require('../src/app/api/customers/route.ts');

describe('API routes - ERPNext proxy', () => {
  const oldEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
  });
  afterAll(() => {
    process.env = oldEnv;
  });

  test('returns 503 when credentials missing', async () => {
    delete process.env.NEXTERP_HOST;
    const req = new Request('http://localhost/api/customers');
    const res = await getCustomers(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('nexterp_credentials_missing');
  });

  test('forwards response when credentials present', async () => {
    process.env.NEXTERP_HOST = 'https://example.com';
    process.env.NEXTERP_API_KEY = 'k';
    process.env.NEXTERP_API_SECRET = 's';
    global.fetch = jest.fn(async () => new Response(JSON.stringify({ data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    const req = new Request('http://localhost/api/customers');
    const res = await getCustomers(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data) || Array.isArray(json)).toBeTruthy();
  });
});

