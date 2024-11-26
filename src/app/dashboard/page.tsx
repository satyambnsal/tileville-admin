import { checkAuth } from '@/lib/auth'
import NotificationForm from '@/components/NotificationForm'
import Header from '@/components/Header'

export default function DashboardPage() {
  checkAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Send Notification</h2>
          <NotificationForm />
        </div>
      </main>
    </div>
  )
}
