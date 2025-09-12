import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/hooks/useCart'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <NavBar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
