/** @jest-environment node */

const items = require('../src/app/api/items/route.ts');
const so = require('../src/app/api/sales-orders/route.ts');
const pi = require('../src/app/api/purchase-invoices/route.ts');

describe('API routes missing creds', () => {
  const oldEnv = process.env;
  beforeEach(() => { process.env = { ...oldEnv }; delete process.env.NEXTERP_HOST; });
  afterAll(() => { process.env = oldEnv; });

  test('items 503', async () => {
    const res = await items.GET(new Request('http://x/api/items'));
    expect(res.status).toBe(503);
  });
  test('sales-orders 503', async () => {
    const res = await so.GET(new Request('http://x/api/sales-orders'));
    expect(res.status).toBe(503);
  });
  test('purchase-invoices 503', async () => {
    const res = await pi.GET(new Request('http://x/api/purchase-invoices'));
    expect(res.status).toBe(503);
  });
});

