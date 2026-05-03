import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiDownload } from 'react-icons/fi'

export default function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="flex-1 flex flex-col gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Disponible pour des missions
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Pierre
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Développeur Full Stack — React · Node.js · MongoDB
          </p>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Je transforme des idées en applications web modernes, performantes et accessibles.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
              Me contacter
            </a>
            <a href="/cv.pdf" download
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-500 dark:hover:border-violet-500 rounded-lg font-medium transition-colors">
              <FiDownload size={16} /> Télécharger CV
            </a>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/PierreDevC" target="_blank" rel="noreferrer"
              className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <FiGithub size={22} />
            </a>
            <a href="https://www.linkedin.com/in/pierre-sylvestre-cypre/" target="_blank" rel="noreferrer"
              className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <FiLinkedin size={22} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="shrink-0"
        >
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-violet-500/30 shadow-xl shadow-violet-500/20">
            <img
              src="/avatar.webp"
              alt="Photo de profil"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}