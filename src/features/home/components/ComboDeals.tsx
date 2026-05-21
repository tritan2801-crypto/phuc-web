'use client'

import React from 'react'
import { CheckCircle2, ChevronRight, FileText, ShoppingCart, Percent } from 'lucide-react'
import { PexelsImage } from '@core/ui/PexelsImage'
import { useApp } from '@core/context/AppContext'
import { MOCK_COMBOS } from '@core/constants/mock-data'

export default function ComboDeals() {
  const { addToCart, setIsCartOpen, isB2b } = useApp()

  const handleBuyCombo = (combo: typeof MOCK_COMBOS[0]) => {
    // Add the combo kit as an item in cart
    addToCart({
      id: combo.id,
      name: combo.name,
      price: combo.price,
      agentPrice: combo.agentPrice,
      image: combo.image
    }, 1)
    
    // Open the quotation drawer instantly
    setIsCartOpen(true)
  }

  return (
    <section id="combos" className="max-w-7xl mx-auto px-4 py-8 font-sans scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-secondary-500 text-xs font-bold uppercase tracking-wider block">Giải Pháp Đồng Bộ</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 tracking-tight mt-1">
            Combo thiết bị & vật tư chuyên dụng
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-md mt-2 md:mt-0 leading-relaxed">
          Thiết kế đồng bộ từ máy mài sàn, hút bụi đến đĩa mài và hóa chất phủ chính hãng. Đã được các kỹ sư Khang Phúc cấu hình tối ưu hiệu suất thi công thực chiến.
        </p>
      </div>

      {/* COMBOS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_COMBOS.map((combo) => {
          const currentPrice = isB2b ? combo.agentPrice : combo.price
          const original = combo.originalPrice
          const actualSavings = original - currentPrice

          return (
            <div
              key={combo.id}
              className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 group"
            >
              {/* Left Column: Image & Savings sticker */}
              <div className="md:w-5/12 relative min-h-[220px]">
                <PexelsImage query={combo.image} className="w-full h-full object-cover" />
                
                {/* Dynamic Gold Savings Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-accent-500 to-amber-500 text-primary-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(245,166,35,0.4)] flex items-center gap-1">
                  <Percent size={12} className="stroke-[2.5]" />
                  <span>TIẾT KIỆM {actualSavings.toLocaleString('vi-VN')} ₫</span>
                </div>

                {/* Subtitle tag */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
                  {combo.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-primary-900/85 backdrop-blur text-white text-[9px] font-semibold px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Descriptions & Details */}
              <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading font-black text-sm md:text-base text-primary-900 leading-snug group-hover:text-primary-500 transition-colors">
                    {combo.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {combo.description}
                  </p>

                  <div className="h-px bg-slate-100 my-2.5" />

                  {/* Components checklist */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trọn bộ combo bao gồm:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600 font-medium">
                      {combo.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 size={12} className="text-secondary-500 flex-shrink-0" />
                          <span className="truncate">{item.productName} ({item.quantity})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price block and buy buttons */}
                <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Giá trọn bộ ưu đãi:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-base text-primary-500">
                        {currentPrice.toLocaleString('vi-VN')} ₫
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {original.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyCombo(combo)}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_2px_8px_rgba(30,58,138,0.15)]"
                  >
                    <ShoppingCart size={13} />
                    <span>Mua nhanh / Báo giá</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
