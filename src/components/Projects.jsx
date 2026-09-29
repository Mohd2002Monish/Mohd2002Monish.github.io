import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { usePortfolio, resolveImageUrl } from '../context/PortfolioContext'
import SectionHeader from './SectionHeader'

const ease = [0.16, 1, 0.3, 1]

function ProjectImage({ src, title }) {
  const [errored, setErrored] = useState(false)
  const resolvedSrc = resolveImageUrl(src)
  if (errored || !resolvedSrc) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-3 relative overflow-hidden"
        style={{ background: 'var(--x-surface-2)' }}
      >
        <div className="absolute inset-0 x-grid-bg opacity-30 pointer-events-none" />
        <span
          className="font-grotesk font-bold text-6xl select-none"
          style={{ color: 'transparent', WebkitTextStroke: '1px var(--x-faint)' }}
        >
          {title?.charAt(0) || '?'}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] relative z-10" style={{ color: 'var(--x-faint)' }}>
          {title}
        </span>
      </div>
    )
  }
  return (
    <img
      src={resolvedSrc}
      alt={title}
      loading="lazy"
      className="x-project-img w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  )
}

/* Subtle 3D tilt — max 3 degrees, spring-smoothed */
function TiltFrame({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ['3deg', '-3deg']), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ['-3deg', '3deg']), { stiffness: 200, damping: 25 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ perspective: '1200px' }}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  )
}

function ProjectCard({ project, index, onLiveClick }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease }}
      className="group flex flex-col justify-between p-6 sm:p-7 rounded-[4px] transition-colors duration-300 relative h-full hover:border-[var(--x-line)]"
      style={{
        background: 'var(--x-surface)',
        border: '1px solid var(--x-line-soft)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="flex flex-col flex-1">
        {/* Media Frame with Tilt */}
        <TiltFrame>
          <div
            className="x-project-frame relative overflow-hidden mb-5"
            style={{
              border: '1px solid var(--x-line-soft)',
              borderRadius: '3px',
              aspectRatio: '16/10',
              background: 'var(--x-surface)',
            }}
          >
            <ProjectImage src={project.image} title={project.title} />
          </div>
        </TiltFrame>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {Array.isArray(project.stack) && project.stack.map(tech => (
            <span
              key={tech}
              className="font-mono text-[10px] px-2 py-0.5 rounded"
              style={{
                background: 'var(--x-surface-2)',
                color: 'var(--x-text)',
                border: '1px solid var(--x-line-soft)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project Title */}
        <h3
          className="font-grotesk font-bold text-xl sm:text-2xl tracking-tight mb-2 group-hover:text-[var(--x-accent)] transition-colors duration-200"
          style={{ color: 'var(--x-text)' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="x-body text-xs sm:text-sm line-clamp-3 mb-6" style={{ color: 'var(--x-muted)' }}>
          {project.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-5 pt-4 border-t border-[var(--x-line-soft)] mt-auto">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="x-link text-xs flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            <span>Live Demo</span>
            <ArrowUpRight size={12} className="x-link-arrow" />
          </a>
        )}
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { state } = usePortfolio()
  const { projects } = state

  // Display top 3 projects side-by-side
  const displayedProjects = projects.slice(0, 3)

  return (
    <section id="projects" className="x-section">
      <div className="x-container">
        <SectionHeader index="04" label="Selected Work" title="Things I've built" />

        {/* 3 Vertical Cards Side-by-Side (|||) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayedProjects.map((project, i) => (
            <ProjectCard
              key={project.id || i}
              project={project}
              index={i}
            />
          ))}
        </div>

        {/* View All Projects Archive CTA */}
        {projects.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease }}
            className="mt-14 pt-8 border-t border-[var(--x-line-soft)] flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--x-muted)] mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--x-accent)' }} />
                <span>Featured Selection</span>
                <span style={{ color: 'var(--x-faint)' }}>•</span>
                <span style={{ color: 'var(--x-faint)' }}>3 of {projects.length} Projects</span>
              </div>
              <p className="font-grotesk font-semibold text-lg sm:text-xl text-[var(--x-text)]">
                Explore all full-stack applications & systems
              </p>
            </div>

            <Link
              to="/projects"
              className="x-btn !py-3.5 !px-6 flex items-center gap-2.5 whitespace-nowrap group"
            >
              <span>View All Projects</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
