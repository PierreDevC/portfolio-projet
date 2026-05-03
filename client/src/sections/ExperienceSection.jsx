import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useApi } from '../hooks/useApi'
import TimelineItem from '../components/TimelineItem'

export default function ExperienceSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-200px' })
  const { data: experiences, loading } = useApi('/api/experiences')

  return (
    <section id="experience" ref={ref} className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Expérience</p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">Mon parcours</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {(experiences || []).map((item, i) => (
              <TimelineItem key={item.id} item={item} isLast={i === (experiences.length - 1)} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}