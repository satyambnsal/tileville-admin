import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_PASSWORD = process.env.TILEVILLE_ADMIN_PASSWORD ?? 'your-secure-password'

export async function checkAuth() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('auth')
    const isAuthenticated = authCookie?.value === ADMIN_PASSWORD

    if (!isAuthenticated) {
      redirect('/login')
    }
  } catch (err) {
    console.error('Authentication error:', err)
    redirect('/login')
  }
}
