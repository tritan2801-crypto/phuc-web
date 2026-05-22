import React from 'react'
import { Link } from 'react-router-dom'
import { Hammer, Trash2, Layers, Droplet, PackagePlus, Wrench, Zap } from 'lucide-react'

interface CatItem {
  name: string
  icon: React.ReactNode
  link: string
  color: string
}

export default function QuickCategories() {
  const items: CatItem[] = [
    {
      name: 'Máy Mài Sàn',
      icon: <Hammer size={24} />,
      link: '/products?sub=may-mai-san',
      color: 'from-amber-500/10 to-amber-500/30 text-amber-600 hover:bg-amber-500'
    },
    {
      name: 'Máy Vệ Sinh',
      icon: <Trash2 size={24} />,
      link: '/products?sub=may-cha-san',
      color: 'from-blue-500/10 to-blue-500/30 text-blue-600 hover:bg-blue-500'
    },
    {
      name: 'Đĩa Mài Sàn',
      icon: <Zap size={24} />,
      link: '/products?cat=dia-mai',
      color: 'from-red-500/10 to-red-500/30 text-red-600 hover:bg-red-500'
    },
    {
      name: 'Sơn Epoxy',
      icon: <Layers size={24} />,
      link: '/products?sub=son-epoxy',
      color: 'from-teal-500/10 to-teal-500/30 text-teal-600 hover:bg-teal-500'
    },
    {
      name: 'Sơn PU',
      icon: <Layers size={24} className="rotate-45" />,
      link: '/products?sub=son-pu',
      color: 'from-purple-500/10 to-purple-500/30 text-purple-600 hover:bg-purple-500'
    },
    {
      name: 'Chất Tăng Cứng',
      icon: <Droplet size={24} />,
      link: '/products?sub=chat-tang-cung',
      color: 'from-cyan-500/10 to-cyan-500/30 text-cyan-600 hover:bg-cyan-500'
    },
    {
      name: 'Phụ Gia Bê Tông',
      icon: <PackagePlus size={24} />,
      link: '/products?sub=phu-gia',
      color: 'from-emerald-500/10 to-emerald-500/30 text-emerald-600 hover:bg-emerald-500'
    },
    {
      name: 'Dụng Cụ Tools',
      icon: <Wrench size={24} />,
      link: '/products?sub=tools',
      color: 'from-slate-500/10 to-slate-500/30 text-slate-700 hover:bg-slate-600'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-heading font-black text-sm text-slate-800 uppercase tracking-wider mb-6 text-center md:text-left">
          Danh mục tìm kiếm nhanh
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 hover:border-transparent hover:shadow-md hover:scale-105 transition-all group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center transition-all duration-300 group-hover:text-white`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-3 group-hover:text-primary-500 transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
