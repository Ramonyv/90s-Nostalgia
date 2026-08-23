import { useEffect, useState } from 'react'

type PresenceState = {
  available: boolean
  count: number
  points: number
}

const fallback: PresenceState = { available: false, count: 1, points: 100 }

function visitorSessionId() {
  const storageKey = 'yaadein-visitor-session'
  try {
    const existing = localStorage.getItem(storageKey)
    if (existing) return existing
    const created = crypto.randomUUID().replaceAll('-', '')
    localStorage.setItem(storageKey, created)
    return created
  } catch {
    return crypto.randomUUID().replaceAll('-', '')
  }
}

export function useVisitorPresence() {
  const [presence, setPresence] = useState<PresenceState>(fallback)

  useEffect(() => {
    const sessionId = visitorSessionId()
    let controller: AbortController | null = null

    const heartbeat = async () => {
      if (document.visibilityState === 'hidden') return
      controller?.abort()
      controller = new AbortController()
      try {
        const response = await fetch('/api/visitor-presence', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Presence request failed')
        const data = await response.json() as Partial<PresenceState>
        const count = Math.max(1, Number(data.count) || 1)
        setPresence({ available: data.available === true, count, points: count * 100 })
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setPresence(fallback)
      }
    }

    const onVisibilityChange = () => { if (document.visibilityState === 'visible') void heartbeat() }
    void heartbeat()
    const interval = window.setInterval(() => void heartbeat(), 30_000)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      controller?.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return presence
}
