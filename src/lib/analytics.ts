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
  | 'interaction_first_ripple'

export type AnalyticsEventDefinition = {
  event: AnalyticsEventName
  trigger: string
  parameters: string[]
  route: string
  status: 'Live'
}

/** Runtime companion to AnalyticsEventName. System docs and future checks read this registry. */
export const analyticsEvents: AnalyticsEventDefinition[] = [
  { event: 'scene_view', trigger: 'A memory scene becomes current', parameters: ['scene_id', 'scene_title'], route: 'Memory routes', status: 'Live' },
  { event: 'scene_change', trigger: 'Visitor moves between scenes', parameters: ['from_scene', 'to_scene', 'method'], route: 'Memory routes', status: 'Live' },
  { event: 'memory_explore', trigger: 'Visitor enters a memory from an index', parameters: ['to_scene', 'method'], route: '/memories', status: 'Live' },
  { event: 'audio_play', trigger: 'First intentional audio playback', parameters: ['audio_type', 'playlist', 'source'], route: 'Memory routes', status: 'Live' },
  { event: 'audio_pause', trigger: 'Visitor pauses audio', parameters: ['audio_type', 'source'], route: 'Memory routes', status: 'Live' },
  { event: 'video_play', trigger: 'Visitor starts scene video', parameters: ['scene_id'], route: 'Memory routes', status: 'Live' },
  { event: 'share_click', trigger: 'Visitor uses an article share control', parameters: ['method', 'slug'], route: '/journal/:slug', status: 'Live' },
  { event: 'blog_view', trigger: 'A journal article is viewed', parameters: ['slug', 'category'], route: '/journal/:slug', status: 'Live' },
  { event: 'blog_to_scene_click', trigger: 'Article links to a related memory', parameters: ['slug', 'scene'], route: '/journal/:slug', status: 'Live' },
  { event: 'scene_to_blog_click', trigger: 'Scene links to the journal', parameters: ['scene_id'], route: 'Memory routes', status: 'Live' },
  { event: 'external_link_click', trigger: 'Visitor follows an external link', parameters: ['link_url', 'link_domain', 'link_text'], route: 'All routes', status: 'Live' },
  { event: 'interaction_first_ripple', trigger: 'Visitor first touches the Sukoon water surface', parameters: ['scene_id', 'interaction'], route: '/sukoon', status: 'Live' },
]

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
