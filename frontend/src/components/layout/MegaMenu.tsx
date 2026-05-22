import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X, Hammer, Trash2, Droplet, Layers } from 'lucide-react'

export default function MegaMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)

  return (
    <nav className="bg-primary-500 text-white relative z-30 shadow-md">
      {/* DESKTOP MENU BAR */}
      <div className="max-w-7xl mx-auto px-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center">
          {/* Main Navigation Links */}
          <div className="flex items-center font-heading font-semibold text-xs tracking-wide uppercase">
            {/* TRANG CHỦ */}
            <Link to="/" className="px-4 py-3.5 hover:bg-primary-600 transition-colors">
              Trang chủ
            </Link>

            {/* MÁY MÓC */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-3.5 hover:bg-primary-600 transition-colors outline-none cursor-pointer">
                <span>Máy móc</span>
                <ChevronDown size={14} />
              </button>
              {/* Mega Dropdown Panel */}
              <div className="absolute top-full left-0 w-[480px] bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200/80 p-5 grid grid-cols-2 gap-4 hidden group-hover:grid animate-slide-up">
                <div>
                  <h4 className="font-bold text-xs text-primary-500 border-b pb-2 mb-2 flex items-center gap-1.5">
                    <Hammer size={14} /> Mài & Đánh bóng
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li><Link to="/products?sub=may-mai-san" className="hover:text-primary-500 transition-colors">Máy mài sàn bê tông</Link></li>
                    <li><Link to="/products?sub=may-danh-bong" className="hover:text-primary-500 transition-colors">Máy đánh bóng tốc độ cao</Link></li>
                    <li><Link to="/products?sub=may-tron" className="hover:text-primary-500 transition-colors">Máy trộn nguyên liệu hồ</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary-500 border-b pb-2 mb-2 flex items-center gap-1.5">
                    <Trash2 size={14} /> Vệ sinh công nghiệp
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li><Link to="/products?sub=may-hut-bui" className="hover:text-primary-500 transition-colors">Máy hút bụi công suất lớn</Link></li>
                    <li><Link to="/products?sub=may-cha-san" className="hover:text-primary-500 transition-colors">Máy chà sàn liên hợp</Link></li>
                    <li><Link to="/products?sub=ve-sinh-khac" className="hover:text-primary-500 transition-colors">Thiết bị vệ sinh khác</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ĐĨA MÀI & TOOLS */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-3.5 hover:bg-primary-600 transition-colors outline-none cursor-pointer">
                <span>Đĩa mài & Tools</span>
                <ChevronDown size={14} />
              </button>
              {/* Mega Dropdown Panel */}
              <div className="absolute top-full left-0 w-[450px] bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200/80 p-5 grid grid-cols-2 gap-4 hidden group-hover:grid animate-slide-up">
                <div>
                  <h4 className="font-bold text-xs text-secondary-600 border-b pb-2 mb-2">Đĩa mài các loại</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li><Link to="/products?sub=dia-mai-be-tong" className="hover:text-secondary-600 transition-colors">Đĩa mài bê tông đầu sắt</Link></li>
                    <li><Link to="/products?sub=dia-danh-bong" className="hover:text-secondary-600 transition-colors">Đĩa đánh bóng bê tông</Link></li>
                    <li><Link to="/products?sub=pad-danh-bong" className="hover:text-secondary-600 transition-colors">Pad đánh bóng sàn 3M</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-secondary-600 border-b pb-2 mb-2">Dụng cụ thi công</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li><Link to="/products?sub=tools" className="hover:text-secondary-600 transition-colors">Bay răng cưa tự san phẳng</Link></li>
                    <li><Link to="/products?sub=tools" className="hover:text-secondary-600 transition-colors">Rulo gai phá bọt khí</Link></li>
                    <li><Link to="/products?sub=tools" className="hover:text-secondary-600 transition-colors">Giày đinh thi công epoxy</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SƠN & HÓA CHẤT */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-3.5 hover:bg-primary-600 transition-colors outline-none cursor-pointer">
                <span>Sơn & Hóa chất</span>
                <ChevronDown size={14} />
              </button>
              {/* Mega Dropdown Panel */}
              <div className="absolute top-full left-0 w-[450px] bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200/80 p-5 grid grid-cols-2 gap-4 hidden group-hover:grid animate-slide-up">
                <div>
                  <h4 className="font-bold text-xs text-accent-600 border-b pb-2 mb-2 flex items-center gap-1.5">
                    <Droplet size={14} /> Chất tăng cứng & Chống thấm
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li><Link to="/products?sub=chat-tang-cung" className="hover:text-accent-600 transition-colors">Lithium Densifier LP-01</Link></li>
                    <li><Link to="/products?sub=chat-tang-cung" className="hover:text-accent-600 transition-colors">Sodium Densifier</Link></li>
                    <li><Link to="/products?sub=chong-tham" className="hover:text-accent-600 transition-colors">Chống thấm sàn bê tông</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-accent-600 border-b pb-2 mb-2 flex items-center gap-1.5">
                    <Layers size={14} /> Sơn nền các hệ
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li><Link to="/products?sub=son-epoxy" className="hover:text-accent-600 transition-colors">Sơn Epoxy tự san phẳng</Link></li>
                    <li><Link to="/products?sub=son-epoxy" className="hover:text-accent-600 transition-colors">Sơn Epoxy hệ lăn 3 lớp</Link></li>
                    <li><Link to="/products?sub=son-pu" className="hover:text-accent-600 transition-colors">Sơn PU chống nứt chịu tải</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COMBO GIẢI PHÁP */}
            <Link to="/#combos" className="px-4 py-3.5 hover:bg-primary-600 transition-colors">
              Combo giải pháp
            </Link>

            {/* THEO NGÀNH NGHỀ */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-3.5 hover:bg-primary-600 transition-colors outline-none cursor-pointer">
                <span>Theo ngành nghề</span>
                <ChevronDown size={14} />
              </button>
              {/* Submenu drop */}
              <ul className="absolute top-full left-0 w-56 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200/80 py-2 hidden group-hover:block animate-slide-up text-xs font-semibold">
                <li><Link to="/giai-phap/nha-xuong" className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-500 transition-colors">Nhà xưởng công nghiệp</Link></li>
                <li><Link to="/giai-phap/kho-logistics" className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-500 transition-colors">Kho hàng & Logistics</Link></li>
                <li><Link to="/giai-phap/benh-vien" className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-500 transition-colors">Bệnh viện & Phòng sạch</Link></li>
                <li><Link to="/giai-phap/nha-may-thuc-pham" className="block px-4 py-2 hover:bg-slate-50 hover:text-primary-500 transition-colors">Nhà máy thực phẩm & Thủy sản</Link></li>
              </ul>
            </div>

            {/* TIN TỨC KỸ THUẬT */}
            <Link to="/blog" className="px-4 py-3.5 hover:bg-primary-600 transition-colors">
              Tin tức kỹ thuật
            </Link>

            {/* ĐẠI LÝ B2B */}
            <Link to="/agency" className="px-4 py-3.5 bg-accent-500 text-primary-900 font-bold hover:bg-accent-600 transition-colors">
              Đại lý B2B
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE HEADER RESPONSIVE TOGGLE */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        <span className="font-heading font-bold text-sm tracking-wider">KHANG PHÚC MENU</span>
        <button
          onClick={toggleMobileMenu}
          className="p-1 text-white hover:bg-primary-600 rounded-md transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary-600 border-t border-white/10 text-white font-heading font-semibold text-xs tracking-wide uppercase p-4 space-y-3 animate-slide-up">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Trang chủ</Link>
          <div className="h-px bg-white/5" />
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Thiết bị máy móc</Link>
          <Link to="/products?cat=dia-mai" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Đĩa mài & Tools</Link>
          <Link to="/products?cat=son-hoa-chat" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Sơn & Hóa chất</Link>
          <Link to="/#combos" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Combo thi công</Link>
          <div className="h-px bg-white/5" />
          <Link to="/giai-phap/nha-xuong" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Giải pháp nhà xưởng</Link>
          <Link to="/giai-phap/kho-logistics" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Giải pháp logistics</Link>
          <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-accent-500">Tin tức kỹ thuật</Link>
          <Link to="/agency" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-center bg-accent-500 text-primary-900 rounded font-bold">
            Đăng nhập đại lý B2B
          </Link>
        </div>
      )}
    </nav>
  )
}
