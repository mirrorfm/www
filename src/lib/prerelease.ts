const STORAGE_KEY = 'prerelease'

export function checkPrerelease(): boolean {
  const params = new URLSearchParams(window.location.search)

  // ?beta or ?pre or ?beta=1 enables, ?beta=0 disables
  for (const key of ['beta', 'pre', 'prerelease']) {
    if (params.has(key)) {
      const val = params.get(key)
      if (val === '0' || val === 'false') {
        localStorage.removeItem(STORAGE_KEY)
        return false
      }
      localStorage.setItem(STORAGE_KEY, '1')
      return true
    }
  }

  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function isPrerelease(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

const SPOTIFY_KEY = 'show_spotify'

export function checkShowSpotify(): boolean {
  const params = new URLSearchParams(window.location.search)
  if (params.has('spotify')) {
    const val = params.get('spotify')
    if (val === '0' || val === 'false') {
      localStorage.setItem(SPOTIFY_KEY, '0')
      return false
    }
    localStorage.removeItem(SPOTIFY_KEY)
    return true
  }
  return localStorage.getItem(SPOTIFY_KEY) !== '0'
}

export function showSpotify(): boolean {
  return localStorage.getItem(SPOTIFY_KEY) !== '0'
}
