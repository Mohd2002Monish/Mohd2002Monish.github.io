import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Search, Sparkles, Filter, Code2, Layers } from 'lucide-react'
import { usePortfolio, resolveImageUrl } from '../context/PortfolioContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
        {/* Subtle background blueprint watermark */}
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

function CardTilt({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ['4deg', '-4deg']), { stiffness: 220, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ['-4deg', '4deg']), { stiffness: 220, damping: 25 })

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

export default function AllProjects() {
  const { state } = usePortfolio()
  const { projects } = state

  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Aggregate all unique tech tags
  const allTags = useMemo(() => {
    const set = new Set()
    projects.forEach(p => {
      if (Array.isArray(p.stack)) {
        p.stack.forEach(t => set.add(t))
      }
    })
    return ['All', ...Array.from(set)]
  }, [projects])

  // Filter & search logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = activeFilter === 'All' || (Array.isArray(p.stack) && p.stack.includes(activeFilter))
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery = !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (Array.isArray(p.stack) && p.stack.some(s => s.toLowerCase().includes(q)))
      return matchesFilter && matchesQuery
    })
  }, [projects, activeFilter, searchQuery])

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-24" style={{ background: 'var(--x-bg)' }}>
        <div className="x-container">
          {/* Top Breadcrumb & Back */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--x-muted)] hover:text-[var(--x-accent)] transition-colors duration-200"
            >
              <ArrowLeft size={13} />
              <span>Back to Overview</span>
            </Link>
          </div>

          {/* Page Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-14"
          >
            <div className="x-label mb-3">
              <span className="x-label-index">04</span>
              <span style={{ color: 'var(--x-faint)' }}>/</span>
              Archive
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1
                  className="font-grotesk font-bold tracking-tight mb-3"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--x-text)', lineHeight: 1 }}
                >
                  All Projects
                </h1>
                <p className="x-body max-w-xl text-base">
                  A curated archive of full-stack applications, developer platforms, backend architectures,
                  and client deliverables built by Mohd Monish.
                </p>
              </div>

              <div className="font-mono text-xs text-[var(--x-faint)] flex items-center gap-2 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--x-accent)' }} />
                <span>{projects.length} Total Projects</span>
              </div>
            </div>

            <div className="x-hairline mt-8" />
          </motion.div>

          {/* Search & Tag Filter Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-12">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--x-faint)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, tech stack, or keyword..."
                className="w-full pl-9 pr-4 py-2.5 rounded font-mono text-xs transition-colors duration-200"
                style={{
                  background: 'var(--x-surface)',
                  border: '1px solid var(--x-line-soft)',
                  color: 'var(--x-text)',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--x-line)'}
                onBlur={e => e.target.style.borderColor = 'var(--x-line-soft)'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--x-muted)] hover:text-[var(--x-text)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tag Pills */}
            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto py-1">
              {allTags.slice(0, 8).map(tag => {
                const isActive = activeFilter === tag
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className="font-mono text-[11px] px-3 py-1.5 rounded transition-all duration-200"
                    style={{
                      background: isActive ? 'var(--x-accent-soft)' : 'var(--x-surface)',
                      border: isActive ? '1px solid var(--x-accent-line)' : '1px solid var(--x-line-soft)',
                      color: isActive ? 'var(--x-accent)' : 'var(--x-muted)',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div
              className="p-16 text-center border border-[var(--x-line-soft)] rounded-[4px] my-10"
              style={{ background: 'var(--x-surface)' }}
            >
              <Layers size={32} className="mx-auto mb-4 text-[var(--x-faint)]" />
              <div className="font-grotesk font-semibold text-lg text-[var(--x-text)] mb-2">
                No projects matched your search
              </div>
              <p className="font-mono text-xs text-[var(--x-muted)] mb-6">
                Try clearing your search query or selecting a different filter.
              </p>
              <button
                onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
                className="x-btn !py-2 !px-4 text-xs font-mono"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {filteredProjects.map((project, i) => (
                  <motion.article
                    layout
                    key={project.id || i}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease }}
                    className="group flex flex-col justify-between p-6 rounded-[4px] transition-all duration-300 relative"
                    style={{
                      background: 'var(--x-surface)',
                      border: '1px solid var(--x-line-soft)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--x-line)'
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.35)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--x-line-soft)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div>
                      {/* Project Image Frame */}
                      <CardTilt>
                        <div
                          className="x-project-frame relative overflow-hidden mb-5"
                          style={{
                            aspectRatio: '16/10',
                            borderRadius: '3px',
                            border: '1px solid var(--x-line-soft)',
                            background: 'var(--x-surface-2)',
                          }}
                        >
                          <ProjectImage src={project.image} title={project.title} />
                        </div>
                      </CardTilt>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
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

                      {/* Title */}
                      <h3
                        className="font-grotesk font-bold text-xl tracking-tight mb-2 group-hover:text-[var(--x-accent)] transition-colors duration-200"
                        style={{ color: 'var(--x-text)' }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="x-body text-xs line-clamp-3 mb-6" style={{ color: 'var(--x-muted)' }}>
                        {project.description}
                      </p>
                    </div>

                    {/* Action Links */}
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
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
