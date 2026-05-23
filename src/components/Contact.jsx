import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, CheckCircle, MessageSquare } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons'
import { usePortfolio } from '../context/PortfolioContext'

export default function Contact() {
  const { state } = usePortfolio()
  const { about } = state
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mailto fallback
    const subject = `Portfolio Contact from ${form.name}`
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    window.open(`mailto:${about.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }, 4000)
  }

  const socials = [
    { href: about.github, icon: GithubIcon, label: 'GitHub', color: 'hover:border-gray-400/50 hover:text-white' },
    { href: about.linkedin, icon: LinkedinIcon, label: 'LinkedIn', color: 'hover:border-blue-500/50 hover:text-blue-400' },
    { href: about.instagram, icon: InstagramIcon, label: 'Instagram', color: 'hover:border-pink-500/50 hover:text-pink-400' },
    { href: about.facebook, icon: FacebookIcon, label: 'Facebook', color: 'hover:border-blue-600/50 hover:text-blue-500' },
  ]

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Let's build something amazing together</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">Let's Chat! <MessageSquare size={24} /></h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!
              </p>
              <a
                href={`mailto:${about.email}`}
                className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">{about.email}</span>
              </a>
            </div>

            {/* Social links */}
            <div className="glass-card p-6">
              <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-widest">Find me on</p>
              <div className="flex gap-3">
                {socials.map(({ href, icon: Icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`w-12 h-12 rounded-xl glass-card flex items-center justify-center text-gray-400 transition-all duration-200 hover:-translate-y-1 ${color}`}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-10 text-center"
                >
                  <CheckCircle size={48} className="text-green-400" />
                  <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                  <p className="text-gray-400">Your email client has been opened. Thanks for reaching out!</p>
                </motion.div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block" htmlFor="email">
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      className="form-input resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                    <Send size={16} />
                    Send Message
                  </button>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
