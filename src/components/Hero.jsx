import React from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { ArrowDown, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />

      {/* Animated orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="flex flex-col items-center text-center gap-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for opportunities
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
              Hi, I'm{' '}
              <span className="gradient-text">Mohd Monish</span>
            </h1>
          </motion.div>

          {/* Typed text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold text-gray-300 h-10"
          >
            <TypeAnimation
              sequence={[
                'Full Stack Developer',
                2000,
                'MERN Stack Expert',
                2000,
                'React Enthusiast',
                2000,
                'I Love Coding',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="gradient-text"
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-lg max-w-2xl leading-relaxed"
          >
            Crafting beautiful, performant web experiences with modern technologies.
            If you need a website,{' '}
            <a href="mailto:mohd2002monish@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4">
              email me maybe
            </a>
            .
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-2"
          >
            <a href="#projects" className="btn-primary text-base px-8 py-3.5">
              View My Work
            </a>
            <a href="#contact" className="btn-outline text-base px-8 py-3.5">
              Contact Me
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-5 mt-4"
          >
            {[
              { href: 'https://github.com/Mohd2002Monish', icon: GithubIcon, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/mohd2002monish/', icon: LinkedinIcon, label: 'LinkedIn' },
              { href: 'https://www.instagram.com/mohdmonish__/', icon: InstagramIcon, label: 'Instagram' },
              { href: 'mailto:mohd2002monish@gmail.com', icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-white/5 w-full max-w-lg"
          >
            {[
              { value: '3+', label: 'Years Exp.' },
              { value: '10+', label: 'Projects Built' },
              { value: 'MERN', label: 'Stack' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{value}</div>
                <div className="text-gray-500 text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowDown size={18} />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
