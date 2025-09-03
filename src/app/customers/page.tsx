"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

type ERPList<T> = { data?: T[] } | T[];
type Customer = { name: string; customer_name?: string; customer_type?: string; territory?: string };
type SalesOrder = { name: string; status?: string; transaction_date?: string; grand_total?: number };

function normalizeList<T>(payload: ERPList<T>): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray((payload as any).data)) return (payload as any).data as T[];
  return [];
}

export default function CustomersPage() {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  async function loadCustomers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        // Try a basic ERPNext filter by name
        const filters = JSON.stringify([["Customer","customer_name","like",`%${query.trim()}%`]]);
        params.set('filters', filters);
      }
      params.set('limit_page_length', '20');
      const data = await apiFetch<any>(`/api/customers?${params.toString()}`);
      setCustomers(normalizeList<Customer>(data));
    } catch (e) {
      console.error(e);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(loadCustomers, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    async function loadOrders() {
      if (!selected) return setOrders([]);
      try {
        const filters = encodeURIComponent(JSON.stringify([["Sales Order","customer","=",selected.customer_name || selected.name]]));
        const data = await apiFetch<any>(`/api/sales-orders?filters=${filters}&limit_page_length=5&order_by=transaction_date desc`);
        setOrders(normalizeList<SalesOrder>(data));
      } catch (e) {
        console.error(e);
        setOrders([]);
      }
    }
    loadOrders();
  }, [selected]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="border rounded px-3 py-2 w-full max-w-md"
        />
      </div>
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Territory</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={3}>Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td className="px-3 py-3" colSpan={3}>No customers</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.name} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c)}>
                  <td className="px-3 py-2">{c.customer_name || c.name}</td>
                  <td className="px-3 py-2">{c.customer_type || '-'}</td>
                  <td className="px-3 py-2">{c.territory || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30" onClick={() => setSelected(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{selected.customer_name || selected.name}</h2>
              <button className="text-gray-600" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="space-y-1 text-sm mb-6">
              <div><span className="text-gray-500">Name:</span> {selected.name}</div>
              <div><span className="text-gray-500">Type:</span> {selected.customer_type || '-'}</div>
              <div><span className="text-gray-500">Territory:</span> {selected.territory || '-'}</div>
            </div>
            <h3 className="font-medium mb-2">Recent Sales Orders</h3>
            <div className="border rounded overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-3 py-2">Order</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.name}>
                      <td className="px-3 py-2">{o.name}</td>
                      <td className="px-3 py-2">{o.status || '-'}</td>
                      <td className="px-3 py-2">{o.transaction_date || '-'}</td>
                      <td className="px-3 py-2">{o.grand_total ?? '-'}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td className="px-3 py-2" colSpan={4}>No recent orders</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
