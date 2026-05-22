import React from 'react'
import { Phone, Mail, MapPin, Building, ShieldCheck, User, LogOut, LayoutDashboard, LogIn } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Topbar() {
  const { isB2b, toggleB2b, activeBranch, setActiveBranch } = useApp()
  const { user, logout, isAdmin } = useAuth()

  return (
    <div className="bg-primary-900 text-white text-xs py-2 px-4 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left contacts info - Restructured into 2 rows for balance */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto items-center md:items-start text-slate-300">
          {/* Row 1: Hotline & Email */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <a href="tel:0982352528" className="flex items-center gap-1.5 hover:text-accent-500 transition-colors">
              <Phone size={12} className="text-accent-500" />
              <span>Hotline: 0982.352.528</span>
            </a>
            <span className="text-white/10 hidden sm:inline">|</span>
            <a href="mailto:contact@khangphuc.vn" className="flex items-center gap-1.5 hover:text-accent-500 transition-colors">
              <Mail size={12} className="text-slate-400" />
              <span>email: contact@khangphuc.vn</span>
            </a>
          </div>
          {/* Row 2: Zalo & Address */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <a href="https://zalo.me/0982352528" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-500 transition-colors text-slate-300">
              <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center font-bold text-[9px] text-white">Z</span>
              <span>Zalo Kỹ Thuật</span>
            </a>
            <span className="text-white/10 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-slate-400" />
              <span>Địa chỉ: Lô C4, KCN Cầu Giấy, Hà Nội</span>
            </div>
          </div>
        </div>

        {/* Right branch selection & B2B toggler */}
        <div className="flex items-center gap-4">
          {/* Warehouse Branch Selector */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Building size={12} className="text-secondary-500" />
            <span className="hidden sm:inline">Kho gần bạn:</span>
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
              className="bg-primary-600 text-white text-xs border-0 rounded px-2 py-0.5 focus:ring-1 focus:ring-accent-500 outline-none cursor-pointer"
            >
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="TP. HCM">TP. HCM / Bình Dương</option>
            </select>
          </div>

          <div className="h-3 w-px bg-white/10" />

          {/* B2B Mode Toggle Button */}
          <button
            onClick={toggleB2b}
            className={`relative flex items-center gap-1.5 py-1 px-2.5 rounded font-semibold transition-all duration-300 cursor-pointer ${
              isB2b
                ? 'bg-accent-500 text-primary-900 shadow-[0_0_12px_rgba(245,166,35,0.4)] animate-pulse'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <ShieldCheck size={13} className={isB2b ? 'text-primary-900' : 'text-slate-400'} />
            <span>{isB2b ? 'ĐẠI LÝ ACTIVE (Giá chiết khấu)' : 'ĐĂNG NHẬP ĐẠI LÝ'}</span>
          </button>

          <div className="h-3 w-px bg-white/10" />

          {/* Portal User Login / Register Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 py-1 px-2.5 rounded text-slate-200">
              <User size={13} className="text-teal-400" />
              <span className="font-semibold text-[11px] truncate max-w-[120px]">{user.name || user.email}</span>
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-teal-400 hover:text-teal-300 font-bold ml-1.5 flex items-center gap-0.5" title="Vào trang quản trị">
                  <LayoutDashboard size={12} />
                  <span className="hidden lg:inline text-[10px] uppercase">Quản trị</span>
                </Link>
              )}
              <button onClick={logout} className="text-red-400 hover:text-red-300 font-semibold ml-1.5 cursor-pointer flex items-center" title="Đăng xuất">
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <Link
              to="/admin"
              className="bg-teal-500 hover:bg-teal-400 text-primary-900 font-extrabold py-1 px-2.5 rounded transition-all flex items-center gap-1.5 shadow-[0_0_8px_rgba(20,184,166,0.2)]"
            >
              <LogIn size={13} />
              <span>ĐĂNG NHẬP / ĐĂNG KÝ</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
