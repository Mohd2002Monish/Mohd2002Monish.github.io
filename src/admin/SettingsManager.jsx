import React, { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import { syncToGitHubRepo } from '../utils/centralSync'
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

      {/* Centralized Cloud Data Sync (Live Rewrite) */}
      <GitHubSyncCard />
    </div>
  )
}

function GitHubSyncCard() {
  const { state } = usePortfolio()
  const [token, setToken] = useState(() => localStorage.getItem('github_sync_token') || '')
  const [isSyncing, setIsSyncing] = useState(false)
  const [savedToken, setSavedToken] = useState(() => !!localStorage.getItem('github_sync_token'))

  const handleSaveToken = () => {
    if (!token.trim()) {
      localStorage.removeItem('github_sync_token')
      setSavedToken(false)
      toast.success('Live sync token removed')
      return
    }
    localStorage.setItem('github_sync_token', token.trim())
    setSavedToken(true)
    toast.success('GitHub Live Sync token saved!')
  }

  const handleLiveRewrite = async () => {
    const currentToken = token.trim() || localStorage.getItem('github_sync_token')
    if (!currentToken) {
      return toast.error('Please enter a GitHub Personal Access Token first')
    }
    setIsSyncing(true)
    try {
      await syncToGitHubRepo({
        token: currentToken,
        data: state,
      })
      toast.success('Centralized portfolio-data.json successfully rewritten on GitHub!')
    } catch (err) {
      toast.error(err.message || 'Failed to rewrite file on GitHub')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="glass-card p-6 border-cyan-500/20 flex flex-col gap-5 mt-8" style={{ background: '#080d1a' }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Centralized Live Sync (GitHub)</h3>
            <span
              className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold"
              style={{
                background: savedToken ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                color: savedToken ? '#4ade80' : '#facc15',
                border: savedToken ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
              }}
            >
              {savedToken ? 'Active' : 'Setup Required'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            When configured, any change you make in this Admin Panel automatically rewrites{' '}
            <code className="text-cyan-400">src/data/portfolio-data.json</code> centrally in your GitHub repository, updating your portfolio live worldwide without manual commits.
          </p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-300 block mb-1.5" htmlFor="gh-token-input">
          GitHub Personal Access Token (classic with repo permission)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="gh-token-input"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="flex-1 bg-navy-950 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none text-xs font-mono focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          />
          <button
            onClick={handleSaveToken}
            className="btn-outline text-xs px-4 py-2.5 whitespace-nowrap"
          >
            Save Token
          </button>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">
          Stored only in your browser's private localStorage. Generate one at{' '}
          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Live+Admin"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            github.com/settings/tokens ↗
          </a>
        </p>
      </div>

      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleLiveRewrite}
          disabled={isSyncing}
          className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs font-semibold disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
        >
          {isSyncing ? 'Rewriting File on GitHub...' : 'Rewrite Central File Now'}
        </button>
        <span className="text-[11px] text-gray-500">
          Target: <span className="text-gray-300 font-mono">Mohd2002Monish/Mohd2002Monish.github.io</span>
        </span>
      </div>
    </div>
  )
}

