import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session_token')

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null })
    }

    try {
      const decodedString = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
      const user = JSON.parse(decodedString)
      return NextResponse.json({ user })
    } catch (e) {
      return NextResponse.json({ user: null })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 })
  }
}
