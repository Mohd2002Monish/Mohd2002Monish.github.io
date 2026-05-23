import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X, Calendar, Briefcase, GripVertical } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'

const empty = { company: '', role: '', duration: '', year: '', description: '' }

export default function ExperienceManager() {
  const { state, dispatchAndSave } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const handleAdd = async () => {
    if (!form.company.trim() || !form.role.trim()) return toast.error('Company and role are required')
    const newExp = { ...form, id: Date.now().toString() }
    await dispatchAndSave({ type: 'ADD_EXPERIENCE', payload: newExp })
    toast.success('Experience added!')
    setForm(empty)
    setShowForm(false)
  }

  const handleEdit = async () => {
    if (!form.company.trim() || !form.role.trim()) return toast.error('Company and role are required')
    await dispatchAndSave({ type: 'UPDATE_EXPERIENCE', payload: { ...form, id: editing } })
    toast.success('Experience updated!')
    setEditing(null)
    setForm(empty)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return
    await dispatchAndSave({ type: 'DELETE_EXPERIENCE', payload: id })
    toast.success('Experience deleted')
  }

  const startEdit = (exp) => {
    setEditing(exp.id)
    setForm({ company: exp.company, role: exp.role, duration: exp.duration, year: exp.year, description: exp.description })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Manage Experience</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty) }}
          className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
        >
          <Plus size={15} /> Add Experience
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 mb-6 border-violet-500/30"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4">New Experience</h3>
            <ExpForm form={form} setForm={setForm} />
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4">
                <Check size={14} /> Add
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline flex items-center gap-1.5 text-sm py-2 px-4">
                <X size={14} /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        <Reorder.Group axis="y" values={state.experiences} onReorder={(newOrder) => dispatchAndSave({ type: 'SET_EXPERIENCES', payload: newOrder })} className="flex flex-col gap-4">
          <AnimatePresence>
            {state.experiences.map((exp) => (
              <Reorder.Item
                key={exp.id}
                value={exp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-5 relative"
              >
              {editing === exp.id ? (
                <div>
                  <ExpForm form={form} setForm={setForm} />
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleEdit} className="btn-primary flex items-center gap-1 text-xs py-1.5 px-3">
                      <Check size={12} /> Save
                    </button>
                    <button onClick={() => { setEditing(null); setForm(empty) }} className="btn-outline flex items-center gap-1 text-xs py-1.5 px-3">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 items-start">
                  <div className="mt-2 cursor-grab active:cursor-grabbing text-gray-500 hover:text-violet-400 transition-colors">
                    <GripVertical size={16} />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/20 flex-shrink-0 flex items-center justify-center">
                    <Briefcase size={18} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-white font-semibold">{exp.role}</div>
                        <div className="text-violet-300 text-sm font-medium">{exp.company}</div>
                        <div className="flex items-center gap-3 mt-1">
                          {exp.year && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={10} /> {exp.year}
                            </span>
                          )}
                          {exp.duration && (
                            <span className="text-xs text-cyan-400">{exp.duration}</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-3">{exp.description}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(exp)} className="w-7 h-7 rounded-lg hover:bg-violet-600/20 hover:text-violet-400 text-gray-500 transition-all flex items-center justify-center">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(exp.id)} className="w-7 h-7 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all flex items-center justify-center">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  )
}

function ExpForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Company *</label>
        <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" className="admin-input" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Role *</label>
        <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Job title" className="admin-input" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Duration</label>
        <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="6 Months, 1 Year..." className="admin-input" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Year</label>
        <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2024" className="admin-input" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-gray-400 mb-1 block">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe your role and responsibilities..." className="admin-input resize-none" />
      </div>
    </div>
  )
}
