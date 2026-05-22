import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Send } from 'lucide-react'
import FooterTrust from './components/FooterTrust'
import FooterBranches from './components/FooterBranches'
import FooterSeoLinks from './components/FooterSeoLinks'

function FacebookIcon({ size = 14 }: { size?: number }) {
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
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t-4 border-primary-500">
      
      {/* 1. Chứng nhận & Uy tín */}
      <FooterTrust />

      {/* 2. Hệ thống chi nhánh & Tìm kho gần nhất */}
      <FooterBranches />

      {/* 3. Hệ thống liên kết chính */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs border-b border-slate-900">
        
        {/* CỘT 1: GIỚI THIỆU */}
        <div className="space-y-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-primary-900 font-bold">
              KP
            </div>
            <span className="font-heading font-black text-sm text-white tracking-wider">KHANG PHÚC</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Nhà cung cấp thiết bị mài sàn, máy chà sàn liên hợp, đĩa mài kim cương và hóa chất tăng cứng epoxy hàng đầu Việt Nam cho nhà thầu chuyên nghiệp.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-primary-500 text-white rounded transition-colors" aria-label="Facebook">
              <FacebookIcon size={14} />
            </a>
            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-primary-500 text-white rounded transition-colors" aria-label="Zalo Support">
              <Send size={14} />
            </a>
          </div>
        </div>

        {/* CỘT 2: CHÍNH SÁCH */}
        <div className="space-y-3.5">
          <h4 className="font-heading font-extrabold text-white text-xs border-l-2 border-accent-500 pl-2 uppercase">Chính Sách</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link to="/chinh-sach" className="hover:text-accent-500 transition-colors flex items-center gap-1">Chính sách giao hàng <ArrowUpRight size={10} /></Link></li>
            <li><Link to="/chinh-sach" className="hover:text-accent-500 transition-colors flex items-center gap-1">Chính sách bảo hành <ArrowUpRight size={10} /></Link></li>
            <li><Link to="/chinh-sach" className="hover:text-accent-500 transition-colors flex items-center gap-1">Chính sách đổi trả <ArrowUpRight size={10} /></Link></li>
            <li><Link to="/chinh-sach" className="hover:text-accent-500 transition-colors flex items-center gap-1">Điều khoản thanh toán <ArrowUpRight size={10} /></Link></li>
          </ul>
        </div>

        {/* CỘT 3: DANH MỤC NỔI BẬT */}
        <div className="space-y-3.5">
          <h4 className="font-heading font-extrabold text-white text-xs border-l-2 border-secondary-500 pl-2 uppercase">Danh mục nổi bật</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link to="/products?sub=may-mai-san" className="hover:text-secondary-500 transition-colors">Máy mài sàn bê tông</Link></li>
            <li><Link to="/products?sub=may-cha-san" className="hover:text-secondary-500 transition-colors">Máy vệ sinh công nghiệp</Link></li>
            <li><Link to="/products?sub=son-epoxy" className="hover:text-secondary-500 transition-colors">Sơn phủ sàn Epoxy</Link></li>
            <li><Link to="/products?sub=dia-mai-be-tong" className="hover:text-secondary-500 transition-colors">Đĩa mài mâm xoa</Link></li>
          </ul>
        </div>

        {/* CỘT 4: THÔNG TIN HỖ TRỢ */}
        <div className="space-y-3.5">
          <h4 className="font-heading font-extrabold text-white text-xs border-l-2 border-accent-500 pl-2 uppercase">Hỗ Trợ Khách Hàng</h4>
          <div className="space-y-2 text-slate-400 leading-normal">
            <p className="text-white font-bold">Hotline: 0982.352.528</p>
            <p>Zalo kỹ thuật: 0982.352.528</p>
            <p>Kinh doanh 1: 0979.141.528</p>
            <p>Email: contact@khangphuc.vn</p>
          </div>
        </div>

      </div>

      {/* 4. SEO Keyword Links & External Channels */}
      <FooterSeoLinks />

      {/* 5. Bản quyền và Giấy phép */}
      <div className="bg-slate-950/80 py-6 border-t border-white/5 text-slate-500 text-[10px] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© 2026 KHANG PHÚC INDUSTRIAL FLOORING. Bảo lưu mọi quyền.</span>
          <span className="text-[9px]">MST: 0108342528 - Sở KH&ĐT Thành Phố Hà Nội cấp ngày 14/06/2018</span>
        </div>
      </div>
    </footer>
  )
}
