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
    default: return state
  }
}

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (IS_DEV) {
      fetch('/api/portfolio')
        .then(r => r.json())
        .then(data => {
          dispatch({ type: 'SET_DATA', payload: data })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const saveToFile = async (newState) => {
    if (!IS_DEV) return
    setSaving(true)
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState, null, 2),
      })
    } catch (e) {
      console.error('Failed to save:', e)
    } finally {
      setSaving(false)
    }
  }

  const dispatchAndSave = async (action) => {
    dispatch(action)
    // Build the new state manually for saving
    const newState = reducer(state, action)
    await saveToFile(newState)
  }

  return (
    <PortfolioContext.Provider value={{ state, dispatch, dispatchAndSave, saving, loading }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return ctx
}
