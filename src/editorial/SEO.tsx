import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '../config/site'
import { trackEvent } from '../lib/analytics'

type SEOProps = {
  title?: string
  description?: string
  canonicalPath?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value))
}

export function SEO({ title, description = SITE_DESCRIPTION, canonicalPath = '/', image = '/social-preview.jpg', type = 'website', noindex = false, jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_DESCRIPTION}`
    const canonical = absoluteUrl(canonicalPath)
    const socialImage = image.startsWith('http') ? image : absoluteUrl(image)
    document.title = fullTitle
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large' })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage })
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = canonical
    document.head.querySelectorAll('[data-yaadein-jsonld]').forEach(node => node.remove())
    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.yaadeinJsonld = 'true'
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [canonicalPath, description, image, jsonLd, noindex, title, type])
  return null
}

declare global { interface Window { gtag?: (...args: unknown[]) => void } }

let lastTrackedRoute = typeof window === 'undefined' ? '' : `${window.location.pathname}${window.location.search}`

export function RouteAnalytics() {
  const location = useLocation()
  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`
    if (routeKey === lastTrackedRoute) return
    lastTrackedRoute = routeKey
    window.gtag?.('event', 'page_view', { page_path: `${location.pathname}${location.search}`, page_title: document.title })
  }, [location.pathname, location.search])
  return null
}

export function ExternalLinkAnalytics() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return
      let destination: URL
      try { destination = new URL(anchor.href, window.location.href) } catch { return }
      if (destination.origin === window.location.origin) return
      trackEvent('external_link_click', {
        link_url: destination.href,
        link_domain: destination.hostname,
        link_text: anchor.textContent?.trim().slice(0, 100) || anchor.getAttribute('aria-label') || '',
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
