import { useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, Check, ChevronRight, Menu, Search, X } from 'lucide-react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SEO } from '../editorial/SEO'
import { formatBytes, largestAssets, performanceBudgets } from './assetAudit'
import { adminRoutes, componentRegistry, data, derivedHealthIssues, designTokens, motionRegistry, privacyRegistry, publicEditorialRoutes, seoStructures, systemNav, systemRoutes, systemStats, systemVersion } from './systemData'
import './system.css'

type Row = readonly (ReactNode | string | number)[]

function Table({ headers, rows, label }: { headers: string[]; rows: readonly Row[]; label: string }) {
  return <div className="system-table-wrap"><table className="system-table"><caption className="sr-only">{label}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} data-label={headers[cellIndex]}>{cell}</td>)}</tr>)}</tbody></table></div>
}

function Status({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'healthy' | 'warning' | 'error' | 'neutral' }) {
  return <span className={`system-status system-status--${tone}`}><i />{children}</span>
}

function Page({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  const location = useLocation()
  return <><SEO title={`${title} · System`} description={intro} canonicalPath={location.pathname} noindex /><article className="system-page"><header className="system-page__header"><p className="system-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>{children}</article></>
}

function Section({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return <section className="system-section"><header><h2>{title}</h2>{intro && <p>{intro}</p>}</header>{children}</section>
}

function RulePair({ subject, good, bad }: { subject: string; good: string; bad: string }) {
  return <div className="system-rule-pair"><p className="system-rule-subject">{subject}</p><div><strong>Do</strong><p>{good}</p></div><div><strong>Don’t</strong><p>{bad}</p></div></div>
}

function Overview() {
  const warnings = derivedHealthIssues.filter(issue => issue.severity === 'Warning').length
  const errors = derivedHealthIssues.filter(issue => issue.severity === 'Error').length
  return <Page eyebrow={`System v${systemVersion}`} title="90s Yaadein System" intro="The design, content, technology and governance system behind the experience.">
    <div className="system-stats">{systemStats.map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <Section title="Current health" intro="Measured from the theme registry and shared blog validator at render time."><div className="system-health-line"><Status tone={errors ? 'error' : warnings ? 'warning' : 'healthy'}>{errors ? `${errors} errors` : warnings ? `${warnings} warnings` : 'Healthy'}</Status><span>{derivedHealthIssues.length} actionable findings</span><Link to="/system/health">Open health dashboard <ChevronRight size={15} /></Link></div></Section>
    <Section title="System map"><div className="system-index">{systemNav.slice(1).flatMap(group => group.items).map(([label, href]) => <Link key={href} to={href}><span>{label}</span><ChevronRight size={16} /></Link>)}</div></Section>
    <Section title="Operating principle"><blockquote>Real configuration → system documentation. A rule lives here only when it reflects the product, a shared project policy, or an explicitly labeled recommendation.</blockquote></Section>
  </Page>
}

function Design() {
  return <Page eyebrow="01 · Foundations" title="Design system" intro="The foundations already used across immersive scenes, editorial pages, and internal tools.">
    <Section title="Color tokens"><Table label="Color tokens" headers={['Token', 'Value', 'Purpose', 'Sample']} rows={designTokens.colors.map(([name, value, purpose]) => [name, <code>{value}</code>, purpose, <span className="system-swatch" style={{ background: value }} aria-label={value} />])} /></Section>
    <Section title="Typography"><Table label="Typography" headers={['Role', 'Family', 'Weight', 'Usage']} rows={designTokens.type} /></Section>
    <Section title="Spacing, radii, and shadows"><div className="system-split"><Table label="Spacing" headers={['Token', 'Value']} rows={designTokens.spacing} /><div><Table label="Radii" headers={['Use', 'Value']} rows={designTokens.radii} /><Table label="Shadows" headers={['Use', 'Value']} rows={designTokens.shadows} /></div></div></Section>
    <Section title="Breakpoints and layout"><Table label="Breakpoints" headers={['Viewport', 'Actual value']} rows={designTokens.breakpoints} /><p className="system-note">Scene canvas: full viewport. Editorial width: 760–1180px. Admin workspace: up to 1380px. System content: up to 1120px. Mobile controls preserve 44px touch targets and safe-area insets.</p></Section>
    <Section title="Component library" intro="These entries reference the existing reusable components; the examples below use the same editorial control styles."><div className="system-component-demo"><button className="system-button">Primary action</button><button className="system-button system-button--quiet">Quiet action</button><span className="system-badge">Metadata</span><Status tone="healthy">Healthy</Status></div><Table label="Components" headers={['Component', 'Purpose', 'Variants / states']} rows={componentRegistry} /></Section>
    <Section title="Motion system"><Table label="Motion" headers={['Pattern', 'Duration', 'Easing', 'Range / intent']} rows={motionRegistry} /><RulePair subject="Theme motion" good="Let subtle movement become apparent after the scene is observed." bad="Use continuous camera movement or motion that competes with the memory." /></Section>
  </Page>
}

function Themes() {
  const playlistCount = Object.values(data.spotifyPlaylists).filter(item => item.playlistId).length
  return <Page eyebrow="02 · Registry" title="Theme specification" intro={`${data.scenes.length} registered memories and ${playlistCount} configured Spotify playlists, read directly from the production registries.`}>
    <Section title="Theme registry"><Table label="Theme registry" headers={['Name', 'ID / route', 'Year', 'Mood', 'Media', 'Ambience', 'Interactive', 'SEO', 'Status']} rows={data.scenes.map(scene => [scene.title, <><code>{scene.id}</code><small>{scene.slug}</small></>, scene.year, scene.shortLine, <>{scene.backgroundVideo ? 'Static + loop' : 'Static'}<small>Mobile asset registered</small></>, scene.ambientAudio, `${scene.hotspots.length} hotspots`, scene.seoTitle && scene.seoDescription ? <Status tone="healthy">Explicit</Status> : <Status tone="warning">Fallback</Status>, <Status tone={scene.availability === 'active' ? 'healthy' : 'neutral'}>{scene.availability === 'active' ? 'Live' : 'Planned'}</Status>])} /></Section>
    <Section title="Theme contract" intro="The existing Scene type is the production contract. Additive fields may be introduced only when existing scenes remain valid."><pre className="system-code">{`id · slug · navLabel · title · hindiTitle · year\ndescription · shortLine · desktopBackground · mobileBackground\nbackgroundVideo? · mobileVideo? · fallbackImage · ambientAudio\naccentColor · hotspots · animation · availability · primaryNav\nmobilePosition · seoTitle? · seoDescription?`}</pre></Section>
    <Section title="Theme checklists" intro="Checks are derived from each registered scene. Optional loops and ambience never fail a theme."><div className="system-details">{data.scenes.map(scene => {
      const checks = [['Route valid', scene.slug.startsWith('/')], ['Desktop asset referenced', Boolean(scene.desktopBackground)], ['Mobile handling registered', Boolean(scene.mobileBackground)], ['SEO metadata explicit', Boolean(scene.seoTitle && scene.seoDescription)], ['Reduced-motion fallback', Boolean(scene.fallbackImage)], ['Alt description source', Boolean(scene.title && scene.description)], ['Music source valid', Boolean(data.spotifyPlaylists[scene.id])], ['Interactive layer', scene.hotspots.length > 0]] as const
      return <details key={scene.id}><summary><span>{scene.title}</span><Status tone={checks.every(([, pass]) => pass) ? 'healthy' : 'warning'}>{checks.filter(([, pass]) => pass).length}/{checks.length} checks</Status></summary><ul>{checks.map(([label, pass]) => <li key={label} className={pass ? 'is-pass' : 'is-warning'}><Check size={14} />{label}</li>)}</ul></details>
    })}</div></Section>
  </Page>
}

function Content() {
  const sample = data.allPosts[0]
  return <Page eyebrow="03 · Editorial" title="Content standard" intro="Publishing rules and diagnostics reuse the same Markdown parser and validator as Blog Studio.">
    <Section title="Current CMS schema"><Table label="CMS fields" headers={['Field', 'Type', 'Requirement']} rows={Object.entries(sample).filter(([key]) => !['body', 'readingTime', 'sourcePath'].includes(key)).map(([key, value]) => [key, Array.isArray(value) ? 'string[]' : typeof value, ['title', 'slug', 'description', 'date', 'category'].includes(key) ? 'Build required' : 'Editorial / optional fallback'])} /></Section>
    <Section title="Pre-publish validation"><div className="system-status-list"><Status tone="error">Error — invalid required type, slug, date, or duplicate slug</Status><Status tone="warning">Warning — SEO length, cover alt, heading, optional relationship, or asset concern</Status><Status tone="healthy">Valid — no blocking errors</Status></div><p className="system-note">Source: <code>parseBlogMarkdown</code> and <code>validatePost</code> in <code>src/editorial/blog.ts</code>. Blog Studio and system health import this source directly.</p></Section>
    <Section title="Editorial quality"><ul className="system-checklist">{['Original angle and meaningful reader value', 'Human editorial judgment and a valid author/date', 'Clear headings, internal links, cover and descriptive alt text', 'No copied content, keyword stuffing, fake sources, fake authors, or thin mass-generated copy', 'Depth should fit the subject; there is no arbitrary Google word-count rule'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><RulePair subject="Story format" good="Publish an original emotional story with specific cultural detail." bad="Publish generic “50 things only 90s kids remember” filler." /></Section>
  </Page>
}

function Seo() {
  const publicCount = data.scenes.length + publicEditorialRoutes.length + data.publishedPosts.length + 1
  return <Page eyebrow="04 · Discovery" title="SEO standard" intro="Canonical metadata, structured data, sitemap, and robots behavior based on the current build pipeline.">
    <Section title="Metadata contract"><Table label="SEO contract" headers={['Element', 'Project rule']} rows={[[`Page title`, 'Descriptive and unique; preferred SEO title ≤60 characters'], ['Description', 'Original, useful summary; current warning threshold 160 characters'], ['Canonical', 'Built from SITE_URL / deployment origin, never a hardcoded preview host'], ['Open Graph / Twitter', 'Title, description, canonical URL and large image'], ['Indexing', 'Public content indexable; /system and /admin noindex, follow']]} /></Section>
    <Section title="Structured data registry"><Table label="Structured data" headers={['Type', 'Current location']} rows={seoStructures} /><p className="system-note">Do not add fake reviews, ratings, FAQs, or organization claims. JSON-LD is serialized through the shared SEO component and validated during build.</p></Section>
    <Section title="Sitemap and robots health"><div className="system-metrics"><div><strong>{publicCount}</strong><span>Public URLs expected</span></div><div><strong>{data.publishedPosts.length}</strong><span>Articles</span></div><div><strong>{data.scenes.length}</strong><span>Memory URLs</span></div><div><strong>0</strong><span>Drafts included</span></div></div><ul className="system-checklist"><li><Check size={15} />robots.txt generated during production build</li><li><Check size={15} />Admin, API, and system routes excluded from discovery</li><li><Check size={15} />CSS, JavaScript, images, and public articles remain crawlable</li></ul></Section>
  </Page>
}

function Ads() {
  const enabled = import.meta.env.VITE_ADSENSE_ENABLED === 'true'
  const publisher = Boolean(import.meta.env.VITE_ADSENSE_PUBLISHER_ID)
  const rows = Object.entries(data.monetizationConfig).map(([route, allowed]) => [route, allowed ? <Status tone="healthy">Yes</Status> : <Status>Protected</Status>, allowed ? 'Editorial content only' : 'Immersive or unapproved surface', allowed ? 'Clearly separated list/article slot' : 'None'])
  return <Page eyebrow="05 · Monetization" title="Ads standard" intro="A conservative route policy. This system does not and cannot guarantee AdSense approval.">
    <Section title="Configuration"><div className="system-health-line"><Status tone={enabled && publisher ? 'healthy' : 'neutral'}>{enabled && publisher ? 'Configured' : 'Not configured'}</Status><span>{publisher ? 'Publisher ID configured (value hidden)' : 'Awaiting publisher ID'}</span></div></Section>
    <Section title="Monetization route registry"><Table label="Ad routes" headers={['Route', 'Ads allowed', 'Reason', 'Placement']} rows={rows} /></Section>
    <Section title="Placement rules"><RulePair subject="Ads" good="Use a clearly separated placement on substantial journal content." bad="Cover navigation, player, hotspots, ripple areas, or resemble a scene control." /><ul className="system-checklist"><li><Check size={15} />Primary surface: journal/editorial pages</li><li><Check size={15} />Immersive full-screen experiences are protected</li><li><Check size={15} />Empty, error, loading-only, and short surfaces receive no slot</li><li><Check size={15} />Advertising requires consent and valid configuration</li></ul></Section>
  </Page>
}

function Privacy() {
  return <Page eyebrow="06 · Consent" title="Privacy standard" intro="A technical inventory of tracking, browser storage, and external providers. It is not an automated legal opinion.">
    <Section title="Technology registry"><Table label="Privacy technology" headers={['Technology', 'Purpose', 'Category', 'Provider', 'Disclosure']} rows={privacyRegistry} /></Section>
    <Section title="Consent categories"><div className="system-three"><div><strong>Necessary</strong><p>Core player, session, and preference behavior.</p></div><div><strong>Analytics</strong><p>GA measurement only after the visitor grants consent.</p></div><div><strong>Advertising</strong><p>AdSense only after consent and production configuration.</p></div></div></Section>
    <Section title="Privacy page health"><Table label="Privacy pages" headers={['Route', 'Status', 'Scope']} rows={[[`/privacy`, <Status tone="healthy">Present</Status>, 'Tracking, storage, providers'], ['/cookies', <Status tone="healthy">Present</Status>, 'Consent categories and settings'], ['/contact', <Status tone="healthy">Present</Status>, 'No form data collected'], ['/terms', <Status tone="healthy">Present</Status>, 'Use and intellectual property']]} /><p className="system-note">CMP: Not configured. The project must not describe this consent UI as a certified CMP.</p></Section>
  </Page>
}

function Copyright() {
  const mediaRows = data.scenes.flatMap(scene => [[scene.desktopBackground, 'Image', scene.title, 'Project asset', 'Needs review'], ...(scene.backgroundVideo ? [[scene.backgroundVideo, 'Loop video', scene.title, 'Project asset', 'Needs review']] : [])])
  return <Page eyebrow="07 · Media" title="Copyright standard" intro="A conservative registry: assets remain “Needs review” unless evidence establishes another status.">
    <Section title="Media registry"><Table label="Media registry" headers={['Asset', 'Type', 'Theme', 'Usage', 'License status']} rows={mediaRows} /></Section>
    <Section title="Music and artist references"><ul className="system-checklist">{['Use authorized Spotify links or embeds; never download Spotify tracks', 'Do not host unauthorized MP3 files or reproduce full lyrics', 'Do not copy album artwork without permission', 'Artist-themed experiences must not imply endorsement or partnership', 'Gulzar and Nusrat Fateh Ali Khan references are cultural context, not project partnerships'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><RulePair subject="Music" good="Link to an authorized external playlist." bad="Download and host a copyrighted recording." /></Section>
    <Section title="AI-assisted production"><blockquote>Some illustrations and production elements are created with the assistance of generative tools and are art-directed, selected, edited and integrated by Raman.</blockquote></Section>
  </Page>
}

function Accessibility() {
  return <Page eyebrow="08 · Quality" title="Accessibility standard" intro="Interaction, media, and editorial requirements for keyboard, touch, assistive technology, and reduced motion.">
    <Section title="Baseline"><Table label="Accessibility checks" headers={['Area', 'Project requirement', 'Current source']} rows={[['Keyboard', 'All actions reachable with visible focus', 'Global focus styles and semantic controls'], ['Touch', '44px minimum on compact mobile controls', 'Responsive editorial and immersive CSS'], ['Images', 'Meaningful images need contextual alt text', 'Scene and CMS metadata'], ['Structure', 'One page H1 and logical section headings', 'Editorial templates and Blog validator'], ['Audio', 'Play, pause, volume and mute remain available', 'Global player controls'], ['Modal', 'Labeled dialog; focus behavior verified before release', 'Consent and scene overlays'], ['Contrast', 'Readable cream/ink surfaces; accents not sole signal', 'Design tokens'], ['Mobile', 'Safe-area-aware controls and responsive tables', 'Global and system CSS']]} /></Section>
    <Section title="Reduced motion"><ul className="system-checklist"><li><Check size={15} />Use each scene’s fallbackImage as the static foundation</li><li><Check size={15} />Disable decorative parallax, rain, fan, ripple scale, and ambient loops where appropriate</li><li><Check size={15} />Keep navigation, information, and audio controls functional</li><li><Check size={15} />System UI removes transitions under prefers-reduced-motion</li></ul></Section>
  </Page>
}

function Performance() {
  return <Page eyebrow="09 · Media budget" title="Performance standard" intro="Budgets are calibrated from the current production asset tree, not chosen in isolation.">
    <Section title="Largest current assets"><Table label="Largest assets" headers={['Asset', 'Category', 'Size', 'Assessment']} rows={largestAssets.map(([name, type, bytes]) => [name, type, formatBytes(bytes), bytes > 2_600_000 ? <Status tone="error">Over budget</Status> : bytes > 2_000_000 ? <Status tone="warning">Near ceiling</Status> : <Status tone="healthy">Within range</Status>])} /></Section>
    <Section title="Budgets"><Table label="Performance budgets" headers={['Category', 'Threshold', 'Basis']} rows={performanceBudgets} /></Section>
    <Section title="Loading principles"><ul className="system-checklist">{['Load the current scene first and neighboring scenes later', 'Never preload every MP4 or every audio track at startup', 'Journal routes must not preload immersive media', 'Prefer AVIF/WebP, video posters, and lazy loading', 'Pause background loops when the page is hidden', 'Respect reduced motion and Save-Data where feasible'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul></Section>
  </Page>
}

function Analytics() {
  return <Page eyebrow="10 · Measurement" title="Analytics standard" intro="Approved events read from the runtime companion to the AnalyticsEventName TypeScript union.">
    <Section title="Event registry"><Table label="Analytics events" headers={['Event', 'Trigger', 'Parameters', 'Route', 'Status']} rows={data.analyticsEvents.map(item => [<code>{item.event}</code>, item.trigger, item.parameters.join(', '), item.route, <Status tone="healthy">{item.status}</Status>])} /></Section>
    <Section title="Rules"><ul className="system-checklist">{['Do not track every mouse movement or ripple', 'Use first meaningful interaction for high-frequency experiences', 'Do not double-fire page views', 'Never send unnecessary personally identifying information', 'Reuse an existing event name for the same action'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><p className="system-note">Key Events are a GA property decision. The codebase documents candidates but does not modify GA property settings.</p></Section>
  </Page>
}

function Architecture() {
  const routeRows = [...data.scenes.map(scene => [scene.slug, 'Immersive scene', 'Scene registry → AppShell']), ...publicEditorialRoutes.map(route => [route, 'Editorial', 'EditorialApp']), ...adminRoutes.map(route => [route, 'Admin', 'Lazy protected workflow']), ...systemRoutes.map(route => [route, 'System · noindex', 'SystemApp'])]
  return <Page eyebrow="11 · Engineering" title="Architecture" intro="The implemented routing, content, media, measurement, and deployment paths discovered in the repository.">
    <Section title="Route registry"><Table label="Routes" headers={['Route', 'Surface', 'Owner']} rows={routeRows} /></Section>
    <Section title="Immersive dependency flow"><div className="system-flow"><span>Scene registry</span><ChevronRight /><span>Route selection</span><ChevronRight /><span>MemoryScene</span><ChevronRight /><span>Media + interaction layers</span><ChevronRight /><span>Music / ambience</span><ChevronRight /><span>Analytics</span></div></Section>
    <Section title="Editorial and deployment"><div className="system-flow"><span>Markdown + shared validator</span><ChevronRight /><span>Vite virtual content</span><ChevronRight /><span>Journal routes + SEO</span><ChevronRight /><span>Static discovery files</span><ChevronRight /><span>Netlify / Cloudflare assets</span></div><p className="system-note">Netlify Functions and the Cloudflare Worker provide API/deployment paths. Vite produces the shared static application and pre-rendered metadata shells.</p></Section>
  </Page>
}

const releaseGroups = {
  Code: ['npm run validate', 'npm run build', 'TypeScript and imports pass'], Routes: ['Existing routes and direct refresh', '404 behavior', 'System and admin remain noindex'], Themes: ['Required assets exist', 'Mobile and reduced-motion handling'], Content: ['Shared Markdown validation', 'No draft accidentally published'], SEO: ['Canonical metadata', 'Sitemap and robots'], Privacy: ['Consent behavior unchanged'], Ads: ['No protected-route placement'], Analytics: ['No duplicate events or page views'], Performance: ['No extreme asset regression'], Accessibility: ['Keyboard, touch, focus, and audio controls'],
}

function Release() {
  return <Page eyebrow="12 · Shipping" title="Release standard" intro="A production checklist plus lightweight project validators. Build remains a separate mandatory command.">
    <Section title="Release checklist"><div className="system-release">{Object.entries(releaseGroups).map(([group, items]) => <div key={group}><h3>{group}</h3>{items.map(item => <label key={item}><input type="checkbox" />{item}</label>)}</div>)}</div></Section>
    <Section title="Automated validation"><pre className="system-code">npm run validate{`\n`}npm run build{`\n`}npm run lint</pre><p className="system-note">Errors block validation only for objectively broken configuration. Readiness items such as optional ambience, AdSense, CMP, explicit theme SEO, and copyright review remain warnings.</p></Section>
  </Page>
}

function Health() {
  const areas = ['Design', 'Themes', 'Content', 'SEO', 'Adsense', 'Privacy', 'Copyright', 'Accessibility', 'Performance', 'Analytics', 'Build']
  return <Page eyebrow="13 · Diagnostics" title="System health" intro="A read-only dashboard built from shared runtime registries and validation output. It never modifies production content.">
    <Section title="Summary"><div className="system-health-grid">{areas.map(area => { const matches = derivedHealthIssues.filter(issue => issue.area.toLowerCase() === area.toLowerCase()); return <div key={area}><span>{area}</span><Status tone={matches.some(item => item.severity === 'Error') ? 'error' : matches.length ? 'warning' : ['Adsense', 'Copyright', 'Build'].includes(area) ? 'neutral' : 'healthy'}>{matches.some(item => item.severity === 'Error') ? `${matches.length} issues` : matches.length ? `${matches.length} warnings` : ['Adsense', 'Copyright'].includes(area) ? 'Needs review' : area === 'Build' ? 'Run locally' : 'Healthy'}</Status></div> })}</div></Section>
    <Section title="Findings" intro="Each warning names the affected source and a concrete next action.">{derivedHealthIssues.length ? <Table label="Health findings" headers={['Area', 'Severity', 'Item', 'Finding', 'Location']} rows={derivedHealthIssues.map(issue => [issue.area, <Status tone={issue.severity === 'Error' ? 'error' : 'warning'}>{issue.severity}</Status>, issue.item, issue.message, <code>{issue.location}</code>])} /> : <p>No runtime registry findings.</p>}</Section>
    <Section title="Checks completed only by CLI"><p className="system-note">Asset existence, duplicate IDs/slugs, route mapping, JSON-LD serialization, robots/sitemap generation, AdSense configuration, and build output sizes run under <code>npm run validate</code> and <code>npm run build</code>. Their terminal result is the release record.</p></Section>
  </Page>
}

const pageMap: Record<string, ReactNode> = { design: <Design />, themes: <Themes />, content: <Content />, seo: <Seo />, ads: <Ads />, privacy: <Privacy />, copyright: <Copyright />, accessibility: <Accessibility />, performance: <Performance />, analytics: <Analytics />, architecture: <Architecture />, release: <Release />, health: <Health /> }

function SystemLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const filtered = useMemo(() => systemNav.map(group => ({ ...group, items: group.items.filter(([label]) => label.toLowerCase().includes(query.toLowerCase())) })).filter(group => group.items.length), [query])
  return <div className="system-shell"><a className="skip-link" href="#system-content">Skip to content</a><header className="system-mobile-header"><Link to="/system">90s Yaadein <span>System</span></Link><button type="button" onClick={() => setNavOpen(value => !value)} aria-expanded={navOpen} aria-controls="system-navigation" aria-label="Toggle system navigation">{navOpen ? <X /> : <Menu />}</button></header><aside id="system-navigation" className={navOpen ? 'is-open' : ''}><div className="system-brand"><Link to="/system"><strong>90s यादें</strong><span>System v{systemVersion}</span></Link><Link className="system-back" to="/memories"><ArrowLeft size={14} /> View experience</Link></div><label className="system-search"><Search size={15} /><span className="sr-only">Search documentation</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search sections" /></label><nav aria-label="System documentation">{filtered.map(group => <div key={group.label}><p>{group.label}</p>{group.items.map(([label, href]) => <NavLink key={href} to={href} end={href === '/system'} onClick={() => setNavOpen(false)}>{label}<ChevronRight size={13} /></NavLink>)}</div>)}</nav></aside><main id="system-content" key={location.pathname}>{location.pathname === '/system' ? <Overview /> : pageMap[location.pathname.replace('/system/', '')] ?? <Navigate to="/system" replace />}</main></div>
}

export function SystemApp() { return <Routes><Route path="*" element={<SystemLayout />} /></Routes> }
