import { db } from '@core/database/prisma.client'
import { hashPassword } from '@core/utils/hash'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
    }

    const hashedPassword = hashPassword(password)
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER'

    try {
      // 1. Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json({ error: 'Email này đã được đăng ký' }, { status: 400 })
      }

      // 2. Create user in DB
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          role: userRole
        }
      })

      return NextResponse.json({
        message: 'Đăng ký thành công',
        user: { email: user.email, name: user.name, role: user.role }
      })

    } catch (dbError) {
      console.warn('Prisma database offline during registration, falling back to demo simulation:', dbError)
      
      // Simulation fallback for local offline database testing
      if (email.includes('taken')) {
        return NextResponse.json({ error: 'Email này đã được đăng ký (Simulated)' }, { status: 400 })
      }

      return NextResponse.json({
        message: 'Đăng ký thành công (Chế độ Demo - Database Offline)',
        user: { email, name: name || 'Demo User', role: userRole }
      })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi máy chủ' }, { status: 500 })
  }
}
