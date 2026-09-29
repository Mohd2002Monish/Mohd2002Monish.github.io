// Cloud JSON Store Integration (JSONBin.io, npoint.io, or any custom cloud JSON endpoint)
// Enables zero-backend real-time data sync across the portfolio

export function normalizeBinReadUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.includes('api.jsonbin.io') && !trimmed.endsWith('/latest')) {
    return trimmed.replace(/\/$/, '') + '/latest'
  }
  return trimmed
}

export function normalizeBinWriteUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.includes('api.jsonbin.io') && trimmed.endsWith('/latest')) {
    return trimmed.replace(/\/latest$/, '')
  }
  return trimmed
}

export async function fetchFromCloudJson({ binUrl, apiKey }) {
  if (!binUrl) return null
  const readUrl = normalizeBinReadUrl(binUrl)
  
  const headers = { 'Accept': 'application/json' }
  if (apiKey) {
    headers['X-Master-Key'] = apiKey
    headers['X-Access-Key'] = apiKey
  }

  try {
    const separator = readUrl.includes('?') ? '&' : '?'
    const res = await fetch(`${readUrl}${separator}t=${Date.now()}`, {
      headers,
      cache: 'no-store',
    })

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

  const writeUrl = normalizeBinWriteUrl(binUrl)
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (apiKey) {
    headers['X-Master-Key'] = apiKey
    headers['X-Access-Key'] = apiKey
  }

  const res = await fetch(writeUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Failed to save to Cloud JSON (HTTP ${res.status}): ${errText || res.statusText}`)
  }

  return await res.json()
}
