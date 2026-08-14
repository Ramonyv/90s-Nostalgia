import { parse as parseYaml } from 'yaml'
import rawArticles from 'virtual:published-blog'

export type BlogFrontmatter = {
  title: string
  slug: string
  description: string
  excerpt: string
  date: string
  updated: string
  author: string
  category: string
  tags: string[]
  cover: string
  coverAlt: string
  featured: boolean
  draft: boolean
  relatedMemory: string
  seoTitle: string
  seoDescription: string
  canonical: string
}

export type BlogPost = BlogFrontmatter & {
  body: string
  readingTime: number
  sourcePath: string
}

export type ValidationResult = { errors: string[]; warnings: string[] }

const stringValue = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const boolValue = (value: unknown, fallback = false) => typeof value === 'boolean' ? value : fallback
const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')

export function splitMarkdown(source: string) {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {} as Record<string, unknown>, body: normalized, frontmatterError: 'Missing or malformed YAML frontmatter.' }
  try {
    return { data: (parseYaml(match[1]) || {}) as Record<string, unknown>, body: match[2].trim(), frontmatterError: '' }
  } catch (error) {
    return { data: {} as Record<string, unknown>, body: match[2].trim(), frontmatterError: error instanceof Error ? error.message : 'Invalid YAML frontmatter.' }
  }
}

function firstParagraph(body: string) {
  return body.split(/\n\s*\n/).map(value => value.replace(/^#+\s+/, '').replace(/[*_`>#]/g, '').trim()).find(value => value.length > 40) || ''
}

export function parseBlogMarkdown(source: string, sourcePath = 'imported.md'): BlogPost {
  const { data, body } = splitMarkdown(source)
  const title = stringValue(data.title)
  const date = stringValue(data.date)
  const description = stringValue(data.description)
  const excerpt = stringValue(data.excerpt) || firstParagraph(body).slice(0, 220)
  const words = body.match(/[\p{L}\p{N}]+/gu)?.length || 0
  return {
    title,
    slug: stringValue(data.slug) || slugify(title),
    description,
    excerpt,
    date,
    updated: stringValue(data.updated) || date,
    author: stringValue(data.author) || 'Raman',
    category: stringValue(data.category),
    tags: Array.isArray(data.tags) ? data.tags.map(stringValue).filter(Boolean) : [],
    cover: stringValue(data.cover),
    coverAlt: stringValue(data.coverAlt),
    featured: boolValue(data.featured),
    draft: boolValue(data.draft, true),
    relatedMemory: stringValue(data.relatedMemory),
    seoTitle: stringValue(data.seoTitle) || title,
    seoDescription: stringValue(data.seoDescription) || description,
    canonical: stringValue(data.canonical),
    body,
    readingTime: Math.max(1, Math.ceil(words / 220)),
    sourcePath,
  }
}

export function validatePost(post: BlogPost, knownSlugs: string[] = []): ValidationResult {
  const errors: string[] = [], warnings: string[] = []
  if (!post.title) errors.push('Title is required.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) errors.push('Slug must use lowercase letters, numbers, and hyphens.')
  if (!post.description) errors.push('Description is required.')
  if (!post.category) errors.push('Category is required.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(Date.parse(post.date))) errors.push('Publish date must be a valid YYYY-MM-DD date.')
  if (knownSlugs.filter(slug => slug === post.slug).length > 1) errors.push('Duplicate slug detected.')
  if (!post.cover) warnings.push('Cover image is missing.')
  if (post.cover && !post.coverAlt) warnings.push('Cover alt text is missing.')
  if (!/^#{2,3}\s+.+/m.test(post.body)) warnings.push('Article should contain section headings.')
  if (/^#\s+.+/m.test(post.body)) warnings.push('Remove the body H1; the article title already provides it.')
  if (post.seoTitle.length > 60) warnings.push('SEO title is longer than 60 characters.')
  if (post.seoDescription.length > 160) warnings.push('SEO description is longer than 160 characters.')
  const invalidLink = [...post.body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].some(match => !/^(https?:\/\/|\/|#|mailto:)/.test(match[1]))
  if (invalidLink) warnings.push('One or more links use an unsupported URL format.')
  const images = [...post.body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]
  if (images.some(match => !match[1].trim())) warnings.push('One or more inline images are missing alt text.')
  if (images.some(match => !/^(https?:\/\/|\/)/.test(match[2]))) warnings.push('One or more inline image references may be broken.')
  return { errors, warnings }
}

const allParsed = Object.entries(rawArticles).map(([path, source]) => parseBlogMarkdown(source, path))
const duplicateSlugs = allParsed.map(post => post.slug)
for (const post of allParsed) {
  const result = validatePost(post, duplicateSlugs)
  if (result.errors.length) throw new Error(`Invalid blog post ${post.sourcePath}: ${result.errors.join(' ')}`)
}

export const allPosts = allParsed.sort((a, b) => b.date.localeCompare(a.date))
export const publishedPosts = allPosts.filter(post => !post.draft && post.date <= new Date().toISOString().slice(0, 10))
export const getPublishedPost = (slug?: string) => publishedPosts.find(post => post.slug === slug)

export function serializePost(post: BlogPost) {
  const metadata: Record<string, unknown> = {
    title: post.title, slug: post.slug, description: post.description, excerpt: post.excerpt,
    date: post.date, updated: post.updated, author: post.author, category: post.category,
    tags: post.tags, cover: post.cover, coverAlt: post.coverAlt, featured: post.featured,
    draft: post.draft, relatedMemory: post.relatedMemory, seoTitle: post.seoTitle,
    seoDescription: post.seoDescription, canonical: post.canonical,
  }
  return `---\n${Object.entries(metadata).map(([key, value]) => `${key}: ${Array.isArray(value) ? `\n${value.map(item => `  - ${JSON.stringify(item)}`).join('\n')}` : JSON.stringify(value)}`).join('\n')}\n---\n\n${post.body.trim()}\n`
}
