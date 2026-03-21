import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white/80 px-4 py-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
      <div className="mb-6">
        <div className="text-lg font-semibold">LearnFlow</div>
        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          {user ? `${user.name} (${user.role})` : 'Not signed in'}
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/home"
          end
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm ${
              isActive
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/70'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm ${
              isActive
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/70'
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>

      <div className="mt-6 space-y-3">
        {user ? (
          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-800/60"
            onClick={() => {
              onLogout()
              navigate('/')
            }}
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-800/60"
            onClick={() => navigate('/')}
          >
            Login
          </button>
        )}
      </div>
    </aside>
  )
}

