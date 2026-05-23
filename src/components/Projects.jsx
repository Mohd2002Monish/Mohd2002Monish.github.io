import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'
import FormattedDescription from './FormattedDescription'

// Inline SVG placeholder — no external request, no infinite onError loop
function ProjectImage({ src, title }) {
  const [errored, setErrored] = useState(false)

  if (errored || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/30 to-cyan-900/20 gap-3">
        <div className="text-4xl font-black gradient-text opacity-40 select-none">
          {title?.charAt(0) || '?'}
        </div>
        <span className="text-gray-600 text-xs font-medium">{title}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      onError={() => setErrored(true)}
    />
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Projects() {
  const { state } = usePortfolio()
  const { projects } = state

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">My Projects</h2>
          <p className="section-subtitle">Things I've built with passion</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="project-card group flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video bg-navy-700" style={{ backgroundColor: '#0d1526' }}>
                <ProjectImage src={project.image} title={project.title} />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
                    >
                      <ExternalLink size={14} />
                      Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline flex items-center gap-2 text-xs py-2 px-4"
                    >
                      <GithubIcon size={14} />
                      Code
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>

                {/* Stack badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-full bg-violet-600/15 border border-violet-500/20 text-violet-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <FormattedDescription text={project.description} className="text-gray-400 text-sm flex-1" />

                {/* Links */}
                <div className="flex gap-3 pt-2 border-t border-white/5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      <GithubIcon size={14} />
                      Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
