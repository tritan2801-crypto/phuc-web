import React from 'react'
import BlogList from '@/features/blog/components/BlogList'

export const metadata = {
  title: 'Cẩm nang Kỹ thuật Sàn Công Nghiệp - Khang Phúc',
  description: 'Hướng dẫn quy trình thi công sơn Epoxy, so sánh hóa chất tăng cứng Lithium/Sodium, kinh nghiệm vận hành máy mài sàn bê tông Khang Phúc.'
}

export default function BlogListPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-12">
      <BlogList />
    </main>
  )
}
