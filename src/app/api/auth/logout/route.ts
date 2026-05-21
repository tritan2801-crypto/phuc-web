import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session_token')

    return NextResponse.json({ message: 'Đăng xuất thành công' })
  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 })
  }
}
