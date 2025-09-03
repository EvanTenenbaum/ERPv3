import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/hooks/useCart'
import { ToastProvider } from '@/components/ui/Toast'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ERPv2 - Enterprise Resource Planning',
  description: 'Modern ERP system built with Next.js 14, TypeScript, and Prisma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const AppShell = dynamic(() => import('@/components/shell/AppShell'), { ssr: false });
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
