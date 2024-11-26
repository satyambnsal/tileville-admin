import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_PASSWORD = process.env.TILEVILLE_ADMIN_PASSWORD || 'your-secure-password'

export const checkAuth = () => {
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.get('auth')?.value === ADMIN_PASSWORD

  if (!isAuthenticated) {
    redirect('/login')
  }
}
