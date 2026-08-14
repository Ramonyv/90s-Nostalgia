export const SITE_NAME = '90s Yaadein'
export const SITE_DESCRIPTION = 'An interactive archive of everyday memories from 1990s India.'

const configuredSiteUrl = (import.meta.env.SITE_URL || '').replace(/\/$/, '')

export function getSiteUrl() {
  if (configuredSiteUrl) return configuredSiteUrl
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalized}`
}

export const creatorLinks = [
  { label: 'X', href: 'https://x.com/ramandesigns9' },
  { label: 'Instagram', href: 'https://www.instagram.com/raman1568/' },
  { label: 'Behance', href: 'https://www.behance.net/ramony' },
  { label: 'GitHub', href: 'https://github.com/Ramonyv' },
] as const
