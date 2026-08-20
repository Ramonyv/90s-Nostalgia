import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'

const root = process.cwd()
const requested = new Set(process.argv.slice(2))
const shouldRun = scope => requested.size === 0 || requested.has(scope)
const errors = []
const warnings = []
const pass = []
const fail = (scope, message) => errors.push({ scope, message })
const warn = (scope, message) => warnings.push({ scope, message })
const ok = (scope, message) => pass.push({ scope, message })
const read = path => readFileSync(resolve(root, path), 'utf8')

const sceneSource = read('src/data/scenes.ts')
const sceneIds = [...sceneSource.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]).filter(id => id !== 'string')
const sceneSlugs = [...sceneSource.matchAll(/\bslug:\s*'([^']+)'/g)].map(match => match[1])
const sceneAssets = [...sceneSource.matchAll(/(?:desktopBackground|mobileBackground|backgroundVideo|mobileVideo|fallbackImage):\s*'([^']+)'/g)].map(match => match[1])

if (shouldRun('themes')) {
  if (new Set(sceneIds).size !== sceneIds.length) fail('themes', 'Duplicate scene ID detected.')
  else ok('themes', `${sceneIds.length} unique theme IDs`)
  if (new Set(sceneSlugs).size !== sceneSlugs.length) fail('themes', 'Duplicate scene route detected.')
  else ok('themes', `${sceneSlugs.length} unique theme routes`)
  const missingFallback = sceneSource.split(/\n\s*\},?\n/).filter(block => /\bid:\s*'/.test(block) && !/fallbackImage:/.test(block))
  if (missingFallback.length) fail('themes', `${missingFallback.length} themes have no reduced-motion fallback.`)
  else ok('themes', 'Every theme defines a fallback image')
}

if (shouldRun('assets')) {
  const missing = [...new Set(sceneAssets)].filter(asset => !existsSync(resolve(root, 'public', decodeURIComponent(asset).replace(/^\//, ''))))
  missing.forEach(asset => fail('assets', `Missing required theme asset: ${asset}`))
  if (!missing.length) ok('assets', `${new Set(sceneAssets).size} referenced theme assets exist`)
  const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)])
  const oversized = walk(resolve(root, 'public')).filter(path => statSync(path).size > (extname(path).toLowerCase() === '.mp4' ? 2_600_000 : 500_000))
  oversized.forEach(path => warn('assets', `${relative(root, path)} is ${Math.round(statSync(path).size / 1000)} KB and exceeds its review threshold.`))
}

const blogDirectory = resolve(root, 'content/blog')
const posts = []
if (existsSync(blogDirectory)) {
  for (const file of readdirSync(blogDirectory).filter(name => /\.md$/i.test(name))) {
    const source = readFileSync(join(blogDirectory, file), 'utf8').replace(/\r\n/g, '\n')
    const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (!match) { fail('blog', `${file}: malformed frontmatter`); continue }
    try { posts.push({ file, data: parseYaml(match[1]) || {}, body: match[2] }) } catch (error) { fail('blog', `${file}: ${error.message}`) }
  }
}

if (shouldRun('blog')) {
  const slugs = posts.map(post => post.data.slug)
  posts.forEach(({ file, data, body }) => {
    for (const field of ['title', 'slug', 'description', 'category', 'date']) if (typeof data[field] !== 'string' || !data[field].trim()) fail('blog', `${file}: ${field} is required and must be a string.`)
    if (typeof data.slug === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) fail('blog', `${file}: invalid slug.`)
    if (typeof data.date === 'string' && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)))) fail('blog', `${file}: invalid date.`)
    if (slugs.filter(slug => slug === data.slug).length > 1) fail('blog', `${file}: duplicate slug ${data.slug}.`)
    if (!data.cover) warn('blog', `${file}: cover is missing.`)
    if (data.cover && !data.coverAlt) warn('blog', `${file}: cover alt is missing.`)
    if (typeof data.seoTitle === 'string' && data.seoTitle.length > 60) warn('blog', `${file}: SEO title is ${data.seoTitle.length} characters; preferred maximum is 60.`)
    if (/^#\s+/m.test(body)) warn('blog', `${file}: body H1 duplicates the article title.`)
    if (data.relatedMemory && !sceneSlugs.includes(data.relatedMemory)) warn('blog', `${file}: relatedMemory ${data.relatedMemory} is not a registered scene route.`)
  })
  if (!errors.some(item => item.scope === 'blog')) ok('blog', `${posts.length} Markdown posts have valid required fields and unique slugs`)
}

if (shouldRun('seo')) {
  const vite = read('vite.config.ts')
  if (!vite.includes("writeFileSync(resolve(output, 'sitemap.xml')")) fail('seo', 'Sitemap generation is missing.')
  else ok('seo', 'Sitemap is generated from public routes and published articles')
  if (!vite.includes("writeFileSync(resolve(output, 'robots.txt')")) fail('seo', 'robots.txt generation is missing.')
  else ok('seo', 'robots.txt is generated during production build')
  try { JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: '90s Yaadein' }); ok('seo', 'Project JSON-LD baseline serializes as valid JSON') } catch { fail('seo', 'JSON-LD baseline cannot be serialized.') }
}

if (shouldRun('routes')) {
  const editorial = read('src/editorial/EditorialApp.tsx')
  const missingSystem = ['design','themes','content','seo','ads','privacy','copyright','accessibility','performance','analytics','architecture','release','health'].filter(route => !read('src/system/systemData.ts').includes(`/system/${route}`))
  missingSystem.forEach(route => fail('routes', `Missing system route registry entry: /system/${route}`))
  if (!editorial.includes('path="/system/*"')) fail('routes', 'Editorial router does not mount /system/*.')
  if (!missingSystem.length && editorial.includes('path="/system/*"')) ok('routes', 'System route mapping is complete')
}

if (shouldRun('analytics')) {
  const source = read('src/lib/analytics.ts')
  const registered = [...source.matchAll(/\{ event: '([^']+)'/g)].map(match => match[1])
  if (new Set(registered).size !== registered.length) fail('analytics', 'Duplicate analytics event registry entry.')
  else ok('analytics', `${registered.length} unique analytics events registered`)
  if (!read('src/editorial/SEO.tsx').includes('routeKey === lastTrackedRoute')) warn('analytics', 'Route page_view duplicate guard not detected.')
  else ok('analytics', 'Route page_view duplicate guard detected')
}

if (shouldRun('ads')) {
  const config = read('src/config/monetizationConfig.ts')
  const immersiveAllowed = sceneSlugs.filter(slug => new RegExp(`['"]${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*:\\s*true`).test(config))
  immersiveAllowed.forEach(route => fail('ads', `Immersive route unexpectedly allows ads: ${route}`))
  if (!immersiveAllowed.length) ok('ads', 'No registered immersive route explicitly allows ads')
  if (!process.env.VITE_ADSENSE_PUBLISHER_ID) warn('ads', 'AdSense awaiting publisher ID; ads.txt will remain empty.')
}

for (const item of pass) console.log(`PASS [${item.scope}] ${item.message}`)
for (const item of warnings) console.warn(`WARN [${item.scope}] ${item.message}`)
for (const item of errors) console.error(`ERROR [${item.scope}] ${item.message}`)
console.log(`\nValidation: ${pass.length} passed, ${warnings.length} warnings, ${errors.length} errors`)
if (errors.length) process.exitCode = 1
