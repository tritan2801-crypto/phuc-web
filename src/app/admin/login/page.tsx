'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@core/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Mail, Lock, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const { user, login, loading } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If logged in as admin already, redirect straight to dashboard
    if (user && user.role === 'ADMIN') {
      router.push('/admin/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFormLoading(true)

    try {
      const res = await login(email, password)
      if (res.success) {
        // Redirection handled by useEffect or push
        router.push('/admin/dashboard')
      } else {
        setError(res.error || 'Đăng nhập không thành công')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối')
    } finally {
      setFormLoading(false)
    }
  }

  // Pre-fills and automatically triggers authentication for seamless testing
  const handleQuickSimulate = async (type: 'ADMIN' | 'USER') => {
    setError(null)
    setFormLoading(true)
    const testEmail = type === 'ADMIN' ? 'admin@khangphuc.com' : 'user@khangphuc.com'
    const testPass = type === 'ADMIN' ? 'admin123' : 'user123'

    setEmail(testEmail)
    setPassword(testPass)

    try {
      const res = await login(testEmail, testPass)
      if (res.success) {
        if (type === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/') // Redirect standard users to retail shop homepage
        }
      } else {
        setError(res.error || 'Simulated login failed')
      }
    } catch (err) {
      setError('Simulated connection error')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4 font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/15">
            <ShieldCheck size={28} className="stroke-[2]" />
          </div>
          <h2 className="font-heading font-black text-xl text-white tracking-wide uppercase pt-2">Khang Phúc Portal</h2>
          <p className="text-xs text-slate-400">Đăng nhập cổng quản trị và quản lý dịch vụ đại lý</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-3 text-red-300 text-xs">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email Đăng Nhập:</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@khangphuc.com"
                className="w-full bg-slate-950/65 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-650 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mật Khẩu:</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/65 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-650 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20"
          >
            {formLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="h-px bg-slate-800/80 my-2" />

        {/* DEMO / DEVELOPMENT SHORTCUTS */}
        <div className="space-y-3">
          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block text-center">Phím Tắt Giả Lập Hệ Thống (Development Only)</span>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickSimulate('ADMIN')}
              type="button"
              disabled={formLoading}
              className="py-2.5 bg-slate-800 hover:bg-slate-750 text-teal-400 hover:text-teal-300 font-bold text-[10px] rounded-xl border border-slate-700/60 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>Vào vai Admin</span>
            </button>

            <button
              onClick={() => handleQuickSimulate('USER')}
              type="button"
              disabled={formLoading}
              className="py-2.5 bg-slate-800 hover:bg-slate-750 text-blue-400 hover:text-blue-300 font-bold text-[10px] rounded-xl border border-slate-700/60 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>Vào vai Đại lý B2B</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
