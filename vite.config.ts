import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'

function publishedBlogPlugin() {
  const virtualId = 'virtual:published-blog'
  const resolvedId = `\0${virtualId}`
  return {
    name: 'published-blog-content',
    resolveId(id: string) { if (id === virtualId) return resolvedId },
    load(id: string) {
      if (id !== resolvedId) return
      const directory = resolve(process.cwd(), 'content/blog')
      if (!existsSync(directory)) return 'export default {}'
      const files = readdirSync(directory).filter(file => /\.(md|markdown)$/i.test(file))
      const entries: Record<string, string> = {}
      const slugs = new Set<string>()
      for (const file of files) {
        const source = readFileSync(resolve(directory, file), 'utf8')
        const match = source.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
        if (!match) throw new Error(`[blog] ${file}: missing or malformed YAML frontmatter`)
        const data = (parseYaml(match[1]) || {}) as Record<string, unknown>
        const title = typeof data.title === 'string' ? data.title.trim() : ''
        const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
        const description = typeof data.description === 'string' ? data.description.trim() : ''
        const category = typeof data.category === 'string' ? data.category.trim() : ''
        const date = typeof data.date === 'string' ? data.date : ''
        if (!title || !slug || !description || !category || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`[blog] ${file}: title, valid slug/date, description and category are required`)
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`[blog] ${file}: invalid slug "${slug}"`)
        if (slugs.has(slug)) throw new Error(`[blog] duplicate slug "${slug}"`)
        slugs.add(slug)
        if (data.draft === true || date > new Date().toISOString().slice(0, 10)) continue
        entries[`content/blog/${file}`] = source
      }
      return `export default ${JSON.stringify(entries)}`
    },
  }
}

type FeedPost = { title: string; slug: string; description: string; date: string; seoTitle: string; seoDescription: string; cover: string }

function getFeedPosts(): FeedPost[] {
  const directory = resolve(process.cwd(), 'content/blog')
  if (!existsSync(directory)) return []
  return readdirSync(directory).filter(file => /\.(md|markdown)$/i.test(file)).flatMap(file => {
    const source = readFileSync(resolve(directory, file), 'utf8').replace(/\r\n/g, '\n')
    const match = source.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return []
    const data = (parseYaml(match[1]) || {}) as Record<string, unknown>
    if (data.draft === true || typeof data.date !== 'string' || data.date > new Date().toISOString().slice(0, 10)) return []
    return [{ title: String(data.title || ''), slug: String(data.slug || ''), description: String(data.description || ''), date: data.date, seoTitle: String(data.seoTitle || data.title || ''), seoDescription: String(data.seoDescription || data.description || ''), cover: String(data.cover || '/social-preview.jpg') }]
  }).sort((a, b) => b.date.localeCompare(a.date))
}

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

function staticDiscoveryPlugin(siteUrl: string, publisherId: string) {
  return {
    name: 'static-discovery-files',
    closeBundle() {
      const output = resolve(process.cwd(), 'dist'); mkdirSync(output, { recursive: true })
      const origin = siteUrl.replace(/\/$/, '')
      const memories = [
        ['salon', 'Mohalle ka salon', 'The neighbourhood chair where every story got a trim.'], ['truck', 'Highway days', 'Dusty roads, one cassette, and chai worth stopping for.'], ['railway', 'Platform no. 2', 'A platform full of chai, newspapers, and patient journeys.'], ['school', 'School Days', 'Wooden desks, chalk dust, and a clock that moved too slowly.'], ['cricket', 'Street Cricket', 'Every lane had a pitch, an umpire, and its own rules.'], ['tv', 'TV Evening', 'The whole room gathered around one flickering screen.'], ['rain', 'Monsoon Memories', 'Wet uniforms, paper boats, and chai under the awning.'], ['gaming', 'Video Game Parlour', 'A dark little room where thirty minutes disappeared.'], ['cassette-shop', 'Cassette Shop', 'Songs were chosen slowly, recorded carefully, and rewound often.'], ['bus-stand', 'Bus Stand', 'No timetable felt certain, but everyone eventually got home.'], ['village', 'Village Summer', 'Hot afternoons, cool shade, and nowhere else to be.'], ['auto-rickshaw', 'Auto Ride', 'Warm wind, familiar roads, and an old song somewhere in the traffic.'], ['adhoori-shaam', 'An Unfinished Evening', 'A rainy permit-room, an old photograph, and a memory that never quite left.'], ['highway-adda', 'Highway Adda', 'A late-night dhaba stop, old motorcycles, and friendship before group chats.'], ['90s-shaadi', '90s Shaadi', 'A neighbourhood baraat of brass, borrowed lights and relatives who danced anyway.'], ['nusrat-night', 'Night, Radio & Nusrat', 'A quiet late-night memory of cassette music, chai and an unforgettable voice.'],
      ]
      const routeMetadata: Array<[string, string, string, string?]> = [
        ['/', '90s Yaadein', 'An interactive archive of everyday memories from 1990s India.'],
        ['/memories', 'Memories', 'Explore illustrated scenes of everyday life in 1990s India.'],
        ...memories.map(([slug, title, description]) => [`/${slug}`, `${title} — 90s Yaadein`, description, `/scenes/${slug === 'rain' ? 'rain/rain' : slug === 'auto-rickshaw' ? 'auto-rickshaw/auto' : slug === 'adhoori-shaam' ? 'adhoori-shaam/adhoori-shaam' : slug === 'highway-adda' ? 'highway-adda/highway-adda' : slug === '90s-shaadi' ? '90s-shaadi/90s-shaadi' : slug === 'nusrat-night' ? 'nusrat-night/nusrat-night' : slug}.webp`] as [string,string,string,string]),
        ['/journal', 'Journal — 90s Yaadein', 'Stories about the places, sounds, objects and everyday moments of 1990s India.'], ['/about', 'About — 90s Yaadein', 'How 90s Yaadein turns everyday memories into interactive digital experiences.'], ['/contact', 'Contact — 90s Yaadein', 'Contact Raman through verified social channels.'], ['/privacy', 'Privacy — 90s Yaadein', 'How 90s Yaadein uses limited data and browser storage.'], ['/terms', 'Terms — 90s Yaadein', 'Terms for using the 90s Yaadein archive.'], ['/editorial-policy', 'Editorial Policy — 90s Yaadein', 'How 90s Yaadein researches, writes and corrects original editorial material.'], ['/accessibility', 'Accessibility — 90s Yaadein', 'The accessibility approach for 90s Yaadein.'], ['/cookies', 'Cookies — 90s Yaadein', 'Necessary, analytics and advertising preference information.'],
      ]
      const publicPaths = routeMetadata.map(([path]) => path)
      const posts = getFeedPosts()
      const urls = [...publicPaths, ...posts.map(post => `/journal/${post.slug}`)]
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(path => `  <url><loc>${escapeXml(`${origin}${path}`)}</loc></url>`).join('\n')}\n</urlset>\n`
      const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>90s Yaadein Journal</title><description>An interactive archive of everyday memories from 1990s India.</description><link>${escapeXml(`${origin}/journal`)}</link>${posts.map(post => `<item><title>${escapeXml(post.title)}</title><description>${escapeXml(post.description)}</description><link>${escapeXml(`${origin}/journal/${post.slug}`)}</link><guid>${escapeXml(`${origin}/journal/${post.slug}`)}</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate></item>`).join('')}</channel></rss>\n`
      writeFileSync(resolve(output, 'sitemap.xml'), sitemap)
      writeFileSync(resolve(output, 'rss.xml'), rss)
      writeFileSync(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`)
      writeFileSync(resolve(output, 'ads.txt'), publisherId ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n` : '')
      const baseHtml = readFileSync(resolve(output, 'index.html'), 'utf8')
      const renderHtml = (path: string, title: string, description: string, image = '/social-preview.jpg', type = 'website', noindex = false) => {
        const canonical = `${origin}${path}`
        const socialImage = image.startsWith('http') ? image : `${origin}${image}`
        return baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeXml(title)}</title>`)
          .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeXml(description)}" />`)
          .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
          .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeXml(title)}" />`)
          .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeXml(description)}" />`)
          .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeXml(socialImage)}" />`)
          .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeXml(title)}" />`)
          .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeXml(description)}" />`)
          .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeXml(socialImage)}" />`)
          .replace('</head>', `    <link rel="canonical" href="${escapeXml(canonical)}" />\n    <meta property="og:url" content="${escapeXml(canonical)}" />\n${noindex ? '    <meta name="robots" content="noindex,nofollow" />\n' : ''}  </head>`)
      }
      for (const [path, title, description, image] of routeMetadata) {
        if (path === '/') { writeFileSync(resolve(output, 'index.html'), renderHtml(path, title, description, image)); continue }
        const html = renderHtml(path, title, description, image)
        const directory = resolve(output, path.slice(1)); mkdirSync(directory, { recursive: true }); writeFileSync(resolve(directory, 'index.html'), html); writeFileSync(resolve(output, `${path.slice(1)}.html`), html)
      }
      for (const post of posts) {
        const path = `/journal/${post.slug}`; const html = renderHtml(path, `${post.seoTitle} — 90s Yaadein`, post.seoDescription, post.cover, 'article')
        const directory = resolve(output, 'journal', post.slug); mkdirSync(directory, { recursive: true }); writeFileSync(resolve(directory, 'index.html'), html); writeFileSync(resolve(output, `journal/${post.slug}.html`), html)
      }
      const adminHtml = renderHtml('/admin/blog', 'Blog Studio — 90s Yaadein', 'Internal Markdown importer.', '/social-preview.jpg', 'website', true)
      const adminDirectory = resolve(output, 'admin/blog'); mkdirSync(adminDirectory, { recursive: true }); writeFileSync(resolve(adminDirectory, 'index.html'), adminHtml); mkdirSync(resolve(output, 'admin'), { recursive: true }); writeFileSync(resolve(output, 'admin/blog.html'), adminHtml)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.SITE_URL || env.DEPLOY_PRIME_URL || env.URL || env.CF_PAGES_URL || 'http://localhost:4173'
  return {
    define: { 'import.meta.env.SITE_URL': JSON.stringify(siteUrl) },
    plugins: [publishedBlogPlugin(), react(), staticDiscoveryPlugin(siteUrl, env.VITE_ADSENSE_PUBLISHER_ID || '')],
  }
})
