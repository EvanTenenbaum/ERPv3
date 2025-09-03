"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/customers', label: 'Customers' },
  { href: '/sales', label: 'Sales Orders' },
  { href: '/payables', label: 'Payables' },
  { href: '/quotes', label: 'Quotes' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/search', label: 'Search' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:block w-60 shrink-0 border-r bg-white">
      <div className="p-3 text-xs uppercase tracking-wider text-gray-500">Navigation</div>
      <nav className="px-2 pb-4 space-y-1">
        {links.map((l) => {
          const active = pathname?.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={`block px-3 py-2 rounded hover:bg-gray-50 ${active ? 'bg-gray-100 font-medium' : ''}`}>
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

