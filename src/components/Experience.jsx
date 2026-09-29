import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, Briefcase, Layers } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeader from './SectionHeader'

const ease = [0.16, 1, 0.3, 1]

// Parses raw experience descriptions into bullet items and tech tags
function parseExperience(description) {
  if (!description) return { bullets: [], techTags: [] }

  const lines = description
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  const bullets = []
  const techTags = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.toLowerCase().startsWith('tech stack')) {
      if (i + 1 < lines.length && !lines[i + 1].startsWith('-')) {
        const tags = lines[i + 1].split(/[,|]/).map(t => t.trim()).filter(Boolean)
        techTags.push(...tags)
        i++
        continue
      }
    }
    bullets.push(line)
  }

  return {
    bullets,
    techTags,
  }
}

function BulletItem({ text }) {
  const isBullet = text.startsWith('-') || text.startsWith('•') || text.startsWith('*')
  const content = isBullet ? text.substring(1).trim() : text

  return (
    <div className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--x-muted)' }}>
      <span
        className="w-1.5 h-1.5 flex-shrink-0 mt-2 rounded-[1px] transition-colors duration-200"
        style={{ background: 'var(--x-accent)' }}
      />
      <span className="flex-1">{content}</span>
    </div>
  )
}

function MilestoneNode({ index, total, progress, isCurrent }) {
  const threshold = index === 0 ? 0 : (index / (total - 1)) * 0.94

  const borderColor = useTransform(
    progress,
    [Math.max(0, threshold - 0.08), Math.max(0.01, threshold)],
    ['rgba(240, 239, 236, 0.15)', 'var(--x-accent)']
  )

  const textColor = useTransform(
    progress,
    [Math.max(0, threshold - 0.08), Math.max(0.01, threshold)],
    ['var(--x-muted)', 'var(--x-accent)']
  )

  const glowShadow = useTransform(
    progress,
    [Math.max(0, threshold - 0.08), Math.max(0.01, threshold)],
    ['none', '0 0 16px rgba(255, 92, 26, 0.5)']
  )

  return (
    <div className="absolute top-6 left-5 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
      <motion.div
        style={{
          borderWidth: isCurrent || index === 0 ? '2px' : '1.5px',
          borderStyle: 'solid',
          borderColor: isCurrent || index === 0 ? 'var(--x-accent)' : borderColor,
          boxShadow: isCurrent || index === 0 ? '0 0 16px var(--x-accent-line)' : glowShadow,
          background: 'var(--x-bg)',
        }}
        className="relative w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
      >
        {isCurrent && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-35"
            style={{ background: 'var(--x-accent)' }}
          />
        )}
        <motion.span
          style={{
            color: isCurrent || index === 0 ? 'var(--x-accent)' : textColor,
          }}
          className="font-mono text-[11px] font-bold"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
      </motion.div>
    </div>
  )
}

function RoadmapCard({ exp, index, total, progress, isExpanded, onToggle }) {
  const isLeft = index % 2 === 0
  const isCurrent = exp.year?.toLowerCase().includes('present')
  const { bullets, techTags } = parseExperience(exp.description)

  return (
    <div className="relative mb-12 last:mb-0">
      {/* ── Central Milestone Node on the Roadmap Line ── */}
      <MilestoneNode
        index={index}
        total={total}
        progress={progress}
        isCurrent={isCurrent}
      />

      {/* ── Horizontal Connector Arm (Desktop) ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.15, ease }}
        className="hidden md:block absolute top-10 h-px pointer-events-none z-10"
        style={{
          width: '2.5rem',
          ...(isLeft
            ? { left: 'calc(50% - 2.5rem)', transformOrigin: 'right', background: 'linear-gradient(90deg, transparent, var(--x-line))' }
            : { left: '50%', transformOrigin: 'left', background: 'linear-gradient(90deg, var(--x-line), transparent)' }),
        }}
      />

      {/* ── Horizontal Connector Arm (Mobile) ── */}
      <div
        className="md:hidden absolute top-10 left-5 w-7 h-px pointer-events-none z-10"
        style={{ background: 'var(--x-line)' }}
      />

      {/* ── The Job Card with Alternating Left/Right Animation ── */}
      <motion.div
        initial={{
          opacity: 0,
          x: isLeft ? -70 : 70,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.65, delay: index * 0.08, ease }}
        className={`ml-12 md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
      >
        <div
          className="group relative p-6 sm:p-7 transition-all duration-300"
          style={{
            background: 'var(--x-bg)',
            border: '1px solid var(--x-line-soft)',
            borderRadius: '4px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--x-line)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--x-line-soft)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Top Status & Date Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-[var(--x-line-soft)]">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs font-semibold px-2.5 py-1 rounded inline-flex items-center gap-1.5"
                style={{
                  background: isCurrent ? 'var(--x-accent-soft)' : 'var(--x-surface)',
                  color: isCurrent ? 'var(--x-accent)' : 'var(--x-text)',
                  border: isCurrent ? '1px solid var(--x-accent-line)' : '1px solid var(--x-line-soft)',
                }}
              >
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--x-accent)' }} />}
                {exp.year}
              </span>

              {isCurrent && (
                <span
                  className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold"
                  style={{ background: 'var(--x-accent)', color: '#ffffff' }}
                >
                  Active
                </span>
              )}
            </div>

            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: 'var(--x-faint)' }}>
              {exp.duration}
            </span>
          </div>

          {/* Role & Company Header */}
          <div className="mb-4">
            <h3
              className="font-grotesk font-bold text-lg sm:text-xl tracking-tight mb-1"
              style={{ color: 'var(--x-text)' }}
            >
              {exp.role}
            </h3>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--x-muted)' }}>
              <Briefcase size={12} style={{ color: 'var(--x-accent)' }} />
              <span>{exp.company}</span>
            </div>
          </div>

          {/* Optional Tech Stack Badges */}
          {techTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {techTags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[10px] px-2 py-0.5 rounded"
                  style={{ background: 'var(--x-surface-2)', color: 'var(--x-text)', border: '1px solid var(--x-line-soft)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Expandable Details Drawer (Shows All Bullet Points on View Details) */}
          <AnimatePresence initial={false}>
            {isExpanded && bullets.length > 0 && (
              <motion.div
                key="expanded-details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 border-t border-[var(--x-line-soft)] space-y-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider pb-1" style={{ color: 'var(--x-faint)' }}>
                    <Layers size={11} style={{ color: 'var(--x-accent)' }} />
                    <span>Key Responsibilities & Architecture</span>
                  </div>
                  {bullets.map((bullet, idx) => (
                    <BulletItem key={idx} text={bullet} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Details / Hide Details Toggle Button (Clean without numbers) */}
          {bullets.length > 0 && (
            <div className={`flex items-center justify-between ${isExpanded ? 'pt-4 mt-2 border-t border-[var(--x-line-soft)]' : 'pt-2'}`}>
              <button
                onClick={onToggle}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider py-2 px-3.5 rounded transition-all duration-200 group/btn"
                style={{
                  background: isExpanded ? 'var(--x-accent-soft)' : 'var(--x-surface)',
                  border: isExpanded ? '1px solid var(--x-accent-line)' : '1px solid var(--x-line-soft)',
                  color: isExpanded ? 'var(--x-accent)' : 'var(--x-text)',
                }}
                aria-expanded={isExpanded}
              >
                <Layers size={12} style={{ color: isExpanded ? 'var(--x-accent)' : 'var(--x-muted)' }} />
                <span>{isExpanded ? 'Hide details' : 'View details'}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--x-accent)]' : 'text-[var(--x-faint)] group-hover/btn:text-[var(--x-accent)] group-hover/btn:translate-y-0.5'}`}
                />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const { state } = usePortfolio()
  const { experiences } = state

  // Individual card expansion state map { [id]: boolean }
  const [expandedMap, setExpandedMap] = useState({})

  const toggleCard = (id) => {
    setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const allExpanded = experiences.length > 0 && experiences.every(exp => expandedMap[exp.id])

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedMap({})
    } else {
      const next = {}
      experiences.forEach(exp => { next[exp.id] = true })
      setExpandedMap(next)
    }
  }

  // Scroll tracking for traveling spine animation
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 85%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  })

  // Moving particle head position along the spine
  const travelingHeadTop = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="experience" className="x-section relative overflow-hidden" style={{ background: 'var(--x-surface)' }}>
      <div className="x-container">
        {/* Section Header */}
        <SectionHeader index="05" label="Experience" title="Where I've worked" />

        {/* Roadmap Toolbar Strip */}
        <div className="flex items-center justify-between gap-4 mb-12 -mt-4 pb-4 border-b border-[var(--x-line-soft)] flex-wrap">
          <div className="flex items-center gap-2.5 font-mono text-xs" style={{ color: 'var(--x-muted)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--x-accent)' }} />
            <span className="uppercase tracking-[0.16em]">Career Roadmap</span>
            <span style={{ color: 'var(--x-faint)' }}>•</span>
            <span style={{ color: 'var(--x-faint)' }}>{experiences.length} Milestones</span>
          </div>

          <button
            onClick={toggleAll}
            className="x-btn-ghost !py-1.5 !px-3 font-mono text-[11px] uppercase tracking-wider flex items-center gap-2"
          >
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            <ChevronDown size={12} className={`transition-transform duration-300 ${allExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* ── Visual Roadmap Timeline with Scroll-Traveling Line ── */}
        <div ref={timelineRef} className="relative">
          {/* Base Inactive Spine Track */}
          <div
            className="absolute top-10 bottom-10 left-5 md:left-1/2 -translate-x-1/2 w-[2px] pointer-events-none"
            style={{ background: 'var(--x-line-soft)' }}
          />

          {/* Active Scroll-Traveling Spine Line */}
          <motion.div
            style={{
              scaleY: smoothProgress,
              background: 'linear-gradient(180deg, var(--x-accent) 0%, #ff6a2b 85%, #ff4500 100%)',
              boxShadow: '0 0 12px rgba(255, 92, 26, 0.75)',
            }}
            className="absolute top-10 bottom-10 left-5 md:left-1/2 -translate-x-1/2 w-[2px] origin-top pointer-events-none z-10"
          />

          {/* Glowing Traveling Comet Head at the Tip of the Line */}
          <div className="absolute top-10 bottom-10 left-5 md:left-1/2 -translate-x-1/2 pointer-events-none z-30">
            <motion.div
              style={{
                top: travelingHeadTop,
              }}
              className="absolute -left-[5px] -translate-y-1/2 w-3 h-3 rounded-full"
            >
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-60"
                style={{ background: 'var(--x-accent)' }}
              />
              <span
                className="block w-full h-full rounded-full"
                style={{
                  background: '#ffffff',
                  boxShadow: '0 0 12px 2px var(--x-accent), 0 0 4px #ffffff',
                }}
              />
            </motion.div>
          </div>

          {/* Experience Roadmap Items */}
          <div className="relative z-10">
            {experiences.map((exp, i) => (
              <RoadmapCard
                key={exp.id}
                exp={exp}
                index={i}
                total={experiences.length}
                progress={smoothProgress}
                isExpanded={Boolean(expandedMap[exp.id])}
                onToggle={() => toggleCard(exp.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
