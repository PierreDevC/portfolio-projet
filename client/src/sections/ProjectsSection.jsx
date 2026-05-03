import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { PROJECTS } from '../utils/constants'
import ProjectCard from '../components/ProjectCard'

export default function ProjectsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
          Projets
        </p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
          Ce que j'ai construit
        </h2>
        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {PROJECTS.map(project => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}