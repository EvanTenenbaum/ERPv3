import { redirect } from 'next/navigation'

export default function BatchesRedirect() {
  redirect('/inventory/products')
}
