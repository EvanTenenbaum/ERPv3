"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

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
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [sortKey, setSortKey] = useState<'customer_name'|'customer_type'|'territory'>('customer_name');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');

  const { show } = useToast();

  async function loadCustomers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        // Try a basic ERPNext filter by name
        const filters = JSON.stringify([["Customer","customer_name","like",`%${query.trim()}%`]]);
        params.set('filters', filters);
      }
      params.set('limit_page_length', String(pageSize));
      params.set('limit_start', String(page * pageSize));
      params.set('order_by', `${sortKey} ${sortDir}`);
      const data = await apiFetch<any>(`/api/customers?${params.toString()}`);
      setCustomers(normalizeList<Customer>(data));
    } catch (e: any) {
      console.error(e);
      show(`Failed to load customers${e?.data?.error?`: ${e.data.error}`:''}`, 'error');
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
  }, [query, page, sortKey, sortDir]);

  function toggleSort(key: 'customer_name'|'customer_type'|'territory') {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const arrow = (key: string) => sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '';

  useEffect(() => {
    async function loadOrders() {
      if (!selected) return setOrders([]);
      try {
        const filters = encodeURIComponent(JSON.stringify([["Sales Order","customer","=",selected.customer_name || selected.name]]));
        const data = await apiFetch<any>(`/api/sales-orders?filters=${filters}&limit_page_length=5&order_by=transaction_date desc`);
        setOrders(normalizeList<SalesOrder>(data));
      } catch (e: any) {
        console.error(e);
        show(`Failed to load recent orders${e?.data?.error?`: ${e.data.error}`:''}`, 'error');
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
      <div className="mb-2 flex items-center gap-2">
        <button disabled={page===0 || loading} onClick={()=>setPage(p=>Math.max(0,p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="text-sm text-gray-600">Page {page+1}</span>
        <button disabled={customers.length<pageSize || loading} onClick={()=>setPage(p=>p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
      <div className="overflow-auto border rounded max-h-[70vh]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 cursor-pointer select-none" onClick={()=>toggleSort('customer_name')}>Name {arrow('customer_name')}</th>
              <th className="px-3 py-2 cursor-pointer select-none" onClick={()=>toggleSort('customer_type')}>Type {arrow('customer_type')}</th>
              <th className="px-3 py-2 cursor-pointer select-none" onClick={()=>toggleSort('territory')}>Territory {arrow('territory')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-2/3" /></td>
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-1/2" /></td>
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-1/3" /></td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td className="px-3 py-3" colSpan={3}>No customers</td></tr>
            ) : (
              customers.map((c, idx) => (
                <tr key={c.name} className={`cursor-pointer ${idx % 2 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50`} onClick={() => setSelected(c)}>
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
