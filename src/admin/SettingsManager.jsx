import React, { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import toast from 'react-hot-toast'

export default function SettingsManager() {
  const { state, dispatchAndSave } = usePortfolio()
  const settings = state.settings || { defaultTheme: 'dark', allowThemeToggle: true }

  const [defaultTheme, setDefaultTheme] = useState(settings.defaultTheme || 'dark')
  const [allowThemeToggle, setAllowThemeToggle] = useState(settings.allowThemeToggle !== false)
  const [savingSettings, setSavingSettings] = useState(false)

  // Keep local state in sync with context
  useEffect(() => {
    setDefaultTheme(settings.defaultTheme || 'dark')
    setAllowThemeToggle(settings.allowThemeToggle !== false)
  }, [state.settings])

  const handleSave = async () => {
    setSavingSettings(true)
    try {
      await dispatchAndSave({
        type: 'UPDATE_SETTINGS',
        payload: {
          defaultTheme,
          allowThemeToggle,
        },
      })
      toast.success('Settings saved!')
    } catch (e) {
      toast.error('Failed to save settings')
    } finally {
      setSavingSettings(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>System Settings</h2>
        <p className="text-xs text-gray-500 mt-1">Configure your portfolio site preferences</p>
      </div>

      <div className="glass-card p-6 border-violet-500/20 flex flex-col gap-6" style={{ background: '#080d1a' }}>
        {/* Default Theme Selector */}
        <div>
          <label className="text-sm font-semibold text-gray-300 block mb-1.5" htmlFor="default-theme-select">
            Default Theme
          </label>
          <p className="text-xs text-gray-500 mb-3">Which version of the site should open when a user visits it for the first time.</p>
          <select
            id="default-theme-select"
            value={defaultTheme}
            onChange={(e) => setDefaultTheme(e.target.value)}
            className="w-full max-w-xs bg-navy-950 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
          >
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
          </select>
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-white/5" />

        {/* User Theme Toggle Permission Switch */}
        <div>
          <label className="text-sm font-semibold text-gray-300 block mb-1.5">
            Allow User Theme Toggle
          </label>
          <p className="text-xs text-gray-500 mb-4">Give visitors permission to switch between Light and Dark mode themselves via a toggle button in the navigation bar.</p>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowThemeToggle}
              onChange={(e) => setAllowThemeToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500" />
            <span className="ml-3 text-sm font-medium text-gray-400 peer-checked:text-white">
              {allowThemeToggle ? 'Allowed' : 'Disabled'}
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex justify-start mt-4">
          <button
            onClick={handleSave}
            disabled={savingSettings}
            className="btn-primary flex items-center gap-2 py-3 px-6 text-sm font-semibold disabled:opacity-60"
          >
            <Check size={16} />
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
