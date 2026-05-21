'use client'

import React, { useEffect, useState } from 'react'
import { Users, UserPlus, Shield, ShieldCheck, Mail, Loader2, AlertTriangle } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
    name: '',
    role: 'USER'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (e) {
      console.error('Error fetching users', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleRole = async (userId: string, currentRole: 'USER' | 'ADMIN') => {
    const nextRole = currentRole === 'USER' ? 'ADMIN' : 'USER'
    if (!confirm(`Bạn có chắc chắn muốn chuyển phân quyền của tài khoản này sang ${nextRole} không?`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nextRole })
      })

      if (res.ok) {
        fetchUsers() // reload table
      } else {
        alert('Cập nhật quyền thất bại')
      }
    } catch (e) {
      alert('Lỗi kết nối hệ thống')
    }
  }

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    setFormLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      })

      if (res.ok) {
        setFormSuccess('Đăng ký tài khoản thành công!')
        setFormFields({
          email: '',
          password: '',
          name: '',
          role: 'USER'
        })
        fetchUsers() // reload table
      } else {
        const data = await res.json()
        setFormError(data.error || 'Tạo tài khoản thất bại')
      }
    } catch (err) {
      setFormError('Lỗi kết nối máy chủ')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-200 selection:bg-teal-500 selection:text-slate-950">
      
      {/* REGISTER NEW USER FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <UserPlus size={18} className="text-teal-400" />
          <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Tạo tài khoản mới</h3>
        </div>

        {formError && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-red-300 text-xs">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 text-xs font-semibold">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleCreateUserSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Họ và tên *:</label>
            <input
              type="text"
              required
              value={formFields.name}
              onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
              placeholder="Ví dụ: Đại lý Hà Nội"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email Đăng Nhập *:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-650" size={14} />
              <input
                type="email"
                required
                value={formFields.email}
                onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                placeholder="daily@khangphuc.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mật khẩu *:</label>
            <input
              type="password"
              required
              value={formFields.password}
              onChange={(e) => setFormFields({ ...formFields, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Vai trò (Phân quyền):</label>
            <select
              value={formFields.role}
              onChange={(e) => setFormFields({ ...formFields, role: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-350 focus:border-teal-500 focus:outline-none transition-all cursor-pointer font-semibold"
            >
              <option value="USER">Đại lý sỉ / Khách lẻ (USER)</option>
              <option value="ADMIN">Ban quản trị hệ thống (ADMIN)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-850 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-teal-500/10"
          >
            {formLoading ? <Loader2 className="animate-spin" size={16} /> : <span>TẠO TÀI KHOẢN MỚI</span>}
          </button>
        </form>
      </div>

      {/* USERS LIST TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl lg:col-span-2 overflow-hidden shadow-xl h-fit">
        <div className="p-5 border-b border-slate-850 flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Danh sách tài khoản</h3>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Loader2 className="animate-spin text-teal-400 mx-auto" size={32} />
            <p className="text-xs font-semibold uppercase tracking-wider">Đang tải danh sách thành viên...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <Users className="mx-auto text-slate-650" size={48} />
            <p className="text-xs font-bold">Không tìm thấy tài khoản nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-850/50 text-slate-450 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-5">Tài khoản</th>
                  <th className="p-4">Phân quyền</th>
                  <th className="p-4">Ngày đăng ký</th>
                  <th className="p-4 pr-5 text-center">Đổi quyền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 font-semibold text-slate-350">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="p-4 pl-5">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold block">{item.name || 'Thành viên mới'}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">{item.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.role === 'ADMIN' ? (
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[9px] font-bold text-teal-400 uppercase tracking-wider">
                          Quản trị viên
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-550 uppercase tracking-wider">
                          Đại lý sỉ (USER)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[10px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 pr-5 text-center">
                      <button
                        onClick={() => handleToggleRole(item.id, item.role)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                          item.role === 'ADMIN'
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            : 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20'
                        }`}
                      >
                        {item.role === 'ADMIN' ? 'Hạ cấp sỉ' : 'Lên Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
