export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">TileVille Admin</h1>

          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/api/auth/logout" className="text-gray-600 hover:text-gray-900">
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
