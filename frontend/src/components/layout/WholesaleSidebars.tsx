import React from 'react'
import { Phone, FileText, Truck, Percent, ShieldAlert } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const PRODUCT_WEIGHTS: Record<string, number> = {
  'may-mai-kvg-17e': 48.0,
  'may-mai-kms-250': 90.0,
  'may-mai-asl-600': 290.0,
  'may-mai-ronlon-800': 580.0,
  'may-hut-bui-kms-80': 25.0,
  'may-cha-san-kms-50b': 110.0,
  'chat-tang-cung-lithium': 22.0,
  'son-epoxy-tu-san': 20.0,
  'dia-mai-kim-cuong-30': 0.45,
  'resin-pad-50': 0.08,
  'bay-rang-cua-inox': 0.40,
  'tape-safety-yellow': 0.25,
  'gloves-protective': 0.06,
  'roller-spike-epoxy': 0.35
}

export default function WholesaleSidebars() {
  const { isB2b, cart, setIsCartOpen } = useApp()

  // Calculate cart weight
  const totalWeight = cart.reduce((sum, item) => {
    const weight = PRODUCT_WEIGHTS[item.id] || 0.1
    return sum + weight * item.quantity
  }, 0)

  // Choose truck limit depending on current weight
  const truckLimit = totalWeight <= 1500 ? 1500 : 5000
  const weightPercent = Math.min((totalWeight / truckLimit) * 100, 100)

  return (
    <>
      {/* LEFT SIDEBAR: WHOLESALE CONTACT */}
      <div className="fixed left-0 top-[35%] z-40 hidden xl:flex flex-col w-48 bg-slate-900 border border-slate-700/60 text-white rounded-r-2xl shadow-xl overflow-hidden transition-all duration-300 -translate-x-1/2 hover:translate-x-0 hover:border-accent-500 font-sans cursor-pointer">
        <div className="bg-accent-500 px-4 py-2.5 text-slate-900 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Percent size={14} className="stroke-[2.5]" />
          <span>Chiết Khấu B2B</span>
        </div>
        <div className="p-4 space-y-3.5">
          <p className="text-[11px] text-slate-300 leading-normal font-medium">
            Nhà thầu & đại lý nhận chiết khấu sỉ lên tới <strong className="text-accent-500 font-bold">25%</strong> cho máy mài sàn và hóa chất.
          </p>
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Hotline B2B:</span>
            <a href="tel:0909123456" className="flex items-center gap-1.5 text-xs text-white font-extrabold hover:text-accent-500 transition-colors">
              <Phone size={12} className="text-accent-500" />
              <span>0909.123.456</span>
            </a>
          </div>
          <a
            href="https://zalo.me/0909123456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] tracking-wider py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <span>LIÊN HỆ ZALO SALE</span>
          </a>
          <button
            onClick={() => window.open('https://cdn.khangphuc.com/catalog/b2b-price-list.pdf', '_blank')}
            className="flex items-center justify-center gap-1.5 w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-[10px] tracking-wider py-2 rounded-lg transition-colors cursor-pointer"
          >
            <FileText size={12} />
            <span>TẢI BẢNG GIÁ SỈ</span>
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR: CARGO LOGISTICS & CREDIT TRACKER */}
      <div className="fixed right-0 top-[35%] z-40 hidden xl:flex flex-col w-48 bg-slate-900 border border-slate-700/60 text-white rounded-l-2xl shadow-xl overflow-hidden transition-all duration-300 translate-x-1/2 hover:translate-x-0 hover:border-secondary-500 font-sans cursor-pointer">
        {isB2b ? (
          // B2B MODE: CREDIT & DEBT PROGRESS
          <>
            <div className="bg-secondary-500 px-4 py-2.5 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>Hạn Mức Công Nợ</span>
            </div>
            <div className="p-4 space-y-3.5">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Hạn mức sỉ cấp:</span>
                <span className="text-sm font-extrabold text-white block">500.000.000 ₫</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Dư nợ hiện tại:</span>
                <span className="text-sm font-bold text-accent-500 block">120.000.000 ₫</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Kỳ hạn trả nợ:</span>
                <span className="font-semibold text-white">30 ngày</span>
              </div>
            </div>
          </>
        ) : (
          // RETAIL MODE: GUEST/TRUCK CAPACITY WEIGHT TRACKER
          <>
            <div className="bg-primary-500 px-4 py-2.5 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Truck size={14} />
              <span>Trọng Tải Chuyến Xe</span>
            </div>
            <div className="p-4 space-y-3.5">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Khối lượng giỏ:</span>
                <span className="text-xs font-bold text-white block">
                  {totalWeight.toFixed(1)} kg / {truckLimit} kg
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${totalWeight > 1500 ? 'bg-amber-500' : 'bg-secondary-500'}`}
                  style={{ width: `${weightPercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                {totalWeight === 0 
                  ? 'Thêm hàng để đo tải trọng xe tải hỗ trợ công trình.'
                  : `Xe tải ${truckLimit === 1500 ? '1.5' : '5'} Tấn còn thừa ${(truckLimit - totalWeight).toFixed(1)}kg tải trọng.`}
              </p>
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center justify-center gap-1 w-full bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[10px] tracking-wider py-2 rounded-lg transition-colors cursor-pointer"
              >
                <span>XEM CHI TIẾT XE</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
