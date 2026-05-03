import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { EXPERIENCES } from '../utils/constants'
import TimelineItem from '../components/TimelineItem'

export default function ExperienceSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
          Expérience
        </p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
          Mon parcours
        </h2>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          {EXPERIENCES.map((item, i) => (
            <TimelineItem key={item.id} item={item} isLast={i === EXPERIENCES.length - 1} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}