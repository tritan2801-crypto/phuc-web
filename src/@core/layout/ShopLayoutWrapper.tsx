'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Topbar from './Topbar'
import Header from './Header'
import SideCart from './SideCart'
import Footer from './Footer'
import WholesaleSidebars from './WholesaleSidebars'

export default function ShopLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Detect if current route is an admin page (starts with /admin)
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
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
    </>
  )
}
