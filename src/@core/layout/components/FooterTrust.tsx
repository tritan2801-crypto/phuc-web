'use client'

import React from 'react'
import { Award, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react'

interface Project {
  name: string
  area: string
  type: string
  client: string
}

const FEATURED_PROJECTS: Project[] = [
  {
    name: 'Nhà máy Samsung Thái Nguyên',
    area: '45.000 m²',
    type: 'Sàn Epoxy chống tĩnh điện',
    client: 'Nhà thầu xây dựng Hòa Bình',
  },
  {
    name: 'Kho Logistics SLS Bắc Ninh',
    area: '12.000 m²',
    type: 'Sàn tăng cứng Lithium Densifier',
    client: 'Chủ đầu tư SLS Group',
  },
  {
    name: 'Nhà xưởng VinFast Hải Phòng',
    area: '28.000 m²',
    type: 'Sơn phủ Epoxy tự san phẳng KCC',
    client: 'Tổng thầu Coteccons',
  },
  {
    name: 'Nhà máy Thực phẩm CP Củ Chi',
    area: '15.000 m²',
    type: 'Sàn kháng khuẩn Polyurethane (PU)',
    client: 'CP Vietnam Corp',
  },
]

export default function FooterTrust() {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CERTIFICATES COLUMN (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-accent-500" />
            <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
              Chứng Nhận & Uy Tín Đối Tác
            </h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            Khang Phúc tự hào cung cấp đầy đủ chứng chỉ chất lượng **CO, CQ** chuẩn quốc tế. Cam kết đền 200% nếu phát hiện sản phẩm nhái, không rõ nguồn gốc xuất xứ.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2.5 hover:border-accent-500/50 transition-all group">
              <ShieldCheck className="text-accent-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h5 className="text-[11px] font-bold text-white uppercase">ISO 9001:2015</h5>
                <p className="text-[9px] text-slate-500">Quản lý chất lượng đạt chuẩn</p>
              </div>
            </div>
            
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2.5 hover:border-secondary-500/50 transition-all group">
              <Award className="text-secondary-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h5 className="text-[11px] font-bold text-white uppercase">CO CQ PROVED</h5>
                <p className="text-[9px] text-slate-500">Nhập khẩu chính hãng 100%</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2.5 hover:border-accent-500/50 transition-all group">
              <CheckCircle2 className="text-accent-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h5 className="text-[11px] font-bold text-white uppercase">NPP ỦY QUYỀN</h5>
                <p className="text-[9px] text-slate-500">Karva, KCC, Kumisai, ASL</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2.5 hover:border-secondary-500/50 transition-all group">
              <ShieldCheck className="text-secondary-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h5 className="text-[11px] font-bold text-white uppercase">TÍN NHIỆM B2B</h5>
                <p className="text-[9px] text-slate-500">Đối tác tin cậy của nhà thầu</p>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
                Dự Án Tiêu Biểu Được Cung Cấp Thiết Bị
              </h4>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">Bàn giao trực tiếp tại công trình</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURED_PROJECTS.map((proj, idx) => (
              <div 
                key={idx} 
                className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:bg-slate-950/80 hover:border-slate-700 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary-500/5 to-transparent rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-all duration-500" />
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-bold text-white group-hover:text-accent-500 transition-colors line-clamp-1">
                    {proj.name}
                  </h5>
                  <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] text-secondary-500 font-bold shrink-0">
                    {proj.area}
                  </span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-medium">{proj.type}</p>
                  <p className="text-[9px] text-slate-500 flex items-center gap-1">
                    <span>Đại diện thi công:</span>
                    <span className="text-slate-400">{proj.client}</span>
                  </p>
                </div>
                <ChevronRight size={10} className="absolute bottom-2.5 right-2.5 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
