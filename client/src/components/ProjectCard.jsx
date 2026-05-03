import { FiGithub, FiExternalLink } from 'react-icons/fi'

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="h-40 rounded-lg overflow-hidden bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
        {project.image
          ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          : <span className="text-4xl font-bold text-violet-400 opacity-40">{String(project.id).padStart(2, '0')}</span>
        }
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
        <a href={project.github} target="_blank" rel="noreferrer"
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          <FiGithub size={15} /> Code source
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <FiExternalLink size={15} /> Voir le projet
          </a>
        )}
      </div>
    </div>
  )
}