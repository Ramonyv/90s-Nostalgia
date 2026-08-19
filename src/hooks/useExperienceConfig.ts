import { useEffect, useState } from 'react'
import { DEFAULT_EXPERIENCE_CONFIG, normalizeExperienceConfig, type ExperienceConfig } from '../config/experience'

const REFRESH_INTERVAL = 45_000

export function useExperienceConfig() {
  const [config, setConfig] = useState<ExperienceConfig>(DEFAULT_EXPERIENCE_CONFIG)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const response = await fetch('/api/experience-config', { cache: 'no-store', headers: { accept: 'application/json' } })
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return
        const payload = await response.json() as { config?: unknown }
        if (active) setConfig(normalizeExperienceConfig(payload.config))
      } catch { /* the built-in static configuration remains available */ }
      finally { if (active) setReady(true) }
    }
    const onVisibility = () => { if (document.visibilityState === 'visible') void refresh() }
    void refresh()
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { active = false; window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])
  return { config, ready }
}
