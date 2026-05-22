import React, { useEffect, useState } from 'react'
import { Package, Users, Warehouse, Milestone, RefreshCw, Layers } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    categories: {
      'may-moc': 0,
      'dia-mai': 0,
      'son-hoa-chat': 0,
      'other': 0
    },
    loading: true
  })

  const fetchStats = async () => {
    setStats(prev => ({ ...prev, loading: true }))
    try {
      // 1. Fetch Products
      const prodRes = await fetch('/api/products')
      const prodData = await prodRes.json()
      const productsList = prodData.products || []

      // 2. Fetch Users
      const userRes = await fetch('/api/admin/users')
      const userData = await userRes.json()
      const usersList = userData.users || []

      // Compute Category Breakdown
      const breakdown = {
        'may-moc': 0,
        'dia-mai': 0,
        'son-hoa-chat': 0,
        'other': 0
      }

      productsList.forEach((p: any) => {
        const cat = p.category
        if (cat === 'may-moc') breakdown['may-moc']++
        else if (cat === 'dia-mai') breakdown['dia-mai']++
        else if (cat === 'son-hoa-chat' || cat.startsWith('son')) breakdown['son-hoa-chat']++
        else breakdown['other']++
      })

      setStats({
        products: productsList.length,
        users: usersList.length,
        categories: breakdown,
        loading: false
      })
    } catch (e) {
      console.error('Error fetching dashboard stats', e)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Metrics configurations
  const metricCards = [
    { name: 'Tổng số sản phẩm', value: stats.products, icon: Package, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { name: 'Thành viên đăng ký', value: stats.users, icon: Users, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { name: 'Hệ thống kho bãi', value: 2, icon: Warehouse, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'Gói giải pháp sỉ', value: 2, icon: Milestone, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  ]

  const totalProducts = stats.products || 1

  return (
    <div className="space-y-8 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Banner section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-800 flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <span className="text-[9px] bg-teal-500/10 text-teal-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Bảng Điều Khiển
          </span>
          <h2 className="font-heading font-black text-xl text-white">Chào quay trở lại, {user?.name || 'Admin'}!</h2>
          <p className="text-xs text-slate-400">Hệ thống đang hoạt động ổn định. Dưới đây là thông số thống kê mới nhất.</p>
        </div>

        <button
          onClick={fetchStats}
          disabled={stats.loading}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
          title="Tải lại số liệu"
        >
          <RefreshCw size={16} className={stats.loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.name} className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{card.name}</span>
                {stats.loading ? (
                  <div className="h-7 w-12 bg-slate-800 animate-pulse rounded" />
                ) : (
                  <span className="font-heading font-black text-2xl text-white">{card.value}</span>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color.split(' ')[1]} ${card.color.split(' ')[0]}`}>
                <Icon size={22} className="stroke-[1.75]" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CATEGORY BREAKDOWN CHART */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Layers size={18} className="text-teal-400" />
            <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Cơ cấu danh mục sản phẩm</h3>
          </div>

          {stats.loading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2">
                  <div className="h-3 w-1/4 bg-slate-800 animate-pulse rounded" />
                  <div className="h-2 w-full bg-slate-800 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {[
                { label: 'Thiết bị & Máy móc công nghiệp', count: stats.categories['may-moc'], color: 'bg-teal-500' },
                { label: 'Đĩa mài & Phụ kiện mâm xoa', count: stats.categories['dia-mai'], color: 'bg-blue-500' },
                { label: 'Sơn & Hóa chất phủ nền', count: stats.categories['son-hoa-chat'], color: 'bg-amber-500' },
                { label: 'Vật tư & Khác', count: stats.categories['other'], color: 'bg-slate-650' }
              ].map((cat) => {
                const percentage = Math.round((cat.count / totalProducts) * 100)
                return (
                  <div key={cat.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{cat.label}</span>
                      <span className="text-slate-200">{cat.count} sản phẩm ({percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* LOG SYSTEM / STATS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Users size={18} className="text-blue-400" />
            <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Thông tin phiên chạy</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tài khoản:</span>
                <span className="text-slate-200 font-bold">{user?.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Phân quyền:</span>
                <span className="text-teal-400 font-bold uppercase tracking-wider">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Môi trường:</span>
                <span className="text-slate-200 font-bold">Local development</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ghi chú vận hành:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hệ thống API hỗ trợ kiểm tra database liên tục. Nếu MySQL Docker của bạn ngoại tuyến (offline), hệ thống tự động kích hoạt chế độ **Demo Fallback** để bạn vẫn có thể thực hiện CRUD sản phẩm, giả lập tài khoản mà không bị gián đoạn.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
