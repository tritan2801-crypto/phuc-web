import React, { useState } from 'react'
import { ShieldCheck, Download, CreditCard, ShoppingBag, Landmark, UserCheck, Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AgencyPortal() {
  const { isB2b, toggleB2b } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && password === '123456') {
      if (!isB2b) toggleB2b()
      setError('')
    } else {
      setError('Mật khẩu đăng nhập thử nghiệm đại lý là 123456!')
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {!isB2b ? (
        /* 1. B2B LOGIN SIMULATOR (IF NOT LOGGED IN) */
        <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-150 p-6 md:p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mx-auto">
              <Lock size={24} />
            </div>
            <h1 className="font-heading font-black text-lg text-slate-800 uppercase tracking-wider">
              Đăng nhập cổng đại lý B2B
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Dành riêng cho nhà phân phối mâm xoa máy mài, đơn vị thi công mài sàn tăng cứng bê tông và các đại lý vật tư Khang Phúc toàn quốc.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold text-center border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                Mã số thuế / Email đại lý:
              </label>
              <input
                type="text"
                placeholder="MST: 0108342528"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 px-3 py-2.5 border border-slate-200 rounded focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                Mật khẩu (Nhập thử nghiệm: 123456) *
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 px-3 py-2.5 border border-slate-200 rounded focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg text-xs tracking-wider transition-colors shadow cursor-pointer uppercase"
            >
              KÍCH HOẠT HỆ THỐNG BÁO GIÁ ĐẠI LÝ
            </button>
          </form>

          <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-400 leading-relaxed font-semibold">
            📢 <span className="text-slate-600">Đặc quyền tài khoản B2B:</span> Hiển thị chiết khấu 15-25% trực tiếp trên toàn bộ danh mục sản phẩm, theo dõi công nợ dài hạn gối đầu, hỗ trợ download catalog kỹ thuật chuẩn hóa dạng excel.
          </div>
        </div>
      ) : (
        /* 2. DYNAMIC B2B DEALER DASHBOARD PORTAL */
        <div className="space-y-8 animate-slide-up">
          {/* Header Dashboard panel */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-amber-500 rounded-full flex items-center justify-center text-primary-900 shadow-md">
                <UserCheck size={28} className="stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] bg-accent-500 text-primary-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Đại lý chính thức
                </span>
                <h1 className="font-heading font-black text-base md:text-lg text-slate-900 mt-1">
                  CÔNG TY CỔ PHẦN XÂY DỰNG & DỊCH VỤ KHANG PHÚC HÀ NỘI
                </h1>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Mã đại lý: KP-B2B-8902 | MST: 0108342528</p>
              </div>
            </div>

            <button
              onClick={toggleB2b}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-red-200 transition-colors self-start md:self-auto cursor-pointer"
            >
              THOÁT CHẾ ĐỘ ĐẠI LÝ (Xem giá lẻ)
            </button>
          </div>

          {/* Core figures: Outstanding credit meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
            {/* Credit limit */}
            <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                <Landmark size={16} className="text-primary-500" />
                <span>Hạn mức công nợ gối đầu:</span>
              </div>
              <p className="font-heading font-black text-base text-slate-800">500.000.000 ₫</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full w-[24%]" />
              </div>
              <div className="text-[9px] text-slate-400 font-semibold">Chiếm 24% tổng mức tín dụng được duyệt.</div>
            </div>

            {/* Current outstanding balance */}
            <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                <CreditCard size={16} className="text-red-500" />
                <span>Dư nợ hiện tại:</span>
              </div>
              <p className="font-heading font-black text-base text-red-500">120.000.000 ₫</p>
              <span className="inline-block bg-red-50 text-red-600 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
                Hạn thanh toán: 30/06/2026
              </span>
            </div>

            {/* Available credit */}
            <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                <ShieldCheck size={16} className="text-success" />
                <span>Hạn mức khả dụng:</span>
              </div>
              <p className="font-heading font-black text-base text-success">380.000.000 ₫</p>
              <div className="text-[10px] text-slate-400">
                Cho phép tiếp tục tạo đơn hàng gối đầu thanh toán sau 45 ngày.
              </div>
            </div>
          </div>

          {/* Orders database list & wholesale sheet downloads */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Simulated orders */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-3.5">
                <ShoppingBag size={14} className="text-primary-500" />
                <span>Đơn hàng công nợ gần đây</span>
              </h3>

              <div className="overflow-x-auto text-[11px] font-semibold text-slate-600">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150">
                      <th className="px-4 py-2">Mã Đơn</th>
                      <th className="px-4 py-2">Ngày đặt</th>
                      <th className="px-4 py-2">Mặt hàng chính</th>
                      <th className="px-4 py-2">Tổng giá đại lý</th>
                      <th className="px-4 py-2 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-bold text-slate-800">#KP-8902-1</td>
                      <td className="px-4 py-3">18/05/2026</td>
                      <td className="px-4 py-3 truncate max-w-[150px]">Máy mài ASL-600 T8, đĩa sắt mài phá...</td>
                      <td className="px-4 py-3 font-bold text-primary-500">72.500.000 ₫</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-extrabold uppercase">
                          ĐANG VẬN CHUYỂN
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-slate-800">#KP-8902-2</td>
                      <td className="px-4 py-3">10/05/2026</td>
                      <td className="px-4 py-3 truncate max-w-[150px]">Chất tăng cứng Lithium LP-01, bay răng cưa...</td>
                      <td className="px-4 py-3 font-bold text-primary-500">18.900.000 ₫</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-0.5 bg-success/15 text-success rounded text-[9px] font-extrabold uppercase">
                          ĐÃ GIAO HÀNG
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Wholesale price sheets download */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider border-b pb-3.5">
                Tài liệu & Bảng giá
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => alert('Đang tải về bảng giá chiết khấu đại lý Khang Phúc 2026 dạng Excel...')}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">BẢNG GIÁ EXCEL ĐẠI LÝ 2026</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">File cập nhật ngày 15/05/2026 (1.2 MB)</span>
                  </div>
                  <Download size={16} className="text-primary-500" />
                </button>

                <button
                  onClick={() => alert('Đang tải về Catalogue thiết bị máy mài sàn & chà sàn công nghiệp PDF...')}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">CATALOGUE SẢN PHẨM PDF</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Đầy đủ thông số cơ lý hình ảnh (8.4 MB)</span>
                  </div>
                  <Download size={16} className="text-secondary-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
