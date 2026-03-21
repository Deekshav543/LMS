import { Moon, Sun } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemeContext'

export default function DarkModeToggle() {
  const themeCtx = useContext(ThemeContext)
  if (!themeCtx) return null
  const { theme, toggleTheme } = themeCtx

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-2.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-900/50"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

