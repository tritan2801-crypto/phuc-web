import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@core/context/AppContext'
import { AuthProvider } from '@core/context/AuthContext'
import Topbar from '@core/layout/Topbar'
import Header from '@core/layout/Header'
import SideCart from '@core/layout/SideCart'
import Footer from '@core/layout/Footer'
import WholesaleSidebars from '@core/layout/WholesaleSidebars'

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
          {/* Topbar: contacts, active branch, and B2B Agent toggle */}
          <Topbar />
          
          {/* Core Brand Header: Search engine suggestions and Cart indicators */}
          <Header />
          
          {/* Sticky Wholesale sidebars for desktop layout */}
          <WholesaleSidebars />
          
          {/* Page contents injection */}
          <div className="flex-1">
            {children}
          </div>
          
          {/* Global sliding interactive cart RFQ drawer */}
          <SideCart />
          
          {/* Standard 5-column trust footer */}
          <Footer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
