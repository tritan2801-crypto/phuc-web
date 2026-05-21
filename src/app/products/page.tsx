'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Grid, List, Check, ArrowUpDown, ShieldAlert, Award } from 'lucide-react'
import { PexelsImage } from '@core/ui/PexelsImage'
import { useApp } from '@core/context/AppContext'
import { MOCK_PRODUCTS, Product } from '@core/constants/mock-data'

function ProductsCatalogContent() {
  const { addToCart, setIsCartOpen, isB2b } = useApp()
  const searchParams = useSearchParams()

  // Read search & category filters from navigation URL params
  const initialSearch = searchParams.get('search') || ''
  const initialCat = searchParams.get('cat') || ''
  const initialSub = searchParams.get('sub') || ''

  // Dynamic products state, falling back to MOCK_PRODUCTS initially
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)

  // Filter States
  const [searchVal, setSearchVal] = useState(initialSearch)
  const [selectedCat, setSelectedCat] = useState(initialCat)
  const [selectedSub, setSelectedSub] = useState(initialSub)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPowers, setSelectedPowers] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(200000000)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Load dynamic products from API
  useEffect(() => {
    async function loadDynamicProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          if (data.products && Array.isArray(data.products)) {
            setProducts(data.products)
          }
        }
      } catch (err) {
        console.warn('API connection failed, falling back to static mock data:', err)
      }
    }
    loadDynamicProducts()
  }, [])

  // Sync state if search parameter updates via header
  useEffect(() => {
    setSearchVal(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    setSelectedCat(initialCat)
    setSelectedSub(initialSub)
  }, [initialCat, initialSub])

  // Aggregate available brands and powers for filters dynamically
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products])
  const powers = useMemo(() => Array.from(new Set(products.map(p => p.power).filter(Boolean))) as string[], [products])

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const handlePowerChange = (power: string) => {
    setSelectedPowers(prev =>
      prev.includes(power) ? prev.filter(p => p !== power) : [...prev, power]
    )
  }

  // Core Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search query filter
    if (searchVal) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchVal.toLowerCase())
      )
    }

    // Category filter
    if (selectedCat) {
      result = result.filter(p => p.category === selectedCat)
    }

    // Subcategory filter
    if (selectedSub) {
      result = result.filter(p => p.subCategory === selectedSub)
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand))
    }

    // Power filter
    if (selectedPowers.length > 0) {
      result = result.filter(p => p.power && selectedPowers.includes(p.power))
    }

    // Price filter
    result = result.filter(p => (isB2b ? p.agentPrice : p.price) <= maxPrice)

    // Sort order
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (isB2b ? a.agentPrice : a.price) - (isB2b ? b.agentPrice : b.price))
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (isB2b ? b.agentPrice : b.price) - (isB2b ? a.agentPrice : a.price))
    } else if (sortBy === 'brand') {
      result.sort((a, b) => a.brand.localeCompare(b.brand))
    }

    return result
  }, [searchVal, selectedCat, selectedSub, selectedBrands, selectedPowers, maxPrice, sortBy, isB2b, products])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Intro Breadcrumb banner */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-600 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] bg-accent-500 text-primary-900 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Danh Mục Thiết Bị
          </span>
          <h1 className="font-heading font-black text-2xl md:text-3xl leading-tight tracking-tight">
            {selectedCat === 'may-moc'
              ? 'Thiết bị & Máy móc Công Nghiệp'
              : selectedCat === 'dia-mai'
              ? 'Đĩa mài mâm xoa & Tools'
              : selectedCat === 'son-hoa-chat'
              ? 'Sơn nền Epoxy & Vật liệu tăng cứng'
              : 'Tất cả sản phẩm & Vật tư'}
          </h1>
          <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
            Phân phối chính hãng đầy đủ giấy tờ CO CQ. Hỗ trợ dự án thử máy trực tiếp trên mác sàn công trình trước khi chốt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-5">
            <h3 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider border-b pb-3 flex items-center gap-1.5">
              <Filter size={14} className="text-primary-500" />
              <span>Bộ lọc sản phẩm</span>
            </h3>

            {/* Subcategories list */}
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Nhóm hàng:</h4>
              <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
                <button
                  onClick={() => { setSelectedCat(''); setSelectedSub('') }}
                  className={`text-left px-2 py-1 rounded hover:bg-slate-50 transition-colors ${!selectedCat && 'text-primary-500 bg-primary-50/20'}`}
                >
                  Tất cả sản phẩm
                </button>
                <button
                  onClick={() => { setSelectedCat('may-moc'); setSelectedSub('may-mai-san') }}
                  className={`text-left px-2 py-1 rounded hover:bg-slate-50 transition-colors ${selectedSub === 'may-mai-san' && 'text-primary-500 bg-primary-50/20'}`}
                >
                  Máy mài sàn bê tông
                </button>
                <button
                  onClick={() => { setSelectedCat('may-moc'); setSelectedSub('may-hut-bui') }}
                  className={`text-left px-2 py-1 rounded hover:bg-slate-50 transition-colors ${selectedSub === 'may-hut-bui' && 'text-primary-500 bg-primary-50/20'}`}
                >
                  Máy hút bụi công nghiệp
                </button>
                <button
                  onClick={() => { setSelectedCat('dia-mai'); setSelectedSub('dia-mai-be-tong') }}
                  className={`text-left px-2 py-1 rounded hover:bg-slate-50 transition-colors ${selectedSub === 'dia-mai-be-tong' && 'text-primary-500 bg-primary-50/20'}`}
                >
                  Đĩa mài sắt mâm xoa
                </button>
                <button
                  onClick={() => { setSelectedCat('son-hoa-chat'); setSelectedSub('chat-tang-cung') }}
                  className={`text-left px-2 py-1 rounded hover:bg-slate-50 transition-colors ${selectedSub === 'chat-tang-cung' && 'text-primary-500 bg-primary-50/20'}`}
                >
                  Chất tăng cứng Lithium
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Brand checkboxes */}
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Thương hiệu:</h4>
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="rounded border-slate-300 text-primary-500 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Power checkboxes */}
            {powers.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-heading font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Công suất động cơ:</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  {powers.map(power => (
                    <label key={power} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedPowers.includes(power)}
                        onChange={() => handlePowerChange(power)}
                        className="rounded border-slate-300 text-primary-500 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{power}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-slate-100" />

            {/* Price filter range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-heading font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">
                <span>Khoảng giá tối đa:</span>
                <span className="text-primary-500 font-bold normal-case text-xs">{(maxPrice / 1000000).toFixed(0)} Triệu</span>
              </div>
              <input
                type="range"
                min={100000}
                max={200000000}
                step={500000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: PRODUCTS LIST */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top sort control panel */}
          <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="font-semibold text-slate-500">
              Tìm thấy <span className="text-slate-800 font-bold">{filteredProducts.length}</span> sản phẩm phù hợp
            </div>
            
            <div className="flex items-center gap-3.5">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <ArrowUpDown size={13} />
                <span>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:ring-1 focus:ring-primary-500 outline-none text-slate-700 font-bold cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="brand">Theo hãng</option>
                </select>
              </div>

              <div className="h-4 w-px bg-slate-200" />

              {/* View mode buttons */}
              <div className="flex border border-slate-200 rounded p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* GRID OF PRODUCTS VIEW */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-150 p-12 text-center text-slate-400 space-y-3 shadow-sm">
              <ShieldAlert size={48} className="mx-auto stroke-[1.25] text-slate-300" />
              <p className="text-sm font-semibold">Không tìm thấy sản phẩm nào khớp với bộ lọc của bạn.</p>
              <button
                onClick={() => {
                  setSearchVal('')
                  setSelectedCat('')
                  setSelectedSub('')
                  setSelectedBrands([])
                  setSelectedPowers([])
                  setMaxPrice(200000000)
                }}
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-full cursor-pointer transition-all shadow-sm"
              >
                Reset toàn bộ bộ lọc
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(prod => {
                const priceToShow = isB2b ? prod.agentPrice : prod.price
                const savings = prod.price - prod.agentPrice

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-150 shadow-sm hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <a href={`/products/${prod.id}`} className="block relative h-44 bg-slate-50 overflow-hidden">
                      <PexelsImage query={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-3 left-3 bg-primary-900/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow">
                        {prod.brand}
                      </div>
                    </a>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{prod.brand}</span>
                        <a href={`/products/${prod.id}`} className="block">
                          <h4 className="font-heading font-bold text-xs md:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
                            {prod.name}
                          </h4>
                        </a>
                      </div>

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

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <a
                            href={`/products/${prod.id}`}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] tracking-wider py-2 rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-200 text-center"
                          >
                            <span>CHI TIẾT</span>
                          </a>

                          <button
                            onClick={() => {
                              addToCart({
                                id: prod.id,
                                name: prod.name,
                                price: prod.price,
                                agentPrice: prod.agentPrice,
                                image: prod.image
                              }, 1)
                              setIsCartOpen(true)
                            }}
                            className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10px] tracking-wider py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                          >
                            <span>BÁO GIÁ +</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* LIST MODE OF PRODUCTS */
            <div className="space-y-4">
              {filteredProducts.map(prod => {
                const priceToShow = isB2b ? prod.agentPrice : prod.price
                const savings = prod.price - prod.agentPrice

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 group"
                  >
                    <a href={`/products/${prod.id}`} className="w-full sm:w-44 h-32 relative rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                      <PexelsImage query={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </a>

                    <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{prod.brand}</span>
                        <a href={`/products/${prod.id}`} className="block">
                          <h4 className="font-heading font-bold text-xs md:text-sm text-slate-800 leading-snug group-hover:text-primary-500 transition-colors">
                            {prod.name}
                          </h4>
                        </a>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{prod.description}</p>
                      </div>

                      <div className="sm:w-44 flex flex-col justify-between items-end border-l border-slate-100 sm:pl-4">
                        <div className="text-right">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Giá báo:</span>
                          <span className="font-heading font-black text-sm md:text-base text-primary-500">
                            {priceToShow.toLocaleString('vi-VN')} ₫
                          </span>
                          {isB2b && savings > 0 && (
                            <div className="mt-1">
                              <span className="text-[9px] text-slate-400 line-through block">
                                {prod.price.toLocaleString('vi-VN')} ₫
                              </span>
                              <span className="text-[10px] text-success font-bold block">
                                Tiết kiệm {savings.toLocaleString('vi-VN')} ₫
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 w-full mt-3 sm:mt-0">
                          <a
                            href={`/products/${prod.id}`}
                            className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] py-2 rounded-lg border border-slate-200 text-center transition-colors"
                          >
                            CHI TIẾT
                          </a>
                          <button
                            onClick={() => {
                              addToCart({
                                id: prod.id,
                                name: prod.name,
                                price: prod.price,
                                agentPrice: prod.agentPrice,
                                image: prod.image
                              }, 1)
                              setIsCartOpen(true)
                            }}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10px] py-2 rounded-lg transition-colors cursor-pointer text-center shadow-sm"
                          >
                            BÁO GIÁ +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function ProductsCatalog() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-semibold text-slate-400">Đang tải danh mục sản phẩm...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  )
}
