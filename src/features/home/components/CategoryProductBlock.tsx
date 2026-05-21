'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, Check, ChevronRight, Settings, Percent } from 'lucide-react'
import { PexelsImage } from '@core/ui/PexelsImage'
import { useApp } from '@core/context/AppContext'
import { MOCK_PRODUCTS, Product } from '@core/constants/mock-data'

type TabOption = 'may-mai' | 'may-ve-sinh' | 'dia-mai' | 'tools' | 'chat-tang-cung' | 'son-pu' | 'son-epoxy' | 'nguyen-lieu-phu-gia'

export default function CategoryProductBlock() {
  const { addToCart, setIsCartOpen, isB2b } = useApp()
  const [activeTab, setActiveTab] = useState<TabOption>('may-mai')
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  // Filter products based on active tab
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (activeTab === 'may-mai') return p.subCategory === 'may-mai-san'
    if (activeTab === 'may-ve-sinh') return p.subCategory === 'may-hut-bui' || p.subCategory === 'may-cha-san'
    if (activeTab === 'dia-mai') return p.category === 'dia-mai' || p.subCategory === 'dia-mai-be-tong' || p.subCategory === 'dia-danh-bong'
    if (activeTab === 'tools') return p.subCategory === 'tools'
    if (activeTab === 'chat-tang-cung') return p.subCategory === 'chat-tang-cung'
    if (activeTab === 'son-pu') return p.subCategory === 'son-pu'
    if (activeTab === 'son-epoxy') return p.subCategory === 'son-epoxy'
    if (activeTab === 'nguyen-lieu-phu-gia') return p.subCategory === 'nguyen-lieu-phu-gia'
    return true
  })

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      agentPrice: product.agentPrice,
      image: product.image
    }, 1)

    // Trigger local card check animation
    setAddedItems(prev => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  const tabs: { value: TabOption; label: string }[] = [
    { value: 'may-mai', label: 'MÁY MÀI SÀN' },
    { value: 'may-ve-sinh', label: 'MÁY VỆ SINH' },
    { value: 'dia-mai', label: 'ĐĨA MÀI' },
    { value: 'tools', label: 'DỤNG CỤ THI CÔNG' },
    { value: 'chat-tang-cung', label: 'CHẤT TĂNG CỨNG' },
    { value: 'son-pu', label: 'SƠN SÀN PU' },
    { value: 'son-epoxy', label: 'SƠN SÀN EPOXY' },
    { value: 'nguyen-lieu-phu-gia', label: 'NGUYÊN LIỆU & PHỤ GIA' }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="text-center space-y-2 mb-8">
        <span className="text-accent-600 text-xs font-bold uppercase tracking-wider block">Danh Mục Thiết Bị Vật Tư</span>
        <h2 className="font-heading font-black text-2xl text-slate-800 tracking-tight">
          Thiết Bị Thi Công & Vật Tư Đánh Bóng Sàn
        </h2>
        
        {/* TABS SELECTOR */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full font-heading font-extrabold text-[10px] tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-primary-900 text-accent-500 shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 7).map((prod) => {
          const priceToShow = isB2b ? prod.agentPrice : prod.price
          const savings = prod.price - prod.agentPrice

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-150 shadow-sm hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Product Card Image */}
              <Link href={`/products/${prod.id}`} className="block relative h-48 bg-slate-50 overflow-hidden">
                <PexelsImage query={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {/* Out of stock overlay */}
                {!prod.inStock && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs font-bold uppercase">
                    Hết hàng tạm thời
                  </div>
                )}

                {/* Subcategory tag */}
                <div className="absolute top-3 left-3 bg-primary-900/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow">
                  {prod.brand}
                </div>

                {/* NEW/VỪA VỀ KHO Badge */}
                {prod.badge && (
                  <div className={`absolute top-3 right-3 font-bold text-[9.5px] uppercase px-2 py-0.5 rounded-md shadow text-white tracking-wider ${
                    prod.badge === 'NEW'
                      ? 'bg-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.4)] animate-pulse'
                      : 'bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.4)]'
                  }`}>
                    {prod.badge}
                  </div>
                )}
              </Link>

              {/* Product Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {prod.subCategory === 'may-mai-san' ? 'MÁY MÀI SÀN' : prod.subCategory === 'may-hut-bui' ? 'MÁY HÚT BỤI' : 'VẬT TƯ ĐÁNH BÓNG'}
                  </span>
                  <Link href={`/products/${prod.id}`} className="block">
                    <h3 className="font-heading font-bold text-xs md:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
                      {prod.name}
                    </h3>
                  </Link>

                  {/* Tiny specifications sheet */}
                  {prod.power && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium bg-slate-50 py-1 px-2.5 rounded">
                      <Settings size={11} className="text-slate-400" />
                      <span>Thông số: {prod.power} | {prod.weight}</span>
                    </div>
                  )}
                </div>

                {/* Product pricing and cart triggers */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Giá báo:</span>
                      <span className="font-heading font-black text-xs md:text-sm text-primary-500">
                        {priceToShow.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    {isB2b && savings > 0 && (
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 line-through block">
                          {prod.price.toLocaleString('vi-VN')} ₫
                        </span>
                        <span className="text-[10px] text-success font-bold">
                          Đại lý -{(Math.round((savings / prod.price) * 100))}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <Link
                      href={`/products/${prod.id}`}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] tracking-wider py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors border border-slate-200"
                    >
                      <Eye size={12} />
                      <span>XEM CHI TIẾT</span>
                    </Link>

                    <button
                      onClick={(e) => handleAddToCart(prod, e)}
                      className={`font-bold text-[10px] tracking-wider py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
                        addedItems[prod.id]
                          ? 'bg-success text-white'
                          : 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm'
                      }`}
                    >
                      {addedItems[prod.id] ? (
                        <>
                          <Check size={12} className="stroke-[2.5]" />
                          <span>ĐÃ THÊM</span>
                        </>
                      ) : (
                        <>
                          <Plus size={12} className="stroke-[2.5]" />
                          <span>THÊM BÁO GIÁ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* SPECIAL INTEGRATED B2B COMBO CARD (8TH SLOT) */}
        {activeTab === 'son-epoxy' || activeTab === 'son-pu' ? (
          <div className="bg-gradient-to-br from-slate-900 to-primary-950 text-white rounded-2xl border-2 border-accent-500/80 shadow-md p-4 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_8px_24px_rgba(245,166,35,0.25)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl group-hover:bg-accent-500/20 transition-all duration-300"></div>
            <div className="absolute top-3 right-3 bg-accent-500 text-slate-900 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Percent size={10} className="stroke-[2.5]" />
              <span>TIẾT KIỆM 15%</span>
            </div>

            <div>
              <span className="text-[9px] text-accent-500 font-extrabold uppercase tracking-wider block">GÓI VẬT TƯ ĐỒNG BỘ</span>
              <h3 className="font-heading font-black text-xs md:text-sm text-white mt-1 leading-snug group-hover:text-accent-400 transition-colors">
                Combo Sơn Epoxy EP-SL + Bay Răng Cưa Inox
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Giải pháp tối ưu cho sơn sàn phẳng chống trượt, bao gồm màng sơn và dụng cụ thi công.
              </p>

              <div className="flex items-center justify-between gap-2 mt-4 bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <PexelsImage query="epoxy resin floor paint self leveling chemical" className="w-full h-full object-cover" />
                </div>
                <span className="text-accent-500 font-black text-xs">+</span>
                <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <PexelsImage query="notched trowel steel tool tile flooring" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-right text-[9px] font-semibold text-slate-300">
                  <div>1x Sơn Epoxy EP-SL</div>
                  <div>1x Bay răng cưa</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 mt-2 border-t border-white/10">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Giá Combo trọn gói:</span>
                  <span className="font-heading font-black text-sm text-accent-500">
                    3.200.000 ₫
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 line-through block">
                    3.750.000 ₫
                  </span>
                  <span className="text-[9.5px] text-accent-500 font-bold">
                    -15% GIẢM GIÁ
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    id: 'combo-epoxy-trowel',
                    name: 'Combo Sơn Epoxy EP-SL + Bay Răng Cưa Inox',
                    price: 32000000,
                    agentPrice: 26000000,
                    image: 'epoxy resin floor paint self leveling chemical'
                  }, 1)
                  setIsCartOpen(true)
                }}
                className="w-full bg-accent-500 hover:bg-accent-600 text-slate-900 font-bold text-[10px] tracking-wider py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
              >
                <Plus size={12} className="stroke-[2.5]" />
                <span>MUA BÁO GIÁ COMBO</span>
              </button>
            </div>
          </div>
        ) : (
          // Default/Grinder Combo for all other tabs
          <div className="bg-gradient-to-br from-slate-900 to-primary-950 text-white rounded-2xl border-2 border-accent-500/80 shadow-md p-4 flex flex-col justify-between overflow-hidden relative group hover:shadow-[0_8px_24px_rgba(245,166,35,0.25)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl group-hover:bg-accent-500/20 transition-all duration-300"></div>
            <div className="absolute top-3 right-3 bg-accent-500 text-slate-900 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Percent size={10} className="stroke-[2.5]" />
              <span>TIẾT KIỆM 15%</span>
            </div>

            <div>
              <span className="text-[9px] text-accent-500 font-extrabold uppercase tracking-wider block">GÓI THIẾT BỊ ĐỒNG BỘ</span>
              <h3 className="font-heading font-black text-xs md:text-sm text-white mt-1 leading-snug group-hover:text-accent-400 transition-colors">
                Combo Máy mài KVG-17E + 9 Đĩa mài #30
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Chuẩn bị bề mặt sàn hoàn hảo cho công trình vừa và nhỏ. Ăn khớp linh hoạt, tăng 200% hiệu suất.
              </p>

              <div className="flex items-center justify-between gap-2 mt-4 bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <PexelsImage query="construction floor grinder machinery" className="w-full h-full object-cover" />
                </div>
                <span className="text-accent-500 font-black text-xs">+</span>
                <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <PexelsImage query="metal diamond grinding segment shoe concrete" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-right text-[9px] font-semibold text-slate-300">
                  <div>1x Máy mài KVG-17E</div>
                  <div>9x Đĩa mài #30</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 mt-2 border-t border-white/10">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Giá Combo trọn gói:</span>
                  <span className="font-heading font-black text-sm text-accent-500">
                    14.200.000 ₫
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 line-through block">
                    16.355.000 ₫
                  </span>
                  <span className="text-[9.5px] text-accent-500 font-bold">
                    Tiết kiệm 2.155k
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    id: 'combo-grinder-diamond',
                    name: 'Combo Máy mài KVG-17E + 9 Đĩa mài #30',
                    price: 14200000,
                    agentPrice: 12000000,
                    image: 'construction floor grinder machinery'
                  }, 1)
                  setIsCartOpen(true)
                }}
                className="w-full bg-accent-500 hover:bg-accent-600 text-slate-900 font-bold text-[10px] tracking-wider py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
              >
                <Plus size={12} className="stroke-[2.5]" />
                <span>MUA BÁO GIÁ COMBO</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW ALL CTA */}
      <div className="flex justify-center mt-10">
        <Link
          href="/products"
          className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 font-heading font-extrabold text-xs tracking-wider px-6 py-3 rounded-full border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <span>XEM TẤT CẢ SẢN PHẨM KHANG PHÚC</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  )
}
