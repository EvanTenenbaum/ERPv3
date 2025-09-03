"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

type SalesOrder = { name: string; status?: string; transaction_date?: string };
type SalesOrderDoc = SalesOrder & { items?: Array<{ item_code: string; item_name?: string; qty?: number; rate?: number; amount?: number }>; customer?: string };

export default function SalesPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [selected, setSelected] = useState<SalesOrderDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { show } = useToast();

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<any>(`/api/sales-orders?limit_page_length=${pageSize}&limit_start=${page*pageSize}&order_by=transaction_date desc`);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setOrders(list as SalesOrder[]);
    } catch (e: any) {
      console.error(e);
      show(`Failed to load orders${e?.data?.error?`: ${e.data.error}`:''}`, 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrder(name: string) {
    try {
      const doc = await apiFetch<any>(`/api/sales-orders?id=${encodeURIComponent(name)}`);
      setSelected((doc?.data || doc) as SalesOrderDoc);
    } catch (e: any) {
      console.error(e);
      show(`Failed to load order ${name}${e?.data?.error?`: ${e.data.error}`:''}`, 'error');
    }
  }

  useEffect(() => { load(); }, [page]);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Sales Orders</h1>
        <div className="mb-2 flex items-center gap-2">
          <button disabled={page===0 || loading} onClick={()=>setPage(p=>Math.max(0,p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="text-sm text-gray-600">Page {page+1}</span>
          <button disabled={orders.length<pageSize || loading} onClick={()=>setPage(p=>p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
        <div className="border rounded overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td className="px-3 py-3" colSpan={3}>Loading...</td></tr> : (
                orders.map(o => (
                  <tr key={o.name} className="hover:bg-gray-50 cursor-pointer" onClick={()=>loadOrder(o.name)}>
                    <td className="px-3 py-2">{o.name}</td>
                    <td className="px-3 py-2">{o.transaction_date || '-'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        o.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        o.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                        o.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>{o.status || 'Unknown'}</span>
                    </td>
                  </tr>
                ))
              )}
              {!loading && orders.length === 0 && <tr><td className="px-3 py-3" colSpan={3}>No orders</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:col-span-1">
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        {!selected ? (
          <div className="text-sm text-gray-500">Select an order to view items.</div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm">
              <div><span className="text-gray-500">Order:</span> {selected.name}</div>
              <div><span className="text-gray-500">Customer:</span> {selected.customer || '-'}</div>
              <div><span className="text-gray-500">Date:</span> {selected.transaction_date || '-'}</div>
            </div>
            <div className="border rounded overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((it, idx) => (
                    <tr key={`${it.item_code}-${idx}`}>
                      <td className="px-3 py-2">{it.item_name || it.item_code}</td>
                      <td className="px-3 py-2">{it.qty ?? '-'}</td>
                      <td className="px-3 py-2">{it.rate ?? '-'}</td>
                    </tr>
                  ))}
                  {(!selected.items || selected.items.length === 0) && <tr><td className="px-3 py-3" colSpan={3}>No items</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
