'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Clock, Compass, Navigation } from 'lucide-react'

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  mapUrl: string
  coords: string
}

const BRANCHES: Branch[] = [
  {
    id: 'KHO_HN',
    name: 'Tổng Kho Hà Nội (Miền Bắc)',
    address: 'Lô C4, KCN Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
    phone: '0982.352.528',
    hours: '08:00 - 17:30 (Thứ 2 - Thứ 7)',
    coords: '21.0288° N, 105.7801° E',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0968141846067!2d105.78010377508093!3d21.02881188062061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c11f2d%3A0x1af110a354c46f!2sDuy%20T%C3%A2n%2C%20C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vietnam!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s',
  },
  {
    id: 'KHO_HCM',
    name: 'Tổng Kho Bình Dương / TP. HCM (Miền Nam)',
    address: 'Số 24/8 Đường DT743, Khu Phố Bình Phước B, Bình Chuẩn, Thuận An, Bình Dương',
    phone: '0979.141.528',
    hours: '08:00 - 17:30 (Thứ 2 - Thứ 7)',
    coords: '10.8826° N, 106.7214° E',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.0645672909477!2d106.72147367485848!3d10.882650789273105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d7df64be203d%3A0xcb04f7f2b1d3d640!2zQsO5aSBUaOG7iyBYdcOibiwgRMSpIEFuLCBCw6xuaCBExrDGoW5nLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000001!5m2!1sen!2s',
  },
  {
    id: 'VP_DN',
    name: 'Văn Phòng Đại Diện Đà Nẵng (Miền Trung)',
    address: 'Số 482 Nguyễn Lương Bằng, Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng',
    phone: '0982.352.528',
    hours: '08:00 - 17:00 (Thứ 2 - Thứ 6)',
    coords: '16.0752° N, 108.1518° E',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8123512803657!2d108.15181777495071!3d16.075251484605908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218de3f2b6a93%3A0x608e063f25c2763f!2zTmd1eeG7hW4gTOG7k25nIELhurFuZywgTGnDqm4gQ2hp4buDdSwgxJDDoCBO4bq5bmcsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1700000000002!5m2!1sen!2s',
  },
]

interface ProvinceConfig {
  name: string
  closestWarehouse: string
  distance: string
  shippingNote: string
}

const PROVINCES: ProvinceConfig[] = [
  { name: 'Hà Nội / Bắc Ninh / Hưng Yên', closestWarehouse: 'Tổng Kho Hà Nội', distance: '15 - 30 km', shippingNote: 'Hỗ trợ xe cẩu giao hàng siêu tốc trong ngày.' },
  { name: 'Hải Phòng / Quảng Ninh / Hải Dương', closestWarehouse: 'Tổng Kho Hà Nội', distance: '80 - 120 km', shippingNote: 'Vận chuyển bằng xe tải 5 tấn ghép hàng tiết kiệm.' },
  { name: 'Thanh Hóa / Nghệ An / Hà Tĩnh', closestWarehouse: 'Tổng Kho Hà Nội', distance: '150 - 300 km', shippingNote: 'Vận chuyển qua nhà xe dự án, nhận hàng sau 1 ngày.' },
  { name: 'Đà Nẵng / Quảng Nam / Huế', closestWarehouse: 'Văn Phòng Đà Nẵng', distance: '10 - 50 km', shippingNote: 'Giao nhanh thiết bị mài và đĩa kim cương mỏ.' },
  { name: 'TP. HCM / Bình Dương / Đồng Nai', closestWarehouse: 'Tổng Kho Bình Dương', distance: '10 - 40 km', shippingNote: 'Giao hàng xe tải xưởng trộn nhanh, miễn phí tự bốc.' },
  { name: 'Long An / Tiền Giang / Miền Tây', closestWarehouse: 'Tổng Kho Bình Dương', distance: '60 - 150 km', shippingNote: 'Vận chuyển chành xe liên tỉnh hoặc GHTK hàng nhẹ.' },
  { name: 'Lâm Đồng / Đắk Lắk / Tây Nguyên', closestWarehouse: 'Tổng Kho Bình Dương', distance: '250 - 350 km', shippingNote: 'Vận chuyển xe tải lớn chuyên dụng hoặc gửi chành xe.' },
]

export default function FooterBranches() {
  const [selectedBranch, setSelectedBranch] = useState<string>('KHO_HN')
  const [clientProvince, setClientProvince] = useState<string>('')
  
  const currentBranch = BRANCHES.find(b => b.id === selectedBranch) || BRANCHES[0]
  const closestData = PROVINCES.find(p => p.name === clientProvince)

  return (
    <div className="bg-slate-950 border-b border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* BRANCH DETAILS & FINDER (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent-500 rounded-sm inline-block" />
              Hệ Thống Chi Nhánh & Kho Hàng
            </h4>
            <p className="text-slate-400 text-xs">
              Các tổng kho lớn tích hợp máy móc sẵn hàng, đĩa mài kim cương và hóa chất xây dựng.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 gap-1">
            {BRANCHES.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`flex-1 text-[10px] sm:text-xs py-2 px-1 text-center font-heading font-bold rounded-md transition-all cursor-pointer ${
                  selectedBranch === b.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {b.id === 'KHO_HN' ? 'Hà Nội' : b.id === 'KHO_HCM' ? 'Bình Dương' : 'Đà Nẵng'}
              </button>
            ))}
          </div>

          {/* Active Branch Information */}
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-3.5 text-xs text-slate-300">
            <div className="font-heading font-bold text-white text-sm">
              {currentBranch.name}
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-accent-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{currentBranch.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-secondary-500 shrink-0" />
                <span>Hotline kho: <strong className="text-white">{currentBranch.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-500 shrink-0" />
                <span>Giờ làm việc: {currentBranch.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Compass size={12} />
                <span>Tọa độ GPS: {currentBranch.coords}</span>
              </div>
            </div>
          </div>

          {/* Interactive Nearest Warehouse Calculator */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
            <h5 className="font-heading font-extrabold text-xs text-white uppercase flex items-center gap-1.5">
              <Navigation size={13} className="text-secondary-500" />
              Tìm Kho Gần Bạn Nhất
            </h5>
            <p className="text-[10px] text-slate-400">
              Chọn khu vực thi công dự án để hệ thống tối ưu hóa quãng đường vận chuyển và báo giá ship xe tải.
            </p>
            
            <div className="space-y-2">
              <select
                value={clientProvince}
                onChange={(e) => setClientProvince(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent-500 cursor-pointer"
              >
                <option value="">-- Chọn khu vực công trình của bạn --</option>
                {PROVINCES.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>

              {closestData && (
                <div className="bg-primary-950/40 border border-primary-500/20 p-2.5 rounded text-[11px] space-y-1.5 animate-slide-up">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Kho xuất hàng tốt nhất:</span>
                    <strong className="text-accent-500">{closestData.closestWarehouse}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Khoảng cách ước tính:</span>
                    <span className="text-white font-medium">~ {closestData.distance}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 mt-1">
                    💡 <strong>Ghi chú logistics:</strong> {closestData.shippingNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GOOGLE MAPS EMBED (7 cols) */}
        <div className="lg:col-span-7 h-80 lg:h-auto min-h-[300px] rounded-xl overflow-hidden border border-slate-800 relative group bg-slate-900 shadow-premium">
          <iframe
            src={currentBranch.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity duration-300"
            title={currentBranch.name}
          />
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] text-white px-2.5 py-1 rounded shadow flex items-center gap-1.5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Đang xem bản đồ: {currentBranch.name}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
