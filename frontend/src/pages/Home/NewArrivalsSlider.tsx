import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import PexelsImage from '../../components/ui/PexelsImage'
import { useApp } from '../../context/AppContext'
import { MOCK_PRODUCTS } from '../../constants/mock-data'

export default function NewArrivalsSlider() {
  const { addToCart, setIsCartOpen, isB2b } = useApp()
  const scrollRef = useRef<HTMLDivElement>(null)

  const newProducts = MOCK_PRODUCTS.filter(p => p.badge === 'NEW' || p.badge === 'VỪA VỀ KHO')

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 font-sans bg-gradient-to-r from-slate-50 to-white rounded-3xl border border-slate-150/60 my-6 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-secondary-600 text-xs font-bold uppercase tracking-wider block">
            Hàng Mới Cập Bến
          </span>
          <h2 className="font-heading font-black text-2xl text-slate-800 tracking-tight mt-1">
            Sản Phẩm Mới Về Kho Khang Phúc
          </h2>
        </div>
        
        {/* Navigation arrows */}
        <div className="flex gap-2 self-end sm:self-center">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {newProducts.map((prod) => {
          const priceToShow = isB2b ? prod.agentPrice : prod.price
          const savings = prod.price - prod.agentPrice

          return (
            <div
              key={prod.id}
              className="w-72 flex-shrink-0 bg-white rounded-2xl border border-slate-150 shadow-sm hover:shadow-md hover:border-primary-500/20 transition-all duration-300 snap-start flex flex-col justify-between overflow-hidden group"
            >
              <Link to={`/products/${prod.id}`} className="block relative h-40 bg-slate-50 overflow-hidden">
                <PexelsImage query={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {prod.badge && (
                  <span className={`absolute top-3 right-3 font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow text-white tracking-wider ${
                    prod.badge === 'NEW' ? 'bg-red-500' : 'bg-emerald-500'
                  }`}>
                    {prod.badge}
                  </span>
                )}
                <span className="absolute top-3 left-3 bg-slate-900/80 text-white font-extrabold text-[8.5px] px-2 py-0.5 rounded shadow">
                  {prod.brand}
                </span>
              </Link>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    {prod.subCategory === 'may-mai-san' ? 'MÁY MÀI' : prod.subCategory === 'son-pu' ? 'SƠN PU' : 'PHỤ GIA/TOOLS'}
                  </span>
                  <Link to={`/products/${prod.id}`} className="block mt-1">
                    <h3 className="font-heading font-bold text-xs md:text-sm text-slate-800 line-clamp-2 leading-snug hover:text-primary-500 transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block">Giá báo:</span>
                      <span className="font-heading font-black text-xs md:text-sm text-primary-500">
                        {priceToShow.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    {isB2b && savings > 0 && (
                      <span className="text-[9.5px] text-success font-extrabold bg-emerald-50 py-0.5 px-2 rounded-md">
                        -{Math.round((savings / prod.price) * 100)}%
                      </span>
                    )}
                  </div>

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
                    className="w-full bg-primary-900 hover:bg-primary-950 text-accent-500 font-heading font-extrabold text-[10px] tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <ShoppingCart size={13} />
                    <span>THÊM VÀO GIỎ</span>
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
