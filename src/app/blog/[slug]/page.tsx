'use client'

import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { MOCK_BLOGS } from '@core/constants/mock-data'
import BlogDetail from '@/features/blog/components/BlogDetail'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const blog = useMemo(() => {
    return MOCK_BLOGS.find(b => b.slug === slug) || MOCK_BLOGS[0]
  }, [slug])

  return (
    <main className="min-h-screen bg-slate-50/50 pb-12">
      <BlogDetail blog={blog} />
    </main>
  )
}
