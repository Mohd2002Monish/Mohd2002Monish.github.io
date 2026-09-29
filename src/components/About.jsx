import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Download } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SectionHeader from './SectionHeader'

const ease = [0.16, 1, 0.3, 1]

const capabilities = [
  { index: '01', label: 'Frontend Engineering', desc: 'React, Next.js — component systems that are fast, accessible and pixel-precise.' },
  { index: '02', label: 'Backend & APIs', desc: 'Node.js, Express, microservices — REST APIs designed for scale and clarity.' },
  { index: '03', label: 'AI Integration', desc: 'LLM-powered features, automation workflows and intelligent product tooling.' },
  { index: '04', label: 'Infrastructure', desc: 'Docker, DigitalOcean, Cloudflare, Elasticsearch — production-ready deployments.' },
]

export default function About() {
  const { state } = usePortfolio()
  const { about } = state

  const specs = [
    { k: 'Name', v: 'Mohd Monish' },
    { k: 'Role', v: 'Full-Stack MERN Developer' },
    { k: 'Location', v: 'India / Remote' },
    { k: 'Experience', v: '3.5+ Years' },
    { k: 'Status', v: 'Open to work', accent: true },
    { k: 'Email', v: about.email, href: `mailto:${about.email}` },
  ]

  return (
    <section id="about" className="x-section">
      <div className="x-container">
        <SectionHeader index="02" label="About" title="The developer behind the work" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Spec sheet */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-24">
              <div style={{ border: '1px solid var(--x-line-soft)', borderRadius: '3px' }}>
                <div
                  className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ borderBottom: '1px solid var(--x-line-soft)', color: 'var(--x-faint)' }}
                >
                  Spec — MM.2026
                </div>
                {specs.map(({ k, v, accent, href }, i) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 px-5 py-3.5"
                    style={{ borderBottom: i < specs.length - 1 ? '1px solid var(--x-line-soft)' : 'none' }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] flex-shrink-0" style={{ color: 'var(--x-faint)' }}>
                      {k}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="font-grotesk text-sm font-medium text-right break-all transition-colors duration-200"
                        style={{ color: 'var(--x-text)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--x-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--x-text)')}
                      >
                        {v}
                      </a>
                    ) : (
                      <span
                        className="font-grotesk text-sm font-medium text-right"
                        style={{ color: accent ? 'var(--x-accent)' : 'var(--x-text)' }}
                      >
                        {accent && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: 'var(--x-accent)' }} />}
                        {v}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <a href={about.resumeUrl} target="_blank" rel="noreferrer" className="x-btn !py-3">
                  <Download size={13} />
                  Resume
                </a>
                <a href={about.github} target="_blank" rel="noreferrer" className="x-btn-ghost !py-3">
                  GitHub
                  <ArrowUpRight size={12} className="x-link-arrow" />
                </a>
                <a href={about.linkedin} target="_blank" rel="noreferrer" className="x-btn-ghost !py-3">
                  LinkedIn
                  <ArrowUpRight size={12} className="x-link-arrow" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Bio + capabilities */}
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="font-grotesk text-xl md:text-2xl leading-relaxed mb-14"
              style={{ color: 'var(--x-text)', letterSpacing: '-0.01em' }}
            >
              {about.bio}
            </motion.p>

            <div className="x-label mb-6">
              <span className="x-label-index">→</span>
              What I do
            </div>

            <div>
              {capabilities.map(({ index, label, desc }, i) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease }}
                  className="x-exp-row grid grid-cols-12 gap-4 py-6 px-4 -mx-4"
                  style={{ borderBottom: '1px solid var(--x-line-soft)' }}
                >
                  <span className="col-span-2 sm:col-span-1 font-mono text-xs pt-1" style={{ color: 'var(--x-accent)' }}>
                    {index}
                  </span>
                  <span className="col-span-10 sm:col-span-4 font-grotesk font-semibold text-base" style={{ color: 'var(--x-text)' }}>
                    {label}
                  </span>
                  <span className="col-span-10 col-start-3 sm:col-span-7 sm:col-start-6 x-body text-sm">
                    {desc}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
