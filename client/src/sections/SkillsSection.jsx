import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { SKILLS } from '../utils/constants'

export default function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
          Compétences
        </p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
          Mon stack technique
        </h2>
        <div ref={ref} className="grid md:grid-cols-3 gap-8">
          {Object.entries(SKILLS).map(([category, skills]) => (
            <div key={category} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest text-violet-600 dark:text-violet-400">
                {category}
              </h3>
              <div className="flex flex-col gap-4">
                {skills.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-violet-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}