import { monetizationConfig } from '../config/monetizationConfig'
import { scenes } from '../data/scenes'
import { spotifyPlaylists } from '../data/spotify'
import { tracks } from '../data/tracks'
import { allPosts, publishedPosts, validatePost } from '../editorial/blog'
import { analyticsEvents } from '../lib/analytics'

export const systemVersion = '1.0.0'

export type SystemNavGroup = { label: string; items: readonly (readonly [string, string])[] }

export const systemNav: readonly SystemNavGroup[] = [
  { label: 'Overview', items: [['Overview', '/system']] },
  { label: 'Foundations', items: [['Design', '/system/design'], ['Themes', '/system/themes']] },
  { label: 'Content', items: [['Editorial', '/system/content'], ['SEO', '/system/seo']] },
  { label: 'Monetization', items: [['Ads', '/system/ads'], ['Privacy', '/system/privacy']] },
  { label: 'Quality', items: [['Copyright', '/system/copyright'], ['Accessibility', '/system/accessibility'], ['Performance', '/system/performance'], ['Analytics', '/system/analytics']] },
  { label: 'Engineering', items: [['Architecture', '/system/architecture'], ['Release', '/system/release'], ['System Health', '/system/health']] },
]

export const publicEditorialRoutes = ['/memories', '/journal', '/about', '/contact', '/privacy', '/terms', '/editorial-policy', '/accessibility', '/cookies']
export const systemRoutes = systemNav.flatMap(group => group.items.map(item => item[1]))
export const adminRoutes = ['/admin/blog', '/admin/experience']

export const designTokens = {
  colors: [
    ['--cream', '#f4ead7', 'Primary light text and nostalgic surface'], ['--paper', '#ead9bb', 'Secondary paper surface'], ['--ink', '#2a2925', 'Primary dark text'], ['--rust', '#c65232', 'Primary accent and focus'], ['--mustard', '#d69a32', 'Warm highlight'], ['--green', '#65734a', 'Success and earth accent'], ['--blue', '#58748a', 'Cool accent'], ['--brown', '#6a4935', 'Secondary earth tone'],
  ],
  type: [
    ['Interface / English', 'DM Sans', '400–700', 'Controls, labels, metadata'], ['Editorial', 'Literata / Georgia', '400–600', 'Articles and documentation headings'], ['Hindi / Devanagari', 'Noto Sans Devanagari', '400–600', 'Hindi titles and brand'],
  ],
  spacing: [['2xs', '4px'], ['xs', '8px'], ['sm', '12px'], ['md', '16px'], ['lg', '24px'], ['xl', '32px'], ['2xl', '48px'], ['3xl', '72px'], ['4xl', '110px']],
  radii: [['Compact controls', '2px'], ['Pills', '999px'], ['Scene canvas', '0']],
  shadows: [['Floating controls', '0 8px 24px rgba(25,14,7,.22)'], ['Editorial surface', '0 16px 55px rgba(45,30,18,.08)'], ['Modal', '0 22px 70px rgba(24,14,8,.28)']],
  breakpoints: [['Mobile', '≤600px'], ['Small tablet', '≤760px'], ['Tablet', '≤900px'], ['Desktop', '>900px'], ['Wide content', '1180–1380px max-width']],
}

export const componentRegistry = [
  ['Button', 'Primary navigation or committed action', 'Default · Primary · Disabled'], ['Icon button', 'Compact labeled control', 'Default · Hover · Focus'], ['Pill', 'Short filter or metadata', 'Selected · Unselected'], ['Scene navigation', 'Move between memory scenes', 'Desktop · Mobile'], ['Memory card', 'Enter a scene from the archive', 'Editorial index'], ['Hotspot', 'Reveal a scene detail or action', 'Information · Action'], ['Tooltip', 'Short contextual label', 'Left · Right'], ['Modal', 'Focused secondary interaction', 'Open · Closed'], ['Creator widget', 'Creator identity and links', 'Expanded · Compact'], ['Music player', 'Global audio transport', 'Playing · Paused · Muted'], ['Playlist card', 'Authorized Spotify playlist entry', 'Available · Placeholder'], ['Ambient control', 'Scene ambience volume/state', 'On · Off'], ['Scene title', 'Memory identity and year', 'Desktop · Mobile'], ['Loading state', 'Route and media feedback', 'Dark · Paper'], ['Blog card', 'Journal story preview', 'Featured · Standard'], ['Article metadata', 'Author, date, category and reading time', 'Article'], ['Share controls', 'Native and service sharing', 'Available · Fallback'], ['Consent controls', 'Necessary, analytics and advertising choices', 'First visit · Settings'], ['Ad slot placeholder', 'Clearly labeled editorial ad surface', 'Configured only'], ['System table', 'Dense registry data', 'Desktop · Stacked mobile'], ['Badge', 'Compact category label', 'Neutral · Accent'], ['Status indicator', 'Health or lifecycle state', 'Healthy · Warning · Error · Not configured'],
] as const

export const motionRegistry = [
  ['Scene fade / scale', '700–900ms', 'ease-out', 'Low-amplitude scene entrance'], ['Tooltip', '250ms', 'ease', 'Opacity and 5px translate'], ['Modal', '300–380ms', 'cubic-bezier(.22,1,.36,1)', 'Opacity and small scale'], ['Music player', '380ms', 'cubic-bezier(.22,1,.36,1)', '12px translate and .94 scale'], ['Hotspot', '300ms', 'ease', '1.25 maximum hover scale'], ['UI auto-hide', '250–350ms', 'ease', 'Opacity and short translate'], ['Ripple', 'Interaction-driven', 'Canvas response', 'Only after intentional pointer input'], ['Ambient animation', '5–17s', 'linear / ease-in-out', 'Low amplitude, decorative only'],
] as const

export const privacyRegistry = [
  ['Consent preference', 'Remember consent choices', 'Necessary', 'Browser localStorage', 'Disclosed'], ['Spotify position/collapse', 'Remember player placement', 'Necessary', 'Browser localStorage / Spotify', 'Disclosed'], ['Keepsake progress', 'Remember viewed keepsakes', 'Necessary', 'Browser localStorage', 'Disclosed'], ['Intro and volume', 'Preserve session experience state', 'Necessary', 'Browser sessionStorage', 'Disclosed'], ['Google Analytics', 'Measure visits after consent', 'Analytics', 'Google', 'Disclosed'], ['Google AdSense', 'Advertising after configuration and consent', 'Advertising', 'Google', 'Not configured'], ['Spotify embed', 'Authorized music playback', 'Necessary / external service', 'Spotify', 'Disclosed'], ['Hosting logs', 'Delivery and security', 'Necessary', 'Cloudflare / Netlify', 'Disclosed'],
] as const

export const seoStructures = [
  ['WebSite', 'Journal index'], ['Article', 'Published journal articles'], ['Person', 'Article author'], ['BreadcrumbList', 'Journal articles'],
] as const

export const healthIssues = allPosts.flatMap(post => {
  const result = validatePost(post, allPosts.map(item => item.slug))
  return [...result.errors.map(message => ({ area: 'Content', severity: 'Error' as const, item: post.title, message, location: post.sourcePath })), ...result.warnings.map(message => ({ area: 'Content', severity: 'Warning' as const, item: post.title, message, location: post.sourcePath }))]
})

const missingThemeSeo = scenes.filter(scene => !scene.seoTitle || !scene.seoDescription)
const invalidRelatedMemories = allPosts.filter(post => post.relatedMemory && !scenes.some(scene => scene.slug === post.relatedMemory))

export const derivedHealthIssues = [
  ...healthIssues,
  ...missingThemeSeo.map(scene => ({ area: 'SEO', severity: 'Warning' as const, item: scene.title, message: 'Theme uses fallback metadata rather than explicit SEO fields.', location: 'src/data/scenes.ts' })),
  ...invalidRelatedMemories.map(post => ({ area: 'Content', severity: 'Warning' as const, item: post.title, message: `Related memory does not match a registered route: ${post.relatedMemory}`, location: post.sourcePath })),
]

export const systemStats = [
  ['Themes', scenes.length], ['Components', componentRegistry.length], ['Playlists', Object.values(spotifyPlaylists).filter(value => value.playlistId).length], ['Blog posts', publishedPosts.length], ['Core routes', scenes.length + publicEditorialRoutes.length], ['Analytics events', analyticsEvents.length], ['Registered media', scenes.length * 2 + tracks.length],
] as const

export const data = { scenes, spotifyPlaylists, tracks, allPosts, publishedPosts, analyticsEvents, monetizationConfig }
