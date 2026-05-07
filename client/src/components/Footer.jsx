import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Pierre — Tous droits réservés
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/PierreDevC" target="_blank" rel="noreferrer"
            className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <FiGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/pierre-sylvestre-cypre/" target="_blank" rel="noreferrer"
            className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <FiLinkedin size={20} />
          </a>
          <a href="mailto:pscypre@gmail.com"
            className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <FiMail size={20} />
          </a>
          <Link to="/admin"
            className="text-xs text-gray-300 dark:text-gray-700 hover:text-gray-500 dark:hover:text-gray-500 transition-colors">
            admin
          </Link>
        </div>
      </div>
    </footer>
  )
}