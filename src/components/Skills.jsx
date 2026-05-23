import React from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

const levelColors = {
  Expert: 'from-violet-500 to-violet-400 border-violet-500/30 bg-violet-500/10 text-violet-300',
  Advanced: 'from-cyan-500 to-cyan-400 border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  Intermediate: 'from-blue-500 to-blue-400 border-blue-500/30 bg-blue-500/10 text-blue-300',
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Skills() {
  const { state } = usePortfolio()
  const { skills } = state

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">My Skills</h2>
          <p className="section-subtitle">Technologies I work with day to day</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.05 }}
              className="skill-card group"
            >
              <div className="w-14 h-14 flex items-center justify-center">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-cyan-500/30 items-center justify-center text-white font-bold text-lg">
                  {skill.name.charAt(0)}
                </div>
              </div>
              <span className="text-white font-medium text-sm text-center">{skill.name}</span>
              {skill.level && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${levelColors[skill.level] || levelColors.Intermediate}`}>
                  {skill.level}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
