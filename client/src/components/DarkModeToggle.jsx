import { useTheme } from '../hooks/useTheme'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function DarkModeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  )
}