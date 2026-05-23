import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, Code2, LayoutDashboard, Cpu, Briefcase, FolderOpen, Save, CheckCircle, ExternalLink } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import SkillsManager from './SkillsManager'
import ProjectsManager from './ProjectsManager'
import ExperienceManager from './ExperienceManager'

const tabs = [
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'experience', label: 'Experience', icon: Briefcase },
]

export default function AdminDashboard() {
  const { state, saving } = usePortfolio()
  const [activeTab, setActiveTab] = useState('skills')
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin')
  }

  const counts = {
    skills: state.skills.length,
    projects: state.projects.length,
    experience: state.experiences.length,
  }

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Top bar */}
      <div className="bg-navy-800/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Code2 size={13} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Monish</span>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-gray-400 text-sm flex items-center gap-1.5">
              <LayoutDashboard size={13} />
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            {saving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
              >
                <div className="w-3 h-3 border border-green-400/50 border-t-green-400 rounded-full animate-spin" />
                Saving...
              </motion.div>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              View Site <ExternalLink size={13} className="inline ml-1" />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ y: -2 }}
              className={`glass-card p-5 text-left transition-all duration-200 ${
                activeTab === id ? 'border-violet-500/40 bg-violet-600/10' : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={activeTab === id ? 'text-violet-400' : 'text-gray-500'} />
                <span className={`text-2xl font-bold ${activeTab === id ? 'gradient-text' : 'text-white'}`}>
                  {counts[id]}
                </span>
              </div>
              <div className="text-sm text-gray-400">{label}</div>
            </motion.button>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 bg-white/3 rounded-xl p-1 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'experience' && <ExperienceManager />}
        </motion.div>
      </div>
    </div>
  )
}
