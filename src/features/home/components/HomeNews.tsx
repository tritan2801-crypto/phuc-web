'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { PexelsImage } from '@core/ui/PexelsImage'
import { MOCK_BLOGS } from '@core/constants/mock-data'

export default function HomeNews() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-secondary-500 text-xs font-bold uppercase tracking-wider block">Kiến thức sàn nền</span>
          <h2 className="font-heading font-black text-2xl text-slate-800 tracking-tight mt-1">
            Góc tư vấn kỹ thuật & cẩm nang SEO
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-primary-500 hover:text-primary-600 text-xs font-bold flex items-center gap-1 mt-2 md:mt-0 transition-colors cursor-pointer"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* BLOGS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_BLOGS.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row group"
          >
            {/* Left side: Image */}
            <div className="sm:w-5/12 h-44 sm:h-auto relative bg-slate-50">
              <PexelsImage query={blog.image} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
            </div>

            {/* Right side: text details */}
            <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-semibold uppercase">
                  <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded font-bold">
                    {blog.category === 'huong-dan-thi-cong' ? 'Hướng dẫn' : 'So sánh'}
                  </span>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {blog.date}</span>
                </div>

                <Link href={`/blog/${blog.slug}`} className="block">
                  <h3 className="font-heading font-bold text-xs md:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {blog.summary}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                  <User size={11} />
                  <span>{blog.author}</span>
                </div>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-bold text-slate-700 group-hover:text-primary-500 flex items-center gap-0.5 transition-colors cursor-pointer"
                >
                  <span>Xem thêm</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
