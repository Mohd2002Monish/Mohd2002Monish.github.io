// Cloud JSON Store Integration (JSONBin.io, npoint.io, or any custom cloud JSON endpoint)
// Enables zero-backend real-time data sync across the portfolio

export function extractJsonBinId(input) {
  if (!input) return ''
  const trimmed = input.trim()
  const hexMatch = trimmed.match(/[a-f0-9]{24}/i)
  return hexMatch ? hexMatch[0] : null
}

export function normalizeBinReadUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  
  // If user passed a bare 24-character JSONBin ID or web URL
  const binId = extractJsonBinId(trimmed)
  if (binId && (trimmed.length === 24 || trimmed.includes('jsonbin.io'))) {
    return `https://api.jsonbin.io/v3/b/${binId}/latest`
  }

  if (trimmed.includes('api.jsonbin.io') && !trimmed.endsWith('/latest')) {
    return trimmed.replace(/\/$/, '') + '/latest'
  }
  return trimmed
}

export function normalizeBinWriteUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()

  const binId = extractJsonBinId(trimmed)
  if (binId && (trimmed.length === 24 || trimmed.includes('jsonbin.io'))) {
    return `https://api.jsonbin.io/v3/b/${binId}`
  }

  if (trimmed.includes('api.jsonbin.io') && trimmed.endsWith('/latest')) {
    return trimmed.replace(/\/latest$/, '')
  }
  return trimmed
}

export async function createJsonBin({ apiKey, data, isPrivate = false }) {
  if (!apiKey) {
    throw new Error('Master Key is required to create a bin on JSONBin.io')
  }

  const cleanKey = apiKey.trim()
  const body = JSON.stringify(data || {})

  // Attempt 1: Using X-Master-Key
  let res = await fetch('https://api.jsonbin.io/v3/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': cleanKey,
      'X-Bin-Name': 'portfolio-data',
      'X-Bin-Private': isPrivate ? 'true' : 'false',
    },
    body,
  })

  // Attempt 2: If rejected with 401/403, retry with X-Access-Key in case user copied an Access Key
  if (res.status === 401 || res.status === 403) {
    const retryRes = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': cleanKey,
        'X-Bin-Name': 'portfolio-data',
        'X-Bin-Private': isPrivate ? 'true' : 'false',
      },
      body,
    })
    if (retryRes.ok) {
      res = retryRes
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Failed to create bin (HTTP ${res.status})`)
  }

  const json = await res.json()
  const binId = json.metadata?.id
  return {
    binId,
    binUrl: `https://api.jsonbin.io/v3/b/${binId}`,
    metadata: json.metadata,
  }
}

export async function fetchFromCloudJson({ binUrl, apiKey }) {
  if (!binUrl) return null
  const readUrl = normalizeBinReadUrl(binUrl)
  const cleanKey = apiKey ? apiKey.trim() : ''
  
  const headers = { 'Accept': 'application/json' }
  if (cleanKey) {
    headers['X-Master-Key'] = cleanKey
  }

  try {
    const separator = readUrl.includes('?') ? '&' : '?'
    let res = await fetch(`${readUrl}${separator}t=${Date.now()}`, {
      headers,
      cache: 'no-store',
    })

    // Retry with X-Access-Key if rejected
    if ((res.status === 401 || res.status === 403) && cleanKey) {
      const retryRes = await fetch(`${readUrl}${separator}t=${Date.now()}`, {
        headers: {
          'Accept': 'application/json',
          'X-Access-Key': cleanKey,
        },
        cache: 'no-store',
      })
      if (retryRes.ok) {
        res = retryRes
      }
    }

    if (!res.ok) {
      console.warn(`Cloud JSON fetch returned status ${res.status}`)
      return null
    }

    const json = await res.json()
    // JSONBin wraps data inside `record`
    const payload = json && json.record ? json.record : json

    if (payload && typeof payload === 'object' && (payload.skills || payload.projects || payload.experiences)) {
      return payload
    }
  } catch (err) {
    console.warn('Error reading from Cloud JSON store:', err)
  }
  return null
}

export async function saveToCloudJson({ binUrl, apiKey, data }) {
  if (!binUrl) {
    throw new Error('Cloud JSON Bin URL is required')
  }

  const isNpoint = binUrl.includes('npoint.io')
  const writeUrl = normalizeBinWriteUrl(binUrl)
  const cleanKey = apiKey ? apiKey.trim() : ''
  const method = isNpoint ? 'POST' : 'PUT'

  const baseHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  let headers = { ...baseHeaders }
  if (cleanKey) {
    headers['X-Master-Key'] = cleanKey
  }

  let res = await fetch(writeUrl, {
    method,
    headers,
    body: JSON.stringify(data),
  })

  // If rejected with 401/403 and cleanKey is present, retry with X-Access-Key
  if ((res.status === 401 || res.status === 403) && cleanKey) {
    const retryRes = await fetch(writeUrl, {
      method,
      headers: {
        ...baseHeaders,
        'X-Access-Key': cleanKey,
      },
      body: JSON.stringify(data),
    })
    if (retryRes.ok) {
      res = retryRes
    }
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    let msg = `HTTP ${res.status}`
    try {
      const parsed = JSON.parse(errText)
      if (parsed.message) msg = parsed.message
    } catch (e) {
      if (errText) msg = errText
    }
    throw new Error(`Failed to save to Cloud JSON: ${msg}`)
  }

  return await res.json()
}
