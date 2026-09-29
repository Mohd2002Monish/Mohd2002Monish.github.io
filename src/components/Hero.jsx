import React, { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

const Hero3D = lazy(() => import('./Hero3D'))

const ease = [0.16, 1, 0.3, 1]

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
})

const ticker = [
  'React', 'Node.js', 'MongoDB', 'Express', 'Next.js', 'TypeScript',
  'Tailwind CSS', 'AI Automation', 'Vibe Coding', 'Docker', 'AWS',
  'Elasticsearch', 'REST APIs', 'Redux',
]

export default function Hero() {
  const { state } = usePortfolio()
  const { about } = state

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Blueprint grid backdrop */}
      <div className="absolute inset-0 x-grid-bg pointer-events-none" />
      {/* Fade the grid toward the bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 40%, var(--x-bg) 96%)' }}
      />

      {/* 3D sculpture — right side on desktop, faint backdrop on mobile */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[52%] opacity-30 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </div>

      {/* Registration marks */}
      <div className="x-cross" style={{ top: '88px', left: '24px' }} />
      <div className="x-cross" style={{ top: '88px', right: '24px' }} />

      {/* Main content */}
      <div className="x-container relative z-10 flex-1 flex flex-col justify-center pt-28 pb-10">
        <div className="max-w-3xl">
          {/* Status line */}
          <motion.div {...rise(0.05)} className="flex items-center gap-6 mb-8 flex-wrap">
            <span className="x-label">
              <span className="x-pulse-dot" />
              Available for work
            </span>
            <span className="x-label hidden sm:inline-flex" style={{ color: 'var(--x-faint)' }}>
              Portfolio — {new Date().getFullYear()}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            {...rise(0.12)}
            className="font-grotesk font-bold leading-[0.95]"
            style={{
              fontSize: 'clamp(3.2rem, 11vw, 8.5rem)',
              letterSpacing: '-0.04em',
              color: 'var(--x-text)',
            }}
          >
            MOHD
            <br />
            <span className="x-outline-text">MONISH</span>
          </motion.h1>

          {/* Role + description */}
          <motion.div {...rise(0.22)} className="mt-9 flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 flex-shrink-0" style={{ background: 'var(--x-accent)' }} />
              <span className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--x-text)' }}>
                Full-Stack Developer / MERN
              </span>
            </div>
            <p className="x-body text-[15px]">
              I design and build fast, scalable web products — from admin panels and
              AI-powered platforms to production APIs. Precise engineering, sharp interfaces,
              no wasted pixels.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div {...rise(0.32)} className="flex flex-wrap items-center gap-4 mt-10">
            <a href="#projects" className="x-btn">
              View Work
              <ArrowDown size={13} />
            </a>
            <a href="#contact" className="x-btn-ghost">
              Get in Touch
            </a>
            <a
              href={about.github}
              target="_blank"
              rel="noreferrer"
              className="x-link ml-1"
            >
              GitHub
              <ArrowUpRight size={12} className="x-link-arrow" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom strip: meta + ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="relative z-10"
      >
        <div className="x-container">
          <div className="x-hairline" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 py-6">
            {[
              { k: 'Location', v: 'India — Remote' },
              { k: 'Experience', v: '3.5+ Years' },
              { k: 'Currently', v: 'Empiric Infotech' },
              { k: 'Focus', v: 'Full-Stack / AI' },
            ].map(({ k, v }) => (
              <div key={k} className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--x-faint)' }}>
                  {k}
                </span>
                <span className="font-grotesk font-medium text-sm" style={{ color: 'var(--x-text)' }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech ticker */}
        <div className="x-marquee py-4" style={{ borderTop: '1px solid var(--x-line-soft)' }}>
          <div className="x-marquee-track">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-10 flex-shrink-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--x-faint)' }}>
                  {t}
                </span>
                <span className="w-1 h-1" style={{ background: 'var(--x-accent)', opacity: 0.6 }} />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
