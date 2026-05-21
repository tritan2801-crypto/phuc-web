'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, ShoppingCart } from 'lucide-react'
import { PexelsImage } from '@core/ui/PexelsImage'
import { MOCK_PRODUCTS } from '@core/constants/mock-data'
import { useApp } from '@core/context/AppContext'

interface BlogDetailProps {
  blog: {
    id: string
    title: string
    category: string
    summary: string
    content: string
    image: string
    date: string
    author: string
  }
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const { addToCart, setIsCartOpen, isB2b } = useApp()

  const relatedProducts = useMemo(() => {
    const textToScan = (blog.title + ' ' + blog.content).toLowerCase()
    const matched: any[] = []
    const add = (id: string) => {
      const p = MOCK_PRODUCTS.find(x => x.id === id)
      if (p && !matched.some(x => x.id === id)) matched.push(p)
    }

    if (textToScan.includes('epoxy')) {
      add('son-epoxy-tu-san')
      add('bay-rang-cua-inox')
      add('roller-spike-epoxy')
    }
    if (textToScan.includes('mài') || textToScan.includes('mai')) {
      add('may-mai-kms-250')
      add('dia-mai-kim-cuong-30')
      add('resin-pad-50')
    }
    if (textToScan.includes('bụi') || textToScan.includes('bui')) {
      add('may-hut-bui-kms-80')
    }
    if (textToScan.includes('cứng') || textToScan.includes('lithium')) {
      add('chat-tang-cung-lithium')
    }
    if (textToScan.includes('pu') || textToScan.includes('polyurethane')) {
      add('son-pu-crete')
    }
    if (textToScan.includes('cát') || textToScan.includes('silica')) {
      add('cat-silica')
    }

    return matched.slice(0, 4)
  }, [blog])

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 font-sans">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-500 mb-6 transition-colors">
        <ArrowLeft size={14} /> Trở lại danh sách bài viết
      </Link>

      <header className="space-y-4 mb-6">
        <span className="bg-primary-900 text-accent-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded shadow">
          {blog.category === 'huong-dan-thi-cong' ? 'HƯỚNG DẪN KỸ THUẬT' : 'SO SÁNH VẬT LIỆU'}
        </span>
        <h1 className="font-heading font-black text-xl md:text-2xl text-slate-800 leading-snug tracking-tight">
          {blog.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1"><Calendar size={13} /> {blog.date}</span>
          <span className="flex items-center gap-1"><User size={13} /> {blog.author}</span>
        </div>
      </header>

      <div className="h-64 md:h-80 bg-slate-100 rounded-3xl overflow-hidden shadow-sm mb-8">
        <PexelsImage query={blog.image} className="w-full h-full object-cover" />
      </div>

      <div className="text-slate-700 text-sm leading-relaxed space-y-4 font-medium mb-12">
        <p className="font-extrabold text-slate-900 text-base">{blog.summary}</p>
        <p>{blog.content}</p>
      </div>

      {/* SEO RELATED PRODUCTS REC ENGINE */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-150 pt-8 mt-8 space-y-4">
          <h3 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider">
            Sản phẩm & Dụng cụ thi công liên quan bài viết:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProducts.map((p) => {
              const price = isB2b ? p.agentPrice : p.price
              return (
                <div key={p.id} className="bg-white border border-slate-150 rounded-2xl p-3 flex gap-3 shadow-sm hover:shadow hover:border-primary-500/20 transition-all">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                    <PexelsImage query={p.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">{p.name}</h4>
                      <span className="text-primary-500 font-extrabold text-xs block mt-1">
                        {price.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart({ id: p.id, name: p.name, price: p.price, agentPrice: p.agentPrice, image: p.image }, 1)
                        setIsCartOpen(true)
                      }}
                      className="self-start text-[9px] font-extrabold text-secondary-500 hover:text-primary-500 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingCart size={11} /> Thêm báo giá
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}
