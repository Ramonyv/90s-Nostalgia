import { ArrowRight, CalendarDays, Check, Clock3, Copy, Search } from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { absoluteUrl, SITE_NAME } from '../config/site'
import { sceneAvif, scenes } from '../data/scenes'
import { getPublishedPost, publishedPosts } from './blog'
import { SEO } from './SEO'
import { AdSlot } from './ads'
import { NotFoundPage } from './StaticPages'

const formatDate = (date: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(new Date(`${date}T00:00:00`))
const MarkdownContent = lazy(() => import('./MarkdownContent').then(module => ({ default: module.MarkdownContent })))

function StoryRow({ post, featured = false }: { post: typeof publishedPosts[number]; featured?: boolean }) {
  return <article className={featured ? 'story-row story-row--featured' : 'story-row'}>
    {post.cover && <Link to={`/journal/${post.slug}`} className="story-cover"><img src={post.cover} alt={post.coverAlt} width="960" height="640" loading={featured ? 'eager' : 'lazy'} /></Link>}
    <div><p className="story-meta"><span>{post.category}</span><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingTime} min read</span></p><h2><Link to={`/journal/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><p className="story-author">By {post.author}</p><Link className="text-link" to={`/journal/${post.slug}`}>Read story <ArrowRight size={15} /></Link></div>
  </article>
}

export function JournalIndex() {
  const [query, setQuery] = useState('')
  const featured = publishedPosts.find(post => post.featured) || publishedPosts[0]
  const filtered = useMemo(() => publishedPosts.filter(post => `${post.title} ${post.description} ${post.category} ${post.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query])
  const categories = [...new Set(publishedPosts.map(post => post.category))]
  return <>
    <SEO title="Journal" description="Stories about the places, sounds, objects and everyday moments of 1990s India." canonicalPath="/journal" jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: '90s Yaadein Journal', description: 'Stories behind the memories.', url: absoluteUrl('/journal') }} />
    <section className="journal-hero"><div className="journal-hero__print" aria-hidden="true">JOURNAL</div><p className="eyebrow">The archive, in words</p><h1><span>Stories behind</span><span>the memories.</span></h1><p>Places, sounds, objects and everyday moments from the India we grew up in.</p><a href="#stories" className="button-primary">Browse the journal <ArrowRight size={16} /></a></section>
    <div className="editorial-container" id="stories">
      {featured ? <section className="journal-section"><p className="section-kicker">Featured story</p><StoryRow post={featured} featured /></section> : <section className="journal-empty"><p className="section-kicker">The journal is being prepared</p><h2>Good memories deserve careful telling.</h2><p>No public articles have been published yet. The archive is ready for original essays; drafts remain private until Raman marks them for publication.</p><Link className="text-link" to="/memories">Explore the memories <ArrowRight size={15} /></Link></section>}
      {publishedPosts.length > 0 && <>
        <section className="journal-tools"><label><Search size={18} /><span className="sr-only">Search journal</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, categories and tags" /></label><div>{categories.map(category => <button key={category} onClick={() => setQuery(category)}>{category}</button>)}</div></section>
        <section className="journal-section"><p className="section-kicker">Latest stories</p>{filtered.map(post => <StoryRow post={post} key={post.slug} />)}{!filtered.length && <p>No stories match “{query}”.</p>}</section>
        <AdSlot placement="list" />
      </>}
      <section className="memory-bridge"><p className="section-kicker">Memory essays begin here</p><h2>Step inside the scenes.</h2><p>The immersive archive remains the heart of 90s Yaadein.</p><div>{scenes.slice(0, 4).map(scene => <Link key={scene.id} to={scene.slug}><picture><source srcSet={sceneAvif(scene.mobileBackground)} type="image/avif" /><img src={scene.mobileBackground} alt="" width="320" height="220" loading="lazy" /></picture><span>{scene.title}<small>{scene.year}</small></span></Link>)}</div></section>
    </div>
  </>
}

export function ArticlePage() {
  const { slug } = useParams()
  const post = getPublishedPost(slug)
  const [copied, setCopied] = useState(false)
  if (!post) return <NotFoundPage />
  const canonical = post.canonical || absoluteUrl(`/journal/${post.slug}`)
  const related = publishedPosts.filter(item => item.slug !== post.slug && (item.category === post.category || item.tags.some(tag => post.tags.includes(tag)))).slice(0, 3)
  const memory = scenes.find(scene => scene.slug === post.relatedMemory)
  const share = (network: string) => {
    const encodedUrl = encodeURIComponent(canonical), encodedTitle = encodeURIComponent(post.title)
    const urls: Record<string, string> = { x: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` }
    window.open(urls[network], '_blank', 'noopener,noreferrer')
  }
  const jsonLd = [{ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, image: post.cover ? absoluteUrl(post.cover) : undefined, datePublished: post.date, dateModified: post.updated, author: { '@type': 'Person', name: 'Raman' }, publisher: { '@type': 'Organization', name: SITE_NAME }, mainEntityOfPage: canonical }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') }, { '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteUrl('/journal') }, { '@type': 'ListItem', position: 3, name: post.category }, { '@type': 'ListItem', position: 4, name: post.title, item: canonical }] }]
  return <>
    <SEO title={post.seoTitle || post.title} description={post.seoDescription || post.description} canonicalPath={`/journal/${post.slug}`} image={post.cover || '/social-preview.jpg'} type="article" jsonLd={jsonLd} />
    <article className="article-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/journal">Journal</Link><span>/</span><span>{post.category}</span></nav>
      <header className="article-header"><p className="section-kicker">{post.category}</p><h1>{post.title}</h1><p className="article-deck">{post.description}</p><div className="article-byline"><img src="/creator-raman.webp" alt="Raman" width="48" height="48" /><span><strong>{post.author}</strong><small>Creator of 90s Yaadein</small></span><span><CalendarDays size={15} /> <time dateTime={post.date}>{formatDate(post.date)}</time></span>{post.updated !== post.date && <span>Updated {formatDate(post.updated)}</span>}<span><Clock3 size={15} /> {post.readingTime} min read</span></div></header>
      {post.cover && <figure className="article-cover"><img src={post.cover} alt={post.coverAlt} width="1440" height="900" fetchPriority="high" /></figure>}
      <Suspense fallback={<div className="article-body">Preparing article…</div>}><MarkdownContent body={post.body} /></Suspense>
      <AdSlot placement="article" />
      {memory && <aside className="related-memory"><picture><source srcSet={sceneAvif(memory.mobileBackground)} type="image/avif" /><img src={memory.mobileBackground} alt={`${memory.title}, an illustrated memory from ${memory.year}`} width="640" height="420" loading="lazy" /></picture><div><p className="section-kicker">Enter the memory</p><h2>{memory.title}</h2><p>{memory.description}</p><Link to={memory.slug}>Experience the scene <ArrowRight size={16} /></Link></div></aside>}
      <section className="share-row"><strong>Share this story</strong><button onClick={() => void navigator.clipboard.writeText(canonical).then(() => setCopied(true))}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy link'}</button><button onClick={() => share('x')}>X</button><button onClick={() => share('facebook')}>Facebook</button><button onClick={() => share('whatsapp')}>WhatsApp</button></section>
      <aside className="author-box"><img src="/creator-raman.webp" alt="Raman" width="96" height="96" loading="lazy" /><div><p className="section-kicker">About the author</p><h2>Raman</h2><p>Raman is a multidisciplinary designer exploring how interaction, illustration, sound and technology can turn everyday memories into digital experiences.</p></div></aside>
      {related.length > 0 && <section className="related-articles"><p className="section-kicker">Related articles</p>{related.map(item => <StoryRow key={item.slug} post={item} />)}</section>}
    </article>
  </>
}
