'use client'

import React from 'react'
import { Phone, Mail, MapPin, Building, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Topbar() {
  const { isB2b, toggleB2b, activeBranch, setActiveBranch } = useApp()

  return (
    <div className="bg-primary-900 text-white text-xs py-2 px-4 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left contacts info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
          <a href="tel:0982352528" className="flex items-center gap-1.5 hover:text-accent-500 transition-colors">
            <Phone size={12} className="text-accent-500" />
            <span>Hotline: 0982.352.528</span>
          </a>
          <a href="https://zalo.me/0982352528" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-500 transition-colors">
            <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center font-bold text-[9px] text-white">Z</span>
            <span>Zalo Kỹ Thuật</span>
          </a>
          <a href="mailto:contact@khangphuc.vn" className="flex items-center gap-1.5 hover:text-accent-500 transition-colors">
            <Mail size={12} className="text-slate-400" />
            <span>email: contact@khangphuc.vn</span>
          </a>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <MapPin size={12} />
            <span>Địa chỉ: Lô C4, KCN Cầu Giấy, Hà Nội</span>
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
        </div>
      </div>
    </div>
  )
}
