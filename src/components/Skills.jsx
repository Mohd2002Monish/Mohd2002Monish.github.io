import React from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeader from './SectionHeader'

const ease = [0.16, 1, 0.3, 1]

const levelBars = {
  Expert: 3,
  Advanced: 2,
  Intermediate: 1,
}

function LevelMeter({ level }) {
  const filled = levelBars[level] || 1
  return (
    <div className="flex items-center gap-1" title={level}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="block h-[3px] w-4 transition-colors duration-300"
          style={{ background: i < filled ? 'var(--x-accent)' : 'var(--x-line)' }}
        />
      ))}
    </div>
  )
}

export const resolveIconUrl = (icon) => {
  if (!icon) return ''
  if (icon.startsWith('/') && !icon.startsWith('//')) {
    const base = import.meta.env.BASE_URL || '/'
    return `${base.replace(/\/$/, '')}${icon}`
  }
  return icon
}

function SkillCell({ skill, index }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
      }}
      className="x-skill-cell relative p-5 sm:p-6 flex flex-col gap-4"
      style={{ background: 'var(--x-bg)' }}
    >
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 flex items-center justify-center">
          <img
            src={resolveIconUrl(skill.icon)}
            alt={skill.name}
            className="x-skill-icon w-8 h-8 object-contain"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <span
            className="hidden w-8 h-8 items-center justify-center font-grotesk font-bold text-sm"
            style={{ border: '1px solid var(--x-line)', color: 'var(--x-muted)' }}
          >
            {skill.name.charAt(0)}
          </span>
        </div>
        <span className="font-mono text-[10px]" style={{ color: 'var(--x-faint)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <span className="font-grotesk font-semibold text-sm" style={{ color: 'var(--x-text)' }}>
          {skill.name}
        </span>
        <div className="flex items-center justify-between">
          <LevelMeter level={skill.level} />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--x-faint)' }}>
            {skill.level}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { state } = usePortfolio()
  const { skills } = state

  return (
    <section id="skills" className="x-section" style={{ background: 'var(--x-surface)' }}>
      <div className="x-container">
        <SectionHeader index="03" label="Stack" title="Tools of the trade" />

        {/* Hairline-divided grid: gap-px over a line-colored background */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px"
          style={{ background: 'var(--x-line-soft)', border: '1px solid var(--x-line-soft)' }}
        >
          {skills.map((skill, i) => (
            <SkillCell key={skill.id} skill={skill} index={i} />
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-center gap-6 mt-8"
        >
          {Object.entries(levelBars).map(([level, bars]) => (
            <div key={level} className="flex items-center gap-2.5">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="block h-[3px] w-3"
                    style={{ background: i < bars ? 'var(--x-accent)' : 'var(--x-line)' }}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--x-faint)' }}>
                {level}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
