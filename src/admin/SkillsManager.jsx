import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X, Image, GripVertical } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'

const levels = ['Expert', 'Advanced', 'Intermediate']
const empty = { name: '', icon: '', level: 'Intermediate' }

export default function SkillsManager() {
  const { state, dispatchAndSave } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null) // skill id
  const [form, setForm] = useState(empty)

  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error('Skill name is required')
    const newSkill = { ...form, id: Date.now().toString() }
    await dispatchAndSave({ type: 'ADD_SKILL', payload: newSkill })
    toast.success('Skill added!')
    setForm(empty)
    setShowForm(false)
  }

  const handleEdit = async () => {
    if (!form.name.trim()) return toast.error('Skill name is required')
    await dispatchAndSave({ type: 'UPDATE_SKILL', payload: { ...form, id: editing } })
    toast.success('Skill updated!')
    setEditing(null)
    setForm(empty)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    await dispatchAndSave({ type: 'DELETE_SKILL', payload: id })
    toast.success('Skill deleted')
  }

  const startEdit = (skill) => {
    setEditing(skill.id)
    setForm({ name: skill.name, icon: skill.icon, level: skill.level || 'Intermediate' })
    setShowForm(false)
  }

  const cancelEdit = () => { setEditing(null); setForm(empty) }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Manage Skills</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty) }}
          className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
        >
          <Plus size={15} />
          Add Skill
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 mb-6 border-violet-500/30"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4">New Skill</h3>
            <SkillForm form={form} setForm={setForm} />
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

      {/* Skills Grid */}
      <div>
        <Reorder.Group axis="y" values={state.skills} onReorder={(newOrder) => dispatchAndSave({ type: 'SET_SKILLS', payload: newOrder })} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {state.skills.map((skill) => (
              <Reorder.Item
                key={skill.id}
                value={skill}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-4 relative"
              >
              {editing === skill.id ? (
                <div>
                  <SkillForm form={form} setForm={setForm} />
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleEdit} className="btn-primary flex items-center gap-1 text-xs py-1.5 px-3">
                      <Check size={12} /> Save
                    </button>
                    <button onClick={cancelEdit} className="btn-outline flex items-center gap-1 text-xs py-1.5 px-3">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-violet-400 transition-colors">
                    <GripVertical size={16} />
                  </div>
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                    {skill.icon ? (
                      <img src={skill.icon} alt={skill.name} className="w-9 h-9 object-contain" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold">
                        {skill.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{skill.name}</div>
                    {skill.level && (
                      <div className="text-gray-500 text-xs">{skill.level}</div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(skill)}
                      className="w-7 h-7 rounded-lg hover:bg-violet-600/20 hover:text-violet-400 text-gray-500 transition-all flex items-center justify-center"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="w-7 h-7 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
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

function SkillForm({ form, setForm }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Skill Name *</label>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. React JS"
          className="admin-input"
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Icon URL</label>
        <input
          value={form.icon}
          onChange={e => setForm({ ...form, icon: e.target.value })}
          placeholder="https://cdn.../react.svg"
          className="admin-input"
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Level</label>
        <select
          value={form.level}
          onChange={e => setForm({ ...form, level: e.target.value })}
          className="admin-input bg-navy-800"
        >
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  )
}
