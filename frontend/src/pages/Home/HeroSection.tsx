import React from 'react'
import { Phone } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 font-sans">
      <div className="relative w-full min-h-[360px] md:min-h-[440px] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-b from-sky-300 to-sky-400 flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 gap-8">
        {/* Background Image */}
        <img
          src="/summer_banner_bg.png"
          alt="Summer promotion background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />
        
        {/* Subtle Overlay gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-transparent to-transparent pointer-events-none z-0" />

        {/* LEFT SIDE: PROMOTIONAL CONTENT */}
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-xl">
          <div className="space-y-1">
            <h1 
              className="text-white font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight uppercase select-none"
              style={{
                textShadow: '3.5px 3.5px 0px #0b57d0, -1px -1px 0px #0b57d0, 1px -1px 0px #0b57d0, -1px 1px 0px #0b57d0, 1px 1px 0px #0b57d0, 0px 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              HÈ SÔI ĐỘNG
            </h1>
            <h1 
              className="text-white font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none uppercase select-none"
              style={{
                textShadow: '3.5px 3.5px 0px #0b57d0, -1px -1px 0px #0b57d0, 1px -1px 0px #0b57d0, -1px 1px 0px #0b57d0, 1px 1px 0px #0b57d0, 0px 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              DEAL CHẤN ĐỘNG
            </h1>
          </div>

          {/* Yellow deal cards */}
          <div className="flex gap-4 items-center justify-center lg:justify-start">
            {/* Card 1 */}
            <div className="relative bg-[#ffd43b] border-2 border-white rounded-2xl px-6 py-4 shadow-lg flex flex-col items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 w-32 md:w-40 h-24 md:h-28">
              <span className="absolute -top-3 bg-[#e60012] text-white font-heading font-black text-[9px] md:text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                GIẢM ĐẾN
              </span>
              <span className="text-[#0b57d0] font-heading font-black text-4xl md:text-5xl lg:text-6xl mt-1.5">
                20%
              </span>
            </div>

            {/* Card 2 */}
            <div className="relative bg-[#ffd43b] border-2 border-white rounded-2xl px-6 py-4 shadow-lg flex flex-col items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300 w-32 md:w-40 h-24 md:h-28">
              <span className="absolute -top-3 bg-[#e60012] text-white font-heading font-black text-[9px] md:text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                COMBO
              </span>
              <span className="text-[#0b57d0] font-heading font-black text-xl md:text-2xl lg:text-3xl mt-2.5 uppercase leading-none pb-1 text-center">
                SIÊU HỜI
              </span>
            </div>
          </div>

          {/* Red phone pill */}
          <a
            href="tel:0983898758"
            data-track-id="hero-hotline"
            className="flex items-center gap-2 bg-[#e60012] hover:bg-[#c5000f] active:scale-95 text-white font-black text-xs md:text-sm px-6 py-3 rounded-full shadow-lg border border-red-500 hover:border-red-400 transition-all cursor-pointer group"
          >
            <Phone size={15} className="text-white fill-white animate-bounce group-hover:scale-110" />
            <span>0983 898 758 - 0982 090 819</span>
          </a>
        </div>

        {/* RIGHT SIDE: FLOATING SWIM RINGS WITH PRODUCTS */}
        <div className="relative z-10 flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-xl mt-6 lg:mt-0">
          {/* Lifebuoy Platform 1 */}
          <div className="relative group cursor-pointer animate-float" style={{ animationDelay: '0s' }} data-track-id="hero-item-sweeper">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[8px] md:border-[10px] border-white bg-[#00a8cc] shadow-2xl relative flex items-center justify-center overflow-hidden transform rotate-12 group-hover:rotate-45 transition-transform duration-1000">
              {/* Stripes */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 md:w-4 bg-white/40"></div>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 md:h-4 bg-white/40"></div>
              {/* Inner ring circle */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sky-300/40 shadow-inner z-10"></div>
            </div>
            {/* Product Image */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 md:w-28 md:h-28 z-20 transition-transform duration-500 group-hover:-translate-y-3">
              <img 
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=200&q=80" 
                alt="Sweeper machine"
                className="w-full h-full object-cover rounded-full border-2 border-white shadow-md" 
              />
            </div>
            <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              Xe Quét Rác
            </div>
          </div>

          {/* Lifebuoy Platform 2 */}
          <div className="relative group cursor-pointer animate-float" style={{ animationDelay: '0.4s' }} data-track-id="hero-item-vacuum">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[8px] md:border-[10px] border-white bg-[#ff577f] shadow-2xl relative flex items-center justify-center overflow-hidden transform -rotate-12 group-hover:rotate-12 transition-transform duration-1000">
              {/* Stripes */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 md:w-4 bg-white/40"></div>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 md:h-4 bg-white/40"></div>
              {/* Inner ring circle */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sky-300/40 shadow-inner z-10"></div>
            </div>
            {/* Product Image */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 md:w-28 md:h-28 z-20 transition-transform duration-500 group-hover:-translate-y-3">
              <img 
                src="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=200&q=80" 
                alt="Vacuum cleaner"
                className="w-full h-full object-cover rounded-full border-2 border-white shadow-md" 
              />
            </div>
            <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              Máy Hút Bụi
            </div>
          </div>

          {/* Lifebuoy Platform 3 */}
          <div className="relative group cursor-pointer animate-float" style={{ animationDelay: '0.8s' }} data-track-id="hero-item-scrubber">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[8px] md:border-[10px] border-white bg-[#ffd369] shadow-2xl relative flex items-center justify-center overflow-hidden transform rotate-6 group-hover:-rotate-30 transition-transform duration-1000">
              {/* Stripes */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 md:w-4 bg-white/40"></div>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 md:h-4 bg-white/40"></div>
              {/* Inner ring circle */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sky-300/40 shadow-inner z-10"></div>
            </div>
            {/* Product Image */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 md:w-28 md:h-28 z-20 transition-transform duration-500 group-hover:-translate-y-3">
              <img 
                src="https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=200&q=80" 
                alt="Floor scrubber"
                className="w-full h-full object-cover rounded-full border-2 border-white shadow-md" 
              />
            </div>
            <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              Máy Chà Sàn
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
