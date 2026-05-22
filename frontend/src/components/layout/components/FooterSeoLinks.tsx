import React from 'react'
import { Link } from 'react-router-dom'
import { Link2, ShoppingBag, Globe, Flame } from 'lucide-react'

function FacebookIcon({ size = 13, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-facebook ${className}`}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

interface KeywordGroup {
  title: string
  color: string
  links: { label: string; href: string }[]
}

const SEO_GROUPS: KeywordGroup[] = [
  {
    title: 'Vật Liệu & Hóa Chất Sơn Sàn',
    color: 'border-secondary-500',
    links: [
      { label: 'Sơn Epoxy KCC Hàn Quốc', href: '/products?sub=son-epoxy' },
      { label: 'Sơn Sàn Sikafloor', href: '/products?sub=son-epoxy' },
      { label: 'Chất Tăng Cứng Lithium Densifier', href: '/products?sub=son-hoa-chat' },
      { label: 'Sơn Polyurethane Kháng Khuẩn', href: '/products?sub=son-hoa-chat' },
      { label: 'Keo Vá Sửa Nứt Bê Tông', href: '/products?sub=son-hoa-chat' },
      { label: 'Vữa Tự San Phẳng', href: '/products?sub=son-hoa-chat' },
      { label: 'Hóa Chất Đánh Bóng Sàn Bê Tông', href: '/products?sub=son-hoa-chat' },
      { label: 'Dung Dịch Chống Thấm Water Shield', href: '/products?sub=son-hoa-chat' },
    ],
  },
  {
    title: 'Thiết Bị & Dụng Cụ Mài Sàn',
    color: 'border-accent-500',
    links: [
      { label: 'Máy Mài Sàn Bê Tông Karva', href: '/products?sub=may-mai-san' },
      { label: 'Máy Hút Bụi Công Nghiệp 3 Motor', href: '/products?sub=may-hut-bui' },
      { label: 'Đĩa Mài Bê Tông Kim Cương', href: '/products?sub=dia-mai-be-tong' },
      { label: 'Pad Đánh Bóng Sàn Bê Tông', href: '/products?sub=dia-mai-be-tong' },
      { label: 'Máy Chà Sàn Liên Hợp Kumisai', href: '/products?sub=may-cha-san' },
      { label: 'Máy Đánh Bóng Bê Tông Tốc Độ Cao', href: '/products?sub=may-mai-san' },
      { label: 'Rulo Gai Phá Bọt Khí Sơn Epoxy', href: '/products?sub=dia-mai-be-tong' },
      { label: 'Bàn Cào Sơn Epoxy Răng Cưa', href: '/products?sub=dia-mai-be-tong' },
    ],
  },
]

export default function FooterSeoLinks() {
  return (
    <div className="bg-slate-900/40 border-b border-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* KEYWORDS MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SEO_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-3.5">
              <h5 className={`font-heading font-extrabold text-white text-xs border-l-2 ${group.color} pl-2 uppercase tracking-wide flex items-center gap-1.5`}>
                <Flame size={12} className={idx === 0 ? 'text-secondary-500' : 'text-accent-500'} />
                {group.title}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {group.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    to={link.href}
                    className="text-[10px] sm:text-xs text-slate-400 bg-slate-950/80 hover:bg-slate-900 hover:text-white border border-slate-800/80 px-2 py-1 rounded transition-all duration-200 inline-block hover:scale-[1.02]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* E-COMMERCE & DISTRIBUTOR CHANNELS */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link2 size={14} className="text-secondary-500" />
            <span className="font-semibold text-white">Phát triển kênh liên kết thương mại:</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://shopee.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg hover:border-orange-500/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all group"
            >
              <ShoppingBag size={13} className="text-orange-500 group-hover:scale-110 transition-transform" />
              <span>Shopee Mall Khang Phúc</span>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-500/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all group"
            >
              <FacebookIcon size={13} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span>Facebook Marketplace</span>
            </a>

            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg hover:border-accent-500/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all group"
            >
              <Globe size={13} className="text-accent-500 group-hover:scale-110 transition-transform" />
              <span>Google Merchant</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
