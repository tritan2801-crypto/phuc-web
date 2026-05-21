'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { PexelsImage } from '@core/ui/PexelsImage'
import { MOCK_BLOGS } from '@core/constants/mock-data'

export default function BlogList() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      <div className="text-center mb-10 space-y-2">
        <span className="text-secondary-600 text-xs font-bold uppercase tracking-wider block">Hướng Dẫn Kỹ Thuật</span>
        <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-800 tracking-tight">
          Cẩm Nang Thi Công & Vật Tư Sàn Công Nghiệp
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Các bài viết chuyên sâu chia sẻ kinh nghiệm vận hành máy mài, định mức vật tư và kỹ thuật đổ sơn Epoxy/PU đạt chuẩn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_BLOGS.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <Link href={`/blog/${blog.slug}`} className="block h-48 bg-slate-100 relative overflow-hidden">
              <PexelsImage query={blog.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="bg-primary-50 text-primary-600 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-block">
                  {blog.category === 'huong-dan-thi-cong' ? 'Hướng dẫn thi công' : 'So sánh vật liệu'}
                </span>
                
                <Link href={`/blog/${blog.slug}`} className="block">
                  <h2 className="font-heading font-bold text-sm md:text-base text-slate-800 hover:text-primary-500 transition-colors leading-snug">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                  {blog.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                </div>

                <Link href={`/blog/${blog.slug}`} className="text-primary-500 hover:text-primary-600 font-bold flex items-center gap-1 uppercase tracking-wider text-[9.5px]">
                  <span>Đọc tiếp</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
