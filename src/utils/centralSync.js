// Centralized cloud sync utility for Portfolio
// Enables live rewriting of portfolio data directly to GitHub or a centralized JSON endpoint

export async function fetchLivePortfolioData(customUrl) {
  const url = customUrl || 'https://raw.githubusercontent.com/Mohd2002Monish/Mohd2002Monish.github.io/master/src/data/portfolio-data.json'
  try {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data && typeof data === 'object' && (data.skills || data.projects || data.experiences)) {
      return data
    }
  } catch (err) {
    console.warn('Could not fetch live centralized data:', err)
  }
  return null
}

export async function syncToGitHubRepo({
  token,
  owner = 'Mohd2002Monish',
  repo = 'Mohd2002Monish.github.io',
  branch = 'master',
  filePath = 'src/data/portfolio-data.json',
  data,
}) {
  if (!token) {
    throw new Error('GitHub Personal Access Token is required to sync to GitHub')
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`

  // 1. Get current file SHA
  let currentSha = null
  try {
    const getRes = await fetch(`${apiUrl}?ref=${branch}&t=${Date.now()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (getRes.ok) {
      const fileInfo = await getRes.json()
      currentSha = fileInfo.sha
    }
  } catch (e) {
    console.warn('Could not get existing file SHA, will attempt create:', e)
  }

  // 2. Base64 encode the new JSON data (utf-8 safe)
  const jsonString = JSON.stringify(data, null, 2)
  const encodedContent = btoa(unescape(encodeURIComponent(jsonString)))

  // 3. Commit the updated JSON file to the repo
  const putBody = {
    message: 'chore: live update portfolio data via admin dashboard [skip ci]',
    content: encodedContent,
    branch,
  }
  if (currentSha) {
    putBody.sha = currentSha
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(putBody),
  })

  if (!putRes.ok) {
    const errorData = await putRes.json().catch(() => ({}))
    throw new Error(errorData.message || `GitHub API error: ${putRes.status}`)
  }

  return await putRes.json()
}
