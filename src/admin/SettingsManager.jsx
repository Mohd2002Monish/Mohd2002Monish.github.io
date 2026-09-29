import React, { useState, useEffect } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import { fetchFromCloudJson, saveToCloudJson, createJsonBin } from '../utils/cloudJson'
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

      {/* Cloud JSON Store Configuration */}
      <CloudJsonCard />
    </div>
  )
}

function CloudJsonCard() {
  const { state, dispatchAndSave } = usePortfolio()
  const initialBinUrl = localStorage.getItem('cloud_json_bin_url') || state?.settings?.cloudJson?.binUrl || ''
  const initialApiKey = localStorage.getItem('cloud_json_api_key') || state?.settings?.cloudJson?.apiKey || ''

  const [binUrl, setBinUrl] = useState(initialBinUrl)
  const [apiKey, setApiKey] = useState(initialApiKey)
  const [isUploading, setIsUploading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [connected, setConnected] = useState(() => !!initialBinUrl)

  const handleSaveConfig = async () => {
    const cleanUrl = binUrl.trim()
    const cleanKey = apiKey.trim()

    if (!cleanUrl) {
      localStorage.removeItem('cloud_json_bin_url')
      localStorage.removeItem('cloud_json_api_key')
      setConnected(false)
      await dispatchAndSave({
        type: 'UPDATE_SETTINGS',
        payload: {
          cloudJson: { binUrl: '', apiKey: '' }
        }
      })
      toast.success('Cloud JSON sync disabled')
      return
    }

    localStorage.setItem('cloud_json_bin_url', cleanUrl)
    if (cleanKey) localStorage.setItem('cloud_json_api_key', cleanKey)
    setConnected(true)

    await dispatchAndSave({
      type: 'UPDATE_SETTINGS',
      payload: {
        cloudJson: { binUrl: cleanUrl, apiKey: cleanKey }
      }
    })
    toast.success('Cloud JSON configuration saved!')
  }

  const handleUploadCurrentData = async () => {
    const cleanUrl = binUrl.trim()
    const cleanKey = apiKey.trim()
    if (!cleanUrl) return toast.error('Please enter your Cloud Bin URL first')

    setIsUploading(true)
    try {
      await saveToCloudJson({
        binUrl: cleanUrl,
        apiKey: cleanKey,
        data: state,
      })
      toast.success('Portfolio successfully published to Cloud JSON store!')
      setConnected(true)
    } catch (e) {
      toast.error(e.message || 'Failed to upload to Cloud JSON')
    } finally {
      setIsUploading(false)
    }
  }

  const handleTestConnection = async () => {
    const cleanUrl = binUrl.trim()
    const cleanKey = apiKey.trim()
    if (!cleanUrl) return toast.error('Please enter a Cloud Bin URL')

    setIsTesting(true)
    try {
      const data = await fetchFromCloudJson({ binUrl: cleanUrl, apiKey: cleanKey })
      if (data && (data.skills || data.projects || data.experiences)) {
        toast.success(`Connected! Found ${data.projects?.length || 0} projects and ${data.experiences?.length || 0} experiences in Cloud store.`)
        setConnected(true)
      } else {
        toast.error('Connected to URL, but no valid portfolio data was found. Try clicking "Upload Current Data".')
      }
    } catch (e) {
      toast.error(e.message || 'Connection failed')
    } finally {
      setIsTesting(false)
    }
  }

  const handleAutoCreateBin = async () => {
    const cleanKey = apiKey.trim()
    if (!cleanKey) return toast.error('Please enter your JSONBin Master Key first')

    setIsUploading(true)
    try {
      const result = await createJsonBin({ apiKey: cleanKey, data: state })
      setBinUrl(result.binUrl)
      localStorage.setItem('cloud_json_bin_url', result.binUrl)
      localStorage.setItem('cloud_json_api_key', cleanKey)
      setConnected(true)
      await dispatchAndSave({
        type: 'UPDATE_SETTINGS',
        payload: {
          cloudJson: { binUrl: result.binUrl, apiKey: cleanKey }
        }
      })
      toast.success('New Bin automatically created & initialized with your portfolio!')
    } catch (e) {
      toast.error(e.message || 'Failed to auto-create bin')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="glass-card p-6 border-cyan-500/20 flex flex-col gap-5 mt-8" style={{ background: '#080d1a' }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Cloud JSON Store (Zero-Backend Live Sync)</h3>
            <span
              className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold"
              style={{
                background: connected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                color: connected ? '#4ade80' : '#facc15',
                border: connected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
              }}
            >
              {connected ? 'Active' : 'Not Configured'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Connect a cloud JSON endpoint (like <span className="text-cyan-400 font-mono">JSONBin.io</span> or <span className="text-cyan-400 font-mono">npoint.io</span>). Any edit you make in this Admin panel will automatically rewrite the cloud JSON file, keeping your live site updated <strong>instantly</strong> for visitors worldwide.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5" htmlFor="cloud-api-key">
            JSONBin Master Key (API Key)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="cloud-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="flex-1 bg-navy-950 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none text-xs font-mono focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            />
            <button
              onClick={handleAutoCreateBin}
              disabled={isUploading}
              className="btn-outline flex items-center justify-center gap-1.5 text-xs py-2 px-3 whitespace-nowrap"
              style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#a5b4fc' }}
            >
              <Sparkles size={13} />
              <span>{isUploading ? 'Creating...' : 'Auto-Create Bin in 1-Click'}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            Get your free Master Key from{' '}
            <a href="https://jsonbin.io/app/api-keys" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
              jsonbin.io/app/api-keys ↗
            </a>
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5" htmlFor="cloud-bin-url">
            Cloud Bin URL or Bin ID
          </label>
          <input
            id="cloud-bin-url"
            type="text"
            value={binUrl}
            onChange={(e) => setBinUrl(e.target.value)}
            placeholder="e.g. https://api.jsonbin.io/v3/b/66fa... or 66fa... or https://api.npoint.io/..."
            className="w-full bg-navy-950 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none text-xs font-mono focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          />
          <p className="text-[11px] text-gray-500 mt-1.5">
            Tip: If creating a bin manually on JSONBin's site, type <code className="text-cyan-400 font-mono font-bold">{}</code> in their editor before saving to avoid the &quot;Bin cannot be blank&quot; error.
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSaveConfig}
            className="btn-primary py-2 px-4 text-xs font-semibold"
          >
            Save Configuration
          </button>
          <button
            onClick={handleUploadCurrentData}
            disabled={isUploading}
            className="btn-outline py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
            style={{ borderColor: 'rgba(14, 165, 233, 0.4)', color: '#38bdf8' }}
          >
            {isUploading ? 'Uploading Data...' : 'Upload Current Data to Cloud'}
          </button>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="text-xs text-gray-400 hover:text-white underline py-1 px-2"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  )
}

