import React from 'react'
import { motion } from 'framer-motion'
import { Download, Zap, Cpu, Rocket, Brain } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'

const superpowers = [
  { icon: Zap, label: 'Responsive', desc: 'Pixel-perfect across all devices' },
  { icon: Cpu, label: 'Design', desc: 'Modern, beautiful interfaces' },
  { icon: Rocket, label: 'Fast', desc: 'Performance-first development' },
  { icon: Brain, label: 'Logical', desc: 'Clean, scalable code' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function About() {
  const { state } = usePortfolio()
  const { about } = state

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background subtle orb */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know the person behind the code</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            {/* Profile picture placeholder */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[3px]">
                  <div className="w-full h-full rounded-2xl bg-navy-800 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl font-black gradient-text">MM</div>
                  </div>
                </div>
                {/* Status badge */}
                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Open to work
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-1">Mohd Monish</h3>
              <p className="gradient-text font-semibold mb-5 text-lg">Full Stack MERN Developer</p>
              <p className="text-gray-400 leading-relaxed mb-8 text-base">
                {about.bio}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={about.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary flex items-center gap-2 text-sm py-2.5"
                >
                  <GithubIcon size={16} />
                  GitHub
                </a>
                <a
                  href={about.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-sm py-2.5"
                >
                  <LinkedinIcon size={16} />
                  LinkedIn
                </a>
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-sm py-2.5"
                >
                  <Download size={16} />
                  Resume
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Superpowers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {superpowers.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-violet-400" />
              </div>
              <div className="font-semibold text-white mb-1">{label}</div>
              <div className="text-gray-500 text-xs">{desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
