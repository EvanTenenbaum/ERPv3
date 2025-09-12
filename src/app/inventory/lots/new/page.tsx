import Link from 'next/link'

export default function NewInventoryLotPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Inventory Lot</h1>
          <p className="text-gray-600">Create a new inventory lot for a received batch.</p>
        </div>
        <Link
          href="/inventory/lots"
          className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back to Lots
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-gray-700 space-y-3">
          <p>This is a stub page to unblock navigation and testing.</p>
          <p>
            In M2 we will wire this form to create an inventory lot with fields like
            quantity, allocation, and batch selection.
          </p>
        </div>
      </div>
    </div>
  )
}

