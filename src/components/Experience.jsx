import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Calendar } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import FormattedDescription from './FormattedDescription'

export default function Experience() {
  const { state } = usePortfolio()
  const experiences = [...state.experiences].sort((a, b) => Number(b.year) - Number(a.year))

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">My professional journey so far</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="timeline-item"
            >
              {/* Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 border-2 border-navy-900 shadow-lg shadow-violet-500/30" />

              <div className="glass-card p-6 ml-4 hover:border-violet-500/30 transition-all duration-300 group">
                {/* Year badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-3">
                  <Calendar size={11} />
                  {exp.year}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <span className="text-cyan-400 text-sm font-semibold flex items-center gap-1.5">
                    <Calendar size={13} />
                    {exp.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={14} className="text-violet-400" />
                  <span className="text-violet-300 font-semibold">{exp.company}</span>
                </div>

                <FormattedDescription text={exp.description} className="text-gray-400 text-sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
