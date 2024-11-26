import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.TILEVILLE_ADMIN_PASSWORD

    // Early return if admin password is not set
    if (!adminPassword) {
      console.error('TILEVILLE_ADMIN_PASSWORD environment variable is not set')
      return NextResponse.json({ success: false }, { status: 500 })
    }

    if (password === adminPassword) {
      const cookieStore = await cookies()
      cookieStore.set('auth', adminPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
