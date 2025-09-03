"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Invoice = { name: string; status?: string; posting_date?: string; due_date?: string; outstanding_amount?: number; supplier?: string };

function parseDate(s?: string) {
  return s ? new Date(s) : undefined;
}

export default function PayablesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tab, setTab] = useState<'open'|'soon'|'overdue'>('open');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const filters = encodeURIComponent(JSON.stringify([["Purchase Invoice","status","!=","Paid"]]));
      const data = await apiFetch<any>(`/api/purchase-invoices?filters=${filters}&limit_page_length=50&order_by=due_date asc`);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setInvoices(list as Invoice[]);
    } catch (e) {
      console.error(e);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const now = new Date();
  const soonCutoff = new Date(); soonCutoff.setDate(now.getDate() + 7);

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const due = parseDate(inv.due_date);
      const paid = (inv.status || '').toLowerCase() === 'paid';
      if (paid) return false;
      if (tab === 'open') return true;
      if (!due) return false;
      if (tab === 'overdue') return due < now;
      if (tab === 'soon') return due >= now && due <= soonCutoff;
      return true;
    });
  }, [invoices, tab]);

  async function markPaid(name: string) {
    try {
      await apiFetch(`/api/purchase-invoices`, { method: 'POST', body: JSON.stringify({ action: 'mark_paid', id: name }) });
      await load();
      alert('Marked as Paid');
    } catch (e: any) {
      alert(`Failed to mark paid: ${e?.data?.error || e.message}`);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Payables</h1>
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1 rounded ${tab==='open'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('open')}>Open</button>
        <button className={`px-3 py-1 rounded ${tab==='soon'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('soon')}>Due Soon</button>
        <button className={`px-3 py-1 rounded ${tab==='overdue'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('overdue')}>Overdue</button>
      </div>
      <div className="border rounded overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">Invoice</th>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Due Date</th>
              <th className="px-3 py-2">Outstanding</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="px-3 py-3" colSpan={5}>Loading...</td></tr> : (
              filtered.map(inv => (
                <tr key={inv.name}>
                  <td className="px-3 py-2">{inv.name}</td>
                  <td className="px-3 py-2">{inv.supplier || '-'}</td>
                  <td className="px-3 py-2">{inv.due_date || '-'}</td>
                  <td className="px-3 py-2">{inv.outstanding_amount ?? '-'}</td>
                  <td className="px-3 py-2">
                    <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=>markPaid(inv.name)}>Mark as Paid</button>
                  </td>
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && <tr><td className="px-3 py-3" colSpan={5}>No invoices</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
