import { useEffect, useState } from 'react'
import { readConsent } from './ConsentManager'

const enabled = import.meta.env.VITE_ADSENSE_ENABLED === 'true'
const client = import.meta.env.VITE_ADSENSE_CLIENT || ''

export function AdSenseLoader() {
  const [allowed, setAllowed] = useState(() => Boolean(readConsent()?.advertising))
  useEffect(() => {
    const sync = (event: Event) => setAllowed(Boolean((event as CustomEvent).detail?.advertising))
    window.addEventListener('yaadein-consent', sync); return () => window.removeEventListener('yaadein-consent', sync)
  }, [])
  useEffect(() => {
    if (!enabled || !client || !allowed || document.querySelector('script[data-yaadein-adsense]')) return
    const script = document.createElement('script'); script.async = true; script.crossOrigin = 'anonymous'; script.dataset.yaadeinAdsense = 'true'; script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`; document.head.appendChild(script)
  }, [allowed])
  return null
}

export function AdSlot({ slot, format = 'auto', responsive = true, placement }: { slot?: string; format?: string; responsive?: boolean; placement: 'article' | 'list' }) {
  const configuredSlot = slot || (placement === 'article' ? import.meta.env.VITE_ADSENSE_SLOT_ARTICLE : import.meta.env.VITE_ADSENSE_SLOT_LIST)
  const allowed = Boolean(readConsent()?.advertising)
  useEffect(() => {
    if (!enabled || !client || !configuredSlot || !allowed) return
    try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}) } catch { /* AdSense retries on its own. */ }
  }, [allowed, configuredSlot])
  if (!enabled || !client || !configuredSlot || !allowed) return null
  return <aside className="ad-area" aria-label="Advertisement"><span>Advertisement</span><ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client} data-ad-slot={configuredSlot} data-ad-format={format} data-full-width-responsive={String(responsive)} /></aside>
}
