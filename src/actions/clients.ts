'use server'

import prisma from '@/lib/prisma'
import * as Sentry from '@sentry/nextjs'
import { revalidatePath } from 'next/cache'

export interface CreateClientInput {
  name: string
  contactInfo?: { email?: string; phone?: string; address?: string; contactPerson?: string }
  asCustomer?: boolean
  asVendor?: boolean
  customer?: { companyName?: string; creditLimitCents?: number; paymentTerms?: string }
  vendor?: { vendorCode: string; companyName?: string }
}

export async function getClients() {
  try {
    const parties = await prisma.party.findMany({
      where: { isActive: true },
      include: {
        customers: {
          where: { isActive: true },
          select: { id: true, companyName: true, paymentTerms: true, creditLimit: true },
          take: 1,
        },
        vendors: {
          where: { isActive: true },
          select: { id: true, vendorCode: true, companyName: true },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    })
    const rows = parties.map(p => ({
      id: p.id,
      name: p.name,
      isCustomer: p.isCustomer,
      isVendor: p.isVendor,
      customer: p.customers[0] || null,
      vendor: p.vendors[0] || null,
    }))
    return { success: true, clients: rows }
  } catch (e) {
    console.error('getClients failed', e)
    Sentry.captureException(e)
    return { success: false, error: 'failed_clients_list' }
  }
}

export async function createClient(input: CreateClientInput) {
  try {
    const party = await prisma.$transaction(async (tx) => {
      const party = await tx.party.create({
        data: {
          name: input.name,
          isCustomer: !!input.asCustomer,
          isVendor: !!input.asVendor,
          isActive: true,
          contactInfo: (input.contactInfo || {}) as any,
        }
      })

      if (input.asCustomer) {
        await tx.customer.create({
          data: {
            companyName: input.customer?.companyName || input.name,
            contactInfo: (input.contactInfo || {}) as any,
            creditLimit: input.customer?.creditLimitCents,
            paymentTerms: input.customer?.paymentTerms,
            isActive: true,
            partyId: party.id,
          }
        })
      }

      if (input.asVendor) {
        const code = input.vendor?.vendorCode?.trim()
        if (!code) throw new Error('vendor_code_required')
        await tx.vendor.create({
          data: {
            vendorCode: code,
            companyName: input.vendor?.companyName || input.name,
            contactInfo: (input.contactInfo || {}) as any,
            isActive: true,
            partyId: party.id,
          }
        })
      }

      return party
    })

    revalidatePath('/clients')
    return { success: true, id: party.id }
  } catch (e: any) {
    const msg = e?.message === 'vendor_code_required' ? 'vendor_code_required' : 'failed_create_client'
    Sentry.captureException(e)
    return { success: false, error: msg }
  }
}
