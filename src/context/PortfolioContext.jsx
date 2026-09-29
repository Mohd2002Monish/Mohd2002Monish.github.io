import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import defaultData from '../data/portfolio-data.json'

const PortfolioContext = createContext(null)

const IS_DEV = import.meta.env.DEV

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA': return { ...action.payload }
    case 'SET_SKILLS': return { ...state, skills: action.payload }
    case 'ADD_SKILL': return { ...state, skills: [...state.skills, action.payload] }
    case 'UPDATE_SKILL': return { ...state, skills: state.skills.map(s => s.id === action.payload.id ? action.payload : s) }
    case 'DELETE_SKILL': return { ...state, skills: state.skills.filter(s => s.id !== action.payload) }
    case 'SET_PROJECTS': return { ...state, projects: action.payload }
    case 'ADD_PROJECT': return { ...state, projects: [...state.projects, action.payload] }
    case 'UPDATE_PROJECT': return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'DELETE_PROJECT': return { ...state, projects: state.projects.filter(p => p.id !== action.payload) }
    case 'SET_EXPERIENCES': return { ...state, experiences: action.payload }
    case 'ADD_EXPERIENCE': return { ...state, experiences: [...state.experiences, action.payload] }
    case 'UPDATE_EXPERIENCE': return { ...state, experiences: state.experiences.map(e => e.id === action.payload.id ? action.payload : e) }
    case 'DELETE_EXPERIENCE': return { ...state, experiences: state.experiences.filter(e => e.id !== action.payload) }
    case 'UPDATE_ABOUT': return { ...state, about: { ...state.about, ...action.payload } }
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } }
    default: return state
  }
}

export const resolveImageUrl = (img) => {
  if (!img) return ''
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img
  if (img.startsWith('/') && !img.startsWith('//')) {
    const base = import.meta.env.BASE_URL || '/'
    return `${base.replace(/\/$/, '')}${img}`
  }
  return img
}

export function PortfolioProvider({ children }) {
  // Always use defaultData from portfolio-data.json as the direct source of truth
  const [state, dispatch] = useReducer(reducer, defaultData)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Clear any legacy localStorage data caches
  useEffect(() => {
    try {
      localStorage.removeItem('portfolio_custom_data')
    } catch (e) {}
  }, [])

  const fetchLatestData = async () => {
    if (!IS_DEV) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        dispatch({ type: 'SET_DATA', payload: data })
      }
    } catch (e) {
      console.warn('Could not fetch portfolio data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestData()

    // Cross-tab real-time sync via BroadcastChannel
    let channel = null
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('portfolio_sync_channel')
        channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_DATA') {
            if (event.data.payload) {
              dispatch({ type: 'SET_DATA', payload: event.data.payload })
            } else {
              fetchLatestData()
            }
          }
        }
      }
    } catch (e) {
      // Ignore if BroadcastChannel is blocked
    }

    // Fallback sync via localStorage storage event
    const handleStorage = (e) => {
      if (e.key === 'portfolio_data_sync') {
        fetchLatestData()
      }
    }

    // Auto-refresh when tab gains focus
    const handleFocus = () => {
      fetchLatestData()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleFocus)

    return () => {
      if (channel) channel.close()
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const saveToFile = async (newState) => {
    // 1. Broadcast to other open tabs in real-time
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('portfolio_sync_channel')
        ch.postMessage({ type: 'SYNC_DATA', payload: newState })
        ch.close()
      }
    } catch (e) {}
    localStorage.setItem('portfolio_data_sync', Date.now().toString())

    // 2. In dev mode, write directly to src/data/portfolio-data.json on disk
    if (IS_DEV) {
      setSaving(true)
      try {
        await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newState, null, 2),
        })
      } catch (e) {
        console.error('Failed to save to disk:', e)
      } finally {
        setSaving(false)
      }
    }
  }

  const dispatchAndSave = async (action) => {
    dispatch(action)
    // Build the new state manually for saving
    const newState = reducer(state, action)
    await saveToFile(newState)
  }

  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const settings = state.settings || { defaultTheme: 'dark', allowThemeToggle: true }
    const saved = localStorage.getItem('portfolio_theme')
    const initialTheme = (settings.allowThemeToggle && saved) ? saved : (settings.defaultTheme || 'dark')
    setTheme(initialTheme)
  }, [state.settings])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
  }, [theme])

  const toggleTheme = () => {
    const settings = state.settings || { defaultTheme: 'dark', allowThemeToggle: true }
    if (!settings.allowThemeToggle) return
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('portfolio_theme', nextTheme)
  }

  return (
    <PortfolioContext.Provider value={{ state, dispatch, dispatchAndSave, saving, loading, theme, toggleTheme, refreshData: fetchLatestData }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return ctx
}
