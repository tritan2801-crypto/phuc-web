import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { MOCK_BLOGS } from '../../constants/mock-data'
import BlogDetail from './BlogDetail'

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const blog = useMemo(() => {
    return MOCK_BLOGS.find(b => b.slug === slug) || MOCK_BLOGS[0]
  }, [slug])

  return (
    <main className="min-h-screen bg-slate-50/50 pb-12">
      <BlogDetail blog={blog} />
    </main>
  )
}
