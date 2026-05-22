import React, { useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, Users, LogOut, Home, ShieldCheck, Loader2, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    // If not loading and no user is logged in, redirect to login page
    if (!loading && !user && pathname !== '/admin/login') {
      navigate('/admin/login')
    }
  }, [user, loading, pathname, navigate])

  // Show beautiful loading spinner on initial authentication check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-teal-400 mb-4" size={40} />
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Đang kiểm tra quyền truy cập...</p>
      </div>
    )
  }

  // If logged in but not an Admin, render an unauthorized page
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-red-500/20 text-center max-w-md shadow-xl space-y-5">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck size={36} className="stroke-[1.5]" />
          </div>
          <h2 className="font-heading font-black text-lg uppercase text-red-400">Không có quyền truy cập</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tài khoản <span className="text-slate-200 font-bold">{user.email}</span> của bạn không có vai trò Quản trị viên (ADMIN). Vui lòng liên hệ bộ phận kỹ thuật hoặc đăng nhập bằng tài khoản khác.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-650 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Về Trang Chủ
            </button>
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-650 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Sidebar navigation menu items
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Sản phẩm', path: '/admin/products', icon: Package },
    { name: 'Thành viên', path: '/admin/users', icon: Users },
    { name: 'Hành vi', path: '/admin/analytics', icon: Activity },
  ]

  return (
    <div className="h-screen bg-slate-955 font-sans text-slate-100 flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 h-full">
        <div>
          {/* Logo Brand Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-heading font-black text-sm">
              KP
            </div>
            <div>
              <h2 className="font-heading font-black text-sm tracking-wider uppercase">Khang Phúc</h2>
              <span className="text-[10px] text-teal-400 font-bold tracking-widest uppercase">Admin Portal</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1.5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all cursor-pointer text-left"
          >
            <Home size={16} />
            <span>Về trang chủ</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer text-left"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* HEADER TOOLBAR */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between flex-shrink-0">
          <h1 className="font-heading font-black text-sm uppercase tracking-wider text-slate-200">
            {pathname === '/admin/dashboard'
              ? 'Hệ Thống Thống Kê'
              : pathname === '/admin/products'
              ? 'Quản Lý Danh Mục Sản Phẩm'
              : pathname === '/admin/users'
              ? 'Quản Lý Tài Khoản Thành Viên'
              : pathname === '/admin/analytics'
              ? 'Phân Tích Hành Vi Người Dùng'
              : 'Trang Quản Trị'}
          </h1>

          {/* User Profile bar */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold block text-slate-200">{user?.name || 'Quản trị viên'}</span>
              <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">{user?.role}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-xs select-none">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 p-5 sm:p-6 bg-slate-955 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
