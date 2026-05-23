import React from 'react'
import { Mail, Code2, Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'

export default function Footer() {
  const { state } = usePortfolio()
  const { about } = state

  const socials = [
    { href: about.github, icon: GithubIcon, label: 'GitHub' },
    { href: about.linkedin, icon: LinkedinIcon, label: 'LinkedIn' },
    { href: about.instagram, icon: InstagramIcon, label: 'Instagram' },
    { href: about.facebook, icon: FacebookIcon, label: 'Facebook' },
    { href: `mailto:${about.email}`, icon: Mail, label: 'Email' },
  ]

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">Mohd Monish</span>
          </a>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-gray-500 hover:text-white hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-200"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          {/* Nav */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'].map(sec => (
              <a
                key={sec}
                href={`#${sec.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {sec}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            Made with <Heart size={13} className="text-red-500 fill-red-500" /> by Mohd Monish © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
