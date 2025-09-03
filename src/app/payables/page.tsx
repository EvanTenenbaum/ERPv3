"use client";
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

type Invoice = { name: string; status?: string; posting_date?: string; due_date?: string; outstanding_amount?: number; supplier?: string };

function parseDate(s?: string) {
  return s ? new Date(s) : undefined;
}

export default function PayablesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tab, setTab] = useState<'open'|'soon'|'overdue'>('open');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [sortKey, setSortKey] = useState<'due_date'|'outstanding_amount'|'name'>('due_date');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');

  const { show } = useToast();

  async function load() {
    setLoading(true);
    try {
      const filters = encodeURIComponent(JSON.stringify([["Purchase Invoice","status","!=","Paid"]]));
      const data = await apiFetch<any>(`/api/purchase-invoices?filters=${filters}&limit_page_length=${pageSize}&limit_start=${page*pageSize}&order_by=${sortKey} ${sortDir}`);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setInvoices(list as Invoice[]);
    } catch (e) {
      console.error(e);
      show('Failed to load invoices', 'error');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page, sortKey, sortDir]);

  function toggleSort(key: 'due_date'|'outstanding_amount'|'name') {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  const arrow = (k: string) => sortKey === k ? (sortDir==='asc'?'↑':'↓') : '';

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
      show('Marked as Paid', 'success');
    } catch (e: any) {
      show(`Failed to mark paid: ${e?.data?.error || e.message}`, 'error');
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
      <div className="border rounded overflow-auto max-h-[70vh]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 cursor-pointer" onClick={()=>toggleSort('name')}>Invoice {arrow('name')}</th>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2 cursor-pointer" onClick={()=>toggleSort('due_date')}>Due Date {arrow('due_date')}</th>
              <th className="px-3 py-2 cursor-pointer" onClick={()=>toggleSort('outstanding_amount')}>Outstanding {arrow('outstanding_amount')}</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-2/3" /></td>
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-1/2" /></td>
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-1/3" /></td>
                  <td className="px-3 py-2"><div className="h-3 bg-gray-200 rounded w-1/4" /></td>
                  <td className="px-3 py-2"></td>
                </tr>
              ))
            ) : (
              filtered.map((inv, idx) => (
                <tr key={inv.name} className={`${idx%2?'bg-white':'bg-gray-50/50'}`}>
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
      <div className="mt-2 flex items-center gap-2">
        <button disabled={page===0 || loading} onClick={()=>setPage(p=>Math.max(0,p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="text-sm text-gray-600">Page {page+1}</span>
        <button disabled={invoices.length<pageSize || loading} onClick={()=>setPage(p=>p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
