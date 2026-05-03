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
              Je suis un étudiant en techniques de l'informatique au Collège LaSalle, passionné
              par le développement web full-stack. J'aime construire des interfaces intuitives
              et des APIs robustes.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              En dehors du code, je m'intéresse à [vos intérêts]. Je cherche constamment à
              apprendre de nouvelles technologies et à améliorer mes compétences.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { value: '3+', label: "Années d'études" },
                { value: '10+', label: 'Projets réalisés' },
                { value: '5+', label: 'Technologies' },
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