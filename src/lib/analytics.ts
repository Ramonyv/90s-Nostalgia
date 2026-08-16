export type AnalyticsEventName =
  | 'scene_view'
  | 'scene_change'
  | 'memory_explore'
  | 'audio_play'
  | 'audio_pause'
  | 'video_play'
  | 'share_click'
  | 'blog_view'
  | 'blog_to_scene_click'
  | 'scene_to_blog_click'
  | 'external_link_click'

type AnalyticsParameters = Record<string, string | number | boolean | undefined>

const sentOnce = new Set<string>()

export function trackEvent(name: AnalyticsEventName, parameters: AnalyticsParameters = {}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', name, parameters)
}

export function trackEventOnce(key: string, name: AnalyticsEventName, parameters: AnalyticsParameters = {}) {
  if (sentOnce.has(key)) return
  sentOnce.add(key)
  trackEvent(name, parameters)
}
