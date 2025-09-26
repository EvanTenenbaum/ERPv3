import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { generatePoPdf } from '@/lib/pdf/po'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try { requireRole(['SUPER_ADMIN','ACCOUNTING','SALES','READ_ONLY']) } catch { return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 }) }

  const po = await prisma.purchaseOrder.findUnique({ where: { id: params.id }, include: { items: true, vendor: true } })
  if (!po) return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 })

  const buf = generatePoPdf({
    id: po.id,
    vendorName: po.vendor?.companyName || po.vendorId,
    expectedAt: po.expectedAt ? new Date(po.expectedAt).toLocaleDateString() : undefined,
    status: po.status,
    items: po.items.map(it => ({ name: it.productId, qty: it.quantity, unitCostCents: it.unitCost }))
  })

  return new Response(buf, { status: 200, headers: { 'content-type': 'application/pdf' } })
}
