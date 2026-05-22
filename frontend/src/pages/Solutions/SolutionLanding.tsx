import React, { useState } from 'react'
import { CheckCircle2, Copy, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import PexelsImage from '../../components/ui/PexelsImage'
import { useApp } from '../../context/AppContext'
import { MOCK_PRODUCTS } from '../../constants/mock-data'

interface SolutionLandingProps {
  solution: {
    slug: string
    title: string
    image: string
    desc: string
    machine: string
    chemical: string
    challenges: string[]
    packageItems: { id: string; quantity: number }[]
  }
}

export default function SolutionLanding({ solution }: SolutionLandingProps) {
  const { addToCart, setIsCartOpen } = useApp()
  const [copied, setCopied] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuyPackage = () => {
    solution.packageItems.forEach(item => {
      const prod = MOCK_PRODUCTS.find(p => p.id === item.id)
      if (prod) {
        addToCart({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          agentPrice: prod.agentPrice,
          image: prod.image
        }, item.quantity)
      }
    })
    setSuccess(true)
    setIsCartOpen(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-500 mb-6 transition-colors">
        <ArrowLeft size={14} /> Quay lại trang chủ
      </Link>

      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 text-white mb-8">
        <div className="h-64 relative">
          <PexelsImage query={solution.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-accent-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-1 rounded shadow-md inline-block mb-2">
              GIẢI PHÁP ĐỒNG BỘ KHANG PHÚC
            </span>
            <h1 className="font-heading font-black text-xl md:text-3xl text-white tracking-tight leading-tight">
              {solution.title}
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed font-medium">{solution.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-white/5">
            <div>
              <h3 className="font-heading font-bold text-xs text-accent-500 uppercase tracking-wider mb-3">Thách thức thi công chính:</h3>
              <ul className="space-y-2 text-xs text-slate-300 font-semibold">
                {solution.challenges.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-secondary-500" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 text-xs">
              <h3 className="font-heading font-bold text-xs text-accent-500 uppercase tracking-wider">Cấu hình đề xuất:</h3>
              <p className="text-slate-300">📟 <strong>Thiết bị:</strong> {solution.machine}</p>
              <p className="text-slate-300">🧪 <strong>Hóa chất & Vật tư:</strong> {solution.chemical}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
            <button
              onClick={handleBuyPackage}
              className={`flex-1 font-heading font-extrabold text-xs tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                success ? 'bg-success text-white' : 'bg-accent-500 hover:bg-accent-600 text-slate-950'
              }`}
            >
              <ShoppingCart size={16} />
              <span>{success ? 'ĐÃ THÊM TRỌN BỘ GIẢI PHÁP' : 'MUA TRỌN BỘ GIẢI PHÁP (1-CLICK)'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-heading font-extrabold text-xs tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Copy size={16} />
              <span>{copied ? 'ĐÃ SAO CHÉP LIÊN KẾT!' : 'SAO CHÉP LIÊN KẾT TƯ VẤN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
