import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X, ExternalLink, UploadCloud, GripVertical, ArrowUp, Star } from 'lucide-react'
import { GithubIcon } from '../components/SocialIcons'
import { usePortfolio, resolveImageUrl } from '../context/PortfolioContext'
import toast from 'react-hot-toast'

const empty = { title: '', image: '', stack: '', description: '', liveUrl: '', githubUrl: '' }

export default function ProjectsManager() {
  const { state, dispatchAndSave } = usePortfolio()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const toProjectShape = (f) => ({
    ...f,
    stack: typeof f.stack === 'string'
      ? f.stack.split(',').map(s => s.trim()).filter(Boolean)
      : f.stack,
  })

  const fromProject = (p) => ({
    ...p,
    stack: Array.isArray(p.stack) ? p.stack.join(', ') : p.stack,
  })

  const handleAdd = async () => {
    if (!form.title.trim()) return toast.error('Project title is required')
    const newProject = { ...toProjectShape(form), id: Date.now().toString() }
    // Put new project at the top so it is immediately featured on the homepage
    await dispatchAndSave({ type: 'SET_PROJECTS', payload: [newProject, ...state.projects] })
    toast.success('Project added and featured on homepage!')
    setForm(empty)
    setShowForm(false)
  }

  const handleEdit = async () => {
    if (!form.title.trim()) return toast.error('Project title is required')
    await dispatchAndSave({ type: 'UPDATE_PROJECT', payload: { ...toProjectShape(form), id: editing } })
    toast.success('Project updated!')
    setEditing(null)
    setForm(empty)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await dispatchAndSave({ type: 'DELETE_PROJECT', payload: id })
    toast.success('Project deleted')
  }

  const moveToTop = async (id) => {
    const projIndex = state.projects.findIndex(p => p.id === id)
    if (projIndex <= 0) return
    const updated = [...state.projects]
    const [item] = updated.splice(projIndex, 1)
    updated.unshift(item)
    await dispatchAndSave({ type: 'SET_PROJECTS', payload: updated })
    toast.success(`"${item.title}" is now featured on your homepage!`)
  }

  const startEdit = (proj) => {
    setEditing(proj.id)
    setForm(fromProject(proj))
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Manage Projects</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty) }}
          className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
        >
          <Plus size={15} /> Add Project
        </button>
      </div>

      {/* Homepage Guidance Banner */}
      <div className="mb-6 p-4 rounded-xl bg-violet-950/40 border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-gray-300">
          <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong>Homepage Showcase:</strong> The top 3 projects are featured in your portfolio's <strong>Selected Work</strong> section. Drag handles <strong className="text-violet-300">::</strong> or click <strong className="text-violet-300">Feature on Home</strong> to prioritize any project.
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 mb-6 border-violet-500/30"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4">New Project</h3>
            <ProjectForm form={form} setForm={setForm} />
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4">
                <Check size={14} /> Add Project
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline flex items-center gap-1.5 text-sm py-2 px-4">
                <X size={14} /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        <Reorder.Group axis="y" values={state.projects} onReorder={(newOrder) => dispatchAndSave({ type: 'SET_PROJECTS', payload: newOrder })} className="flex flex-col gap-4">
          <AnimatePresence>
            {state.projects.map((project, index) => (
              <Reorder.Item
                key={project.id}
                value={project}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-5 relative"
              >
              {editing === project.id ? (
                <div>
                  <ProjectForm form={form} setForm={setForm} />
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
                  <div className="mt-2 cursor-grab active:cursor-grabbing text-gray-500 hover:text-violet-400 transition-colors" title="Drag to reorder">
                    <GripVertical size={16} />
                  </div>
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#0d1526' }}>
                    {project.image ? (
                      <img
                        src={resolveImageUrl(project.image)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-violet-400 font-bold text-lg">
                        {project.title?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-semibold">{project.title}</span>
                          {index < 3 ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                              ★ Featured on Home (#{index + 1})
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                              Full Archive (#{index + 1})
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.stack.slice(0, 4).map(t => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-600/15 border border-violet-500/20 text-violet-300">{t}</span>
                          ))}
                          {project.stack.length > 4 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">+{project.stack.length - 4}</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{project.description}</p>
                        <div className="flex gap-3 mt-2 items-center">
                          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-cyan-400 text-xs flex items-center gap-1 hover:underline"><ExternalLink size={11} />Live Demo</a>}
                          {index >= 3 && (
                            <button
                              onClick={() => moveToTop(project.id)}
                              className="text-xs px-2.5 py-0.5 rounded bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/30 flex items-center gap-1 transition-colors"
                              title="Feature on homepage"
                            >
                              <ArrowUp size={11} /> Feature on Home
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(project)} className="w-7 h-7 rounded-lg hover:bg-violet-600/20 hover:text-violet-400 text-gray-500 transition-all flex items-center justify-center" title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="w-7 h-7 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all flex items-center justify-center" title="Delete">
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

function compressImage(file, maxWidth = 1400, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = () => resolve(e.target.result)
      img.src = e.target.result
    }
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

function ProjectForm({ form, setForm }) {
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      return toast.error('Image must be less than 10MB')
    }

    try {
      const optimized = await compressImage(file)
      setForm({ ...form, image: optimized })
      toast.success('Image loaded and optimized!')
    } catch {
      toast.error('Failed to load image')
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
       return toast.error('Please upload an image file')
    }

    if (file.size > 10 * 1024 * 1024) {
      return toast.error('Image must be less than 10MB')
    }

    try {
      const optimized = await compressImage(file)
      setForm({ ...form, image: optimized })
      toast.success('Image loaded and optimized!')
    } catch {
      toast.error('Failed to load image')
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Title *</label>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project name" className="admin-input" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Stack (comma separated)</label>
        <input value={form.stack} onChange={e => setForm({ ...form, stack: e.target.value })} placeholder="React, Node.js, MongoDB" className="admin-input" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-gray-400 mb-1 block">Project Image</label>
        <div 
          className="w-full border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 relative bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('project-image-upload').click()}
        >
          <input 
            id="project-image-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
          />
          {form.image ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#0d1526' }}>
              <img src={resolveImageUrl(form.image)} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Click to change</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-gray-400">
              <UploadCloud size={24} className="mb-2 text-violet-400" />
              <p className="text-sm font-medium text-white">Click or drag image to upload</p>
              <p className="text-xs mt-1">SVG, PNG, JPG (auto-compressed)</p>
            </div>
          )}
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-gray-400 mb-1 block">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Project description..." className="admin-input resize-none" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Live URL</label>
        <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." className="admin-input" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">GitHub URL</label>
        <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." className="admin-input" />
      </div>
    </div>
  )
}
