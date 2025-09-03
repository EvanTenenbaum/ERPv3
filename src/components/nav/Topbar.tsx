"use client";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Topbar() {
  const { data } = useSession();
  const user = data?.user;
  return (
    <header className="h-12 border-b bg-white flex items-center justify-between px-3">
      <div className="flex items-center gap-3">
        <Link href="/" className="font-semibold">ERP</Link>
        <nav className="hidden md:flex items-center gap-3 text-sm text-gray-600">
          <Link href="/customers" className="hover:text-black">Customers</Link>
          <Link href="/sales" className="hover:text-black">Sales</Link>
          <Link href="/payables" className="hover:text-black">Payables</Link>
          <Link href="/quotes" className="hover:text-black">Quotes</Link>
          <Link href="/inventory" className="hover:text-black">Inventory</Link>
          <Link href="/search" className="hover:text-black">Search</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">{user?.name || 'Signed in'}</span>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="px-2 py-1 border rounded">Logout</button>
      </div>
    </header>
  );
}

