import { useEffect, useState } from 'react'

export type ConsentPreferences = { necessary: true; analytics: boolean; advertising: boolean }
const STORAGE_KEY = 'yaadein-consent-v1'
const defaultPreferences: ConsentPreferences = { necessary: true, analytics: false, advertising: false }

export function readConsent(): ConsentPreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultPreferences, ...JSON.parse(stored), necessary: true } : null
  } catch { return null }
}

function sendConsent(preferences: ConsentPreferences) {
  window.gtag?.('consent', 'update', {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: preferences.advertising ? 'granted' : 'denied',
    ad_user_data: preferences.advertising ? 'granted' : 'denied',
    ad_personalization: preferences.advertising ? 'granted' : 'denied',
  })
  window.dispatchEvent(new CustomEvent('yaadein-consent', { detail: preferences }))
}

export function openCookieSettings() { window.dispatchEvent(new Event('yaadein-open-cookie-settings')) }

export function ConsentManager() {
  const [open, setOpen] = useState(() => !readConsent())
  const [preferences, setPreferences] = useState<ConsentPreferences>(() => readConsent() || defaultPreferences)
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('yaadein-open-cookie-settings', show)
    const saved = readConsent(); if (saved) sendConsent(saved)
    return () => window.removeEventListener('yaadein-open-cookie-settings', show)
  }, [])
  const save = (next: ConsentPreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setPreferences(next); sendConsent(next); setOpen(false)
  }
  if (!open) return null
  return <div className="consent-panel" role="dialog" aria-modal="true" aria-labelledby="consent-title">
    <p className="eyebrow">Your preferences</p><h2 id="consent-title">Cookies, with a light touch.</h2>
    <p>Necessary storage remembers player and consent settings. Analytics helps us understand visits. Advertising remains off unless you allow it and the site is configured for it.</p>
    <label><span><strong>Necessary</strong><small>Player, session and preference functions</small></span><input type="checkbox" checked disabled /></label>
    <label><span><strong>Analytics</strong><small>Google Analytics measurement</small></span><input type="checkbox" checked={preferences.analytics} onChange={event => setPreferences({ ...preferences, analytics: event.target.checked })} /></label>
    <label><span><strong>Advertising</strong><small>Reserved for a future approved AdSense setup</small></span><input type="checkbox" checked={preferences.advertising} onChange={event => setPreferences({ ...preferences, advertising: event.target.checked })} /></label>
    <div className="consent-actions"><button onClick={() => save(defaultPreferences)}>Necessary only</button><button className="button-primary" onClick={() => save(preferences)}>Save choices</button><button onClick={() => save({ necessary: true, analytics: true, advertising: true })}>Accept all</button></div>
  </div>
}
