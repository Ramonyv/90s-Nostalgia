import { parse as parseYaml } from 'yaml'

export type BlogServerEnv = {
  BLOG_ADMIN_PASSWORD_HASH?: string
  BLOG_SESSION_SECRET?: string
  GITHUB_TOKEN?: string
  GITHUB_OWNER?: string
  GITHUB_REPO?: string
  GITHUB_BRANCH?: string
}

const SESSION_COOKIE = 'yaadein_blog_session'
const encoder = new TextEncoder()
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

const json = (body: Record<string, unknown>, status = 200, headers: HeadersInit = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } })
const base64Url = (bytes: Uint8Array) => {
  let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const bytesFromBase64 = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/'); const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded); return Uint8Array.from(binary, char => char.charCodeAt(0))
}
const encodeUtf8Base64 = (value: string) => {
  const bytes = encoder.encode(value); let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary)
}
const timingSafeEqual = (left: Uint8Array, right: Uint8Array) => {
  if (left.length !== right.length) return false
  let difference = 0; for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index]
  return difference === 0
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)))
}

async function createSession(secret: string) {
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 8
  return `${expires}.${base64Url(await hmac(secret, String(expires)))}`
}

async function validSession(request: Request, secret?: string) {
  try {
    if (!secret) return false
    const cookie = request.headers.get('cookie')?.split(';').map(item => item.trim()).find(item => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1)
    if (!cookie) return false
    const [expiresText, signature] = cookie.split('.')
    const expires = Number(expiresText)
    if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000) || !signature) return false
    return timingSafeEqual(await hmac(secret, expiresText), bytesFromBase64(signature))
  } catch { return false }
}

async function validPassword(password: string, storedHash?: string) {
  if (!storedHash) return false
  const [algorithm, iterationsText, salt, expected] = storedHash.split('$')
  const iterations = Number(iterationsText)
  if (algorithm !== 'pbkdf2' || !Number.isInteger(iterations) || iterations < 210_000 || !salt || !expected) return false
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: bytesFromBase64(salt), iterations }, key, bytesFromBase64(expected).length * 8))
  return timingSafeEqual(actual, bytesFromBase64(expected))
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}

export const isAdminSession = validSession
export const isAdminOrigin = sameOrigin
export const adminAuthConfigured = (env: BlogServerEnv) => Boolean(env.BLOG_ADMIN_PASSWORD_HASH && env.BLOG_SESSION_SECRET)

async function readJson(request: Request, maxLength = 6_000_000) {
  const length = Number(request.headers.get('content-length') || 0)
  if (length > maxLength) throw new Error('Request is too large.')
  const text = await request.text()
  if (text.length > maxLength) throw new Error('Request is too large.')
  return JSON.parse(text) as Record<string, unknown>
}

const configured = (env: BlogServerEnv) => Boolean(env.BLOG_ADMIN_PASSWORD_HASH && env.BLOG_SESSION_SECRET && env.GITHUB_TOKEN && env.GITHUB_OWNER && env.GITHUB_REPO)
const clientKey = (request: Request) => request.headers.get('cf-connecting-ip') || request.headers.get('x-nf-client-connection-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'

function loginRateLimited(request: Request) {
  const key = clientKey(request), now = Date.now(), attempt = loginAttempts.get(key)
  if (!attempt || attempt.resetAt <= now) { loginAttempts.delete(key); return false }
  return attempt.count >= 5
}

function recordLoginFailure(request: Request) {
  const key = clientKey(request), now = Date.now(), current = loginAttempts.get(key)
  loginAttempts.set(key, !current || current.resetAt <= now ? { count: 1, resetAt: now + 15 * 60_000 } : { ...current, count: current.count + 1 })
  if (loginAttempts.size > 1_000) for (const [storedKey, attempt] of loginAttempts) if (attempt.resetAt <= now) loginAttempts.delete(storedKey)
}

export async function handleBlogAuth(request: Request, env: BlogServerEnv) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' })
  if (!sameOrigin(request)) return json({ error: 'Origin check failed.' }, 403)
  if (!configured(env)) return json({ configured: false, error: 'Blog publishing is not configured on this deployment.' }, 503)
  try {
    const body = await readJson(request, 20_000)
    const action = String(body.action || 'status')
    if (action === 'status') { const authenticated = await validSession(request, env.BLOG_SESSION_SECRET); return json({ configured: true, authenticated }, authenticated ? 200 : 401) }
    if (action === 'logout') {
      return json({ configured: true, authenticated: false }, 200, { 'set-cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=0${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}` })
    }
    if (action !== 'login' || typeof body.password !== 'string') return json({ error: 'Invalid authentication request.' }, 400)
    if (loginRateLimited(request)) return json({ configured: true, authenticated: false, error: 'Too many login attempts. Try again later.' }, 429, { 'retry-after': '900' })
    if (!(await validPassword(body.password, env.BLOG_ADMIN_PASSWORD_HASH))) {
      recordLoginFailure(request)
      await new Promise(resolve => setTimeout(resolve, 350))
      return json({ configured: true, authenticated: false, error: 'Incorrect password.' }, 401)
    }
    loginAttempts.delete(clientKey(request))
    const session = await createSession(env.BLOG_SESSION_SECRET!)
    return json({ configured: true, authenticated: true }, 200, { 'set-cookie': `${SESSION_COOKIE}=${session}; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=28800${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}` })
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Authentication failed.' }, 400) }
}

type ValidatedArticle = { slug: string; title: string; coverPath: string }

function validateMarkdown(markdown: string): ValidatedArticle {
  if (markdown.length > 1_000_000) throw new Error('Markdown file is too large.')
  const match = markdown.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) throw new Error('Markdown frontmatter is missing or malformed.')
  const data = (parseYaml(match[1]) || {}) as Record<string, unknown>
  const title = typeof data.title === 'string' ? data.title.trim() : '', slug = typeof data.slug === 'string' ? data.slug.trim() : ''
  const description = typeof data.description === 'string' ? data.description.trim() : '', category = typeof data.category === 'string' ? data.category.trim() : '', date = typeof data.date === 'string' ? data.date : ''
  if (!title || !description || !category || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) throw new Error('Required article metadata is invalid.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Article slug is invalid.')
  if (data.draft !== false) throw new Error('Uncheck Draft before publishing.')
  const coverPath = typeof data.cover === 'string' ? data.cover : ''
  if (coverPath !== `/blog/${slug}/cover.webp`) throw new Error(`Cover path must be /blog/${slug}/cover.webp.`)
  if (!match[2].trim()) throw new Error('Article body is empty.')
  return { slug, title, coverPath }
}

async function githubRequest(env: BlogServerEnv, path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(env.GITHUB_OWNER!)}/${encodeURIComponent(env.GITHUB_REPO!)}${path}`, { ...init, headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${env.GITHUB_TOKEN}`, 'x-github-api-version': '2022-11-28', 'content-type': 'application/json', ...(init.headers || {}) } })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({})) as { message?: string }
    throw new Error(`GitHub API ${response.status}: ${detail.message || response.statusText}`)
  }
  return response
}

async function githubFileExists(env: BlogServerEnv, path: string, branch: string) {
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(env.GITHUB_OWNER!)}/${encodeURIComponent(env.GITHUB_REPO!)}/contents/${path}?ref=${encodeURIComponent(branch)}`, { headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${env.GITHUB_TOKEN}`, 'x-github-api-version': '2022-11-28' } })
  if (response.status === 404) return false
  if (!response.ok) throw new Error(`GitHub API ${response.status}: could not check existing article.`)
  return true
}

export async function handleBlogPublish(request: Request, env: BlogServerEnv) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' })
  if (!sameOrigin(request)) return json({ error: 'Origin check failed.' }, 403)
  if (!configured(env)) return json({ error: 'Blog publishing is not configured.' }, 503)
  if (!(await validSession(request, env.BLOG_SESSION_SECRET))) return json({ error: 'Authentication required.' }, 401)
  try {
    const body = await readJson(request)
    if (typeof body.markdown !== 'string') throw new Error('Markdown content is required.')
    const article = validateMarkdown(body.markdown), branch = env.GITHUB_BRANCH || 'main'
    const articlePath = `content/blog/${article.slug}.md`, coverPath = `public/blog/${article.slug}/cover.webp`
    const articleExists = await githubFileExists(env, articlePath, branch)
    if (articleExists && body.overwrite !== true) return json({ error: 'An article with this slug already exists.', code: 'ARTICLE_EXISTS' }, 409)
    const coverBase64 = typeof body.coverBase64 === 'string' ? body.coverBase64 : ''
    if (coverBase64) {
      if (coverBase64.length > 5_000_000) throw new Error('Converted cover is too large to publish.')
      const header = atob(coverBase64.slice(0, 24))
      if (!header.startsWith('RIFF') || !header.includes('WEBP')) throw new Error('Cover must be a converted WebP image.')
    } else if (!(await githubFileExists(env, coverPath, branch))) throw new Error('Upload a cover image before publishing.')

    const ref = await (await githubRequest(env, `/git/ref/heads/${encodeURIComponent(branch)}`)).json() as { object: { sha: string } }
    const parent = await (await githubRequest(env, `/git/commits/${ref.object.sha}`)).json() as { tree: { sha: string } }
    const markdownBlob = await (await githubRequest(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: encodeUtf8Base64(body.markdown), encoding: 'base64' }) })).json() as { sha: string }
    const treeEntries: Array<Record<string, string>> = [{ path: articlePath, mode: '100644', type: 'blob', sha: markdownBlob.sha }]
    if (coverBase64) {
      const coverBlob = await (await githubRequest(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: coverBase64, encoding: 'base64' }) })).json() as { sha: string }
      treeEntries.push({ path: coverPath, mode: '100644', type: 'blob', sha: coverBlob.sha })
    }
    const tree = await (await githubRequest(env, '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: parent.tree.sha, tree: treeEntries }) })).json() as { sha: string }
    const commit = await (await githubRequest(env, '/git/commits', { method: 'POST', body: JSON.stringify({ message: `${articleExists ? 'Update' : 'Publish'} journal: ${article.title}`, tree: tree.sha, parents: [ref.object.sha] }) })).json() as { sha: string; html_url?: string }
    await githubRequest(env, `/git/refs/heads/${encodeURIComponent(branch)}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) })
    return json({ ok: true, slug: article.slug, commit: commit.sha, commitUrl: commit.html_url || `https://github.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/commit/${commit.sha}` })
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Publishing failed.' }, 400) }
}
