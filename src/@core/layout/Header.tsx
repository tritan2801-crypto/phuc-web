'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, UserCheck, ShieldAlert, Award } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { MOCK_PRODUCTS, Product } from '../constants/mock-data'
import MegaMenu from './MegaMenu'

export default function Header() {
  const { cart, setIsCartOpen, isB2b, toggleB2b } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const [showNavbar, setShowNavbar] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 40) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Generate real-time search suggestions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)

    if (val.trim().length > 1) {
      const filtered = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(val.toLowerCase()) ||
        p.brand.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
      setShowDropdown(true)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }

  const handleSuggestionClick = (productId: string) => {
    setShowDropdown(false)
    setSearchQuery('')
    router.push(`/products/${productId}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className={`bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-900 flex items-center justify-center text-accent-500 shadow-md group-hover:scale-105 transition-transform duration-300">
            <Award size={24} className="stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg lg:text-xl tracking-tight text-primary-900 leading-none group-hover:text-primary-500 transition-colors">
              KHANG PHÚC
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-none mt-1">
              Industrial Flooring
            </span>
          </div>
        </Link>

        {/* SEARCH BAR SYSTEM */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm máy mài, đĩa mài kim cương, sơn epoxy..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 text-sm pl-4 pr-10 py-2.5 rounded-full border border-slate-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 cursor-pointer">
              <Search size={18} />
            </button>
          </div>

          {/* Search Suggestion Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-slide-up">
              <div className="px-4 py-2 bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                Sản phẩm gợi ý tốt nhất
              </div>
              <div className="divide-y divide-slate-50">
                {suggestions.map(prod => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSuggestionClick(prod.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold overflow-hidden">
                      {prod.brand}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{prod.power ? `Công suất: ${prod.power}` : prod.brand}</p>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <span className="text-xs font-bold text-primary-500">
                        {(isB2b ? prod.agentPrice : prod.price).toLocaleString('vi-VN')} ₫
                      </span>
                      {isB2b && (
                        <span className="text-[9px] text-slate-400 line-through">
                          {prod.price.toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* RIGHT INTERACTION AREA */}
        <div className="flex items-center gap-4">
          {/* B2B Badge / Status Indicator */}
          <Link
            href="/agency"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-150 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
          >
            {isB2b ? (
              <>
                <UserCheck size={14} className="text-accent-500 animate-pulse" />
                <span className="font-semibold text-slate-800">Đại lý: Khang Phúc Hà Nội</span>
              </>
            ) : (
              <>
                <ShieldAlert size={14} className="text-slate-400" />
                <span>Quyền lợi Đại lý B2B</span>
              </>
            )}
          </Link>

          {/* Cart Icon trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-slate-600 hover:text-primary-500 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            aria-label="Xem giỏ hàng"
          >
            <ShoppingCart size={22} className="stroke-[1.75]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <MegaMenu />
    </header>
  )
}
