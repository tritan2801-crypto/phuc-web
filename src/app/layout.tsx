import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@core/context/AppContext'
import { AuthProvider } from '@core/context/AuthContext'
import ShopLayoutWrapper from '@core/layout/ShopLayoutWrapper'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Khang Phúc — Thiết Bị Mài Sàn & Hóa Chất Epoxy Chính Hãng',
  description: 'Nhà phân phối độc quyền máy mài sàn bê tông Karva, Kumisai, ASL, đĩa mài kim cương và chất tăng cứng Lithium Densifier chất lượng cao. Đầy đủ CO CQ, bàn giao trực tiếp tại công trình.',
  keywords: ['máy mài sàn', 'đĩa mài', 'sơn epoxy', 'đánh bóng sàn', 'chất tăng cứng', 'Khang Phúc'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-accent-500 selection:text-primary-900">
        <AuthProvider>
          <AppProvider>
            <ShopLayoutWrapper>
              {children}
            </ShopLayoutWrapper>
          </AppProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
