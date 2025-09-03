import Link from 'next/link'

export default function Home() {
  const tiles = [
    { href: '/customers', title: 'Customers', desc: 'Search customers and view recent orders.' },
    { href: '/sales', title: 'Sales Orders', desc: 'Review and track order status.' },
    { href: '/payables', title: 'Payables', desc: 'Monitor due and overdue invoices.' },
    { href: '/inventory', title: 'Inventory', desc: 'Batches, lots, and products.' },
    { href: '/quotes', title: 'Quotes', desc: 'Create and manage sales quotes.' },
    { href: '/search', title: 'Search', desc: 'Find products, customers, and quotes.' },
  ]
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-1">Welcome</h1>
      <p className="text-sm text-gray-600 mb-4">Quick links to key workflows</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map(t => (
          <Link key={t.href} href={t.href} className="rounded border p-4 hover:bg-gray-50">
            <div className="text-lg font-medium">{t.title}</div>
            <div className="text-sm text-gray-600">{t.desc}</div>
            <div className="text-xs text-blue-700 mt-2">Go to {t.title} →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
