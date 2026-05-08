import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-12 items-center"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
              À propos
            </p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Passionné par le code,<br />
              <span className="text-violet-600 dark:text-violet-400">obsédé par les détails.</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Étudiant en techniques de l'informatique au Collège LaSalle, je me spécialise
              en développement web et mobile full-stack. J'ai conçu et déployé des applications
              prêtes pour la production supportant plusieurs utilisateurs, avec des pipelines
              CI/CD et Docker.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Ma formation en design graphique nourrit mon attention portée à l'expérience
              utilisateur et à l'interface. Bilingue (FR/EN), je m'intéresse particulièrement
              au développement mobile et à l'intégration de l'IA dans les applications modernes.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { value: '5+', label: 'Projets déployés' },
                { value: '15+', label: 'Technologies' },
                { value: '2', label: 'Expériences pro' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}