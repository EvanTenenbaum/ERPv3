'use client';

import { useEffect, useState } from 'react';
import { createPriceBook, createPriceBookEntry, getPriceBooks, setPriceBookActive } from '@/actions/priceBooks';
import { getProducts } from '@/actions/inventory';
import { getCustomersForDropdown } from '@/actions/customers';

interface ProductOpt { id: string; name: string; }
interface CustomerOpt { id: string; companyName: string; }

export default function PriceBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductOpt[]>([]);
  const [customers, setCustomers] = useState<CustomerOpt[]>([]);

  const [bookForm, setBookForm] = useState({ name: '', type: 'GLOBAL', customerId: '' });
  const [entryForm, setEntryForm] = useState({ priceBookId: '', productId: '', unitPrice: '', effectiveDate: '' });
  const [overrideForm, setOverrideForm] = useState({ productId: '', unitPrice: '', reason: '' });

  useEffect(() => {
    (async () => {
      const pb = await getPriceBooks();
      if (pb.success) setBooks(pb.books);
      const prods = await getProducts();
      if (prods.success) setProducts(prods.products.map((p: any) => ({ id: p.id, name: `${p.sku} – ${p.name}` })));
      const cust = await getCustomersForDropdown();
      if (cust.success) setCustomers(cust.customers);
    })();
  }, []);

  const submitBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = {
      name: bookForm.name,
      type: bookForm.type as any,
      isActive: true,
    };
    if (bookForm.type === 'CUSTOMER' && bookForm.customerId) data.customerId = bookForm.customerId;
    const res = await createPriceBook(data);
    if (res.success) {
      const pb = await getPriceBooks();
      if (pb.success) setBooks(pb.books);
      setBookForm({ name: '', type: 'GLOBAL', customerId: '' });
    }
  };

  const submitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createPriceBookEntry({
      priceBookId: entryForm.priceBookId,
      productId: entryForm.productId,
      unitPrice: Math.round(Number(entryForm.unitPrice)),
      effectiveDate: entryForm.effectiveDate ? new Date(entryForm.effectiveDate) : undefined,
    });
    if (res.success) {
      const pb = await getPriceBooks();
      if (pb.success) setBooks(pb.books);
      setEntryForm({ priceBookId: '', productId: '', unitPrice: '', effectiveDate: '' });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await setPriceBookActive(id, !isActive);
    const pb = await getPriceBooks();
    if (pb.success) setBooks(pb.books);
  };

  const submitOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideForm.productId) return;
    const resp = await fetch('/api/overrides/global', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: overrideForm.productId,
        unitPrice: Math.round(Number(overrideForm.unitPrice)),
        reason: overrideForm.reason || 'Manual global override',
      }),
    })
    const res = await resp.json().catch(()=>({ success:false }))
    if (res.success) {
      const pb = await getPriceBooks();
      if (pb.success) setBooks(pb.books);
      setOverrideForm({ productId: '', unitPrice: '', reason: '' });
    } else {
      alert(res.error || 'Failed to apply override');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Price Books</h1>
        <p className="text-gray-600">Manage customer/global pricing and entries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submitBook} className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Create Price Book</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={bookForm.name} onChange={e=>setBookForm({...bookForm,name:e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={bookForm.type} onChange={e=>setBookForm({...bookForm,type:e.target.value})}>
              <option value="GLOBAL">GLOBAL</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          </div>
          {bookForm.type === 'CUSTOMER' && (
            <div>
              <label className="block text-sm font-medium mb-1">Customer</label>
              <select className="w-full border rounded px-3 py-2" value={bookForm.customerId} onChange={e=>setBookForm({...bookForm,customerId:e.target.value})} required>
                <option value="">Select customer…</option>
                {customers.map(c=> (<option key={c.id} value={c.id}>{c.companyName}</option>))}
              </select>
            </div>
          )}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
        </form>

        <form onSubmit={submitEntry} className="bg-white shadow rounded-lg p-6 space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Create Price Book Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price Book</label>
              <select className="w-full border rounded px-3 py-2" value={entryForm.priceBookId} onChange={e=>setEntryForm({...entryForm,priceBookId:e.target.value})} required>
                <option value="">Select…</option>
                {books.map(b=> (<option key={b.id} value={b.id}>{b.name} ({b.type})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <select className="w-full border rounded px-3 py-2" value={entryForm.productId} onChange={e=>setEntryForm({...entryForm,productId:e.target.value})} required>
                <option value="">Select…</option>
                {products.map(p=> (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit Price (cents)</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={entryForm.unitPrice} onChange={e=>setEntryForm({...entryForm,unitPrice:e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Effective Date</label>
              <input type="date" className="w-full border rounded px-3 py-2" value={entryForm.effectiveDate} onChange={e=>setEntryForm({...entryForm,effectiveDate:e.target.value})} />
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Entry</button>
        </form>

        <form onSubmit={submitOverride} className="bg-white shadow rounded-lg p-6 space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Quick Global Override</h2>
          <p className="text-sm text-gray-600">Creates/updates a global override price for a product effective immediately and logs an audit.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Product</label>
              <select className="w-full border rounded px-3 py-2" value={overrideForm.productId} onChange={e=>setOverrideForm({...overrideForm,productId:e.target.value})} required>
                <option value="">Select…</option>
                {products.map(p=> (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit Price (cents)</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={overrideForm.unitPrice} onChange={e=>setOverrideForm({...overrideForm,unitPrice:e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input className="w-full border rounded px-3 py-2" value={overrideForm.reason} onChange={e=>setOverrideForm({...overrideForm,reason:e.target.value})} placeholder="e.g., competitive match" />
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Apply Override</button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Effective Pricing Inspector</h2>
        <p className="text-sm text-gray-600 mb-3">Query effective price for a product by optional customer/role precedence.</p>
        {/* Lightweight ID-based inspector to avoid heavy dropdown queries */}
        <div className="mb-6">
          {/* @ts-expect-error Client Component */}
          {(await import('../../components/price-books/EffectiveInspector')).default()}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Existing Price Books</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map(b=> (
                <tr key={b.id}>
                  <td className="px-4 py-2">{b.name}</td>
                  <td className="px-4 py-2">{b.type}{b.customer ? ` – ${b.customer.companyName}`: ''}</td>
                  <td className="px-4 py-2">{b.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">
                    <button onClick={()=>toggleActive(b.id, b.isActive)} className="text-blue-600 hover:text-blue-800">
                      {b.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
