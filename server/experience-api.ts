import { DEFAULT_EXPERIENCE_CONFIG, normalizeExperienceConfig, type ExperienceConfig } from '../src/config/experience'
import { scenes } from '../src/data/scenes'
import { adminAuthConfigured, isAdminOrigin, isAdminSession, type BlogServerEnv } from './blog-api'

export type ExperienceStore = {
  read(): Promise<unknown | null>
  write(config: ExperienceConfig): Promise<void>
}

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })

export async function handleExperienceConfig(request: Request, env: BlogServerEnv, store?: ExperienceStore) {
  if (request.method === 'GET') {
    try {
      const stored = store ? await store.read() : null
      return json({ config: normalizeExperienceConfig(stored ?? DEFAULT_EXPERIENCE_CONFIG), persistent: Boolean(store), source: stored ? 'live' : 'default' })
    } catch { return json({ config: DEFAULT_EXPERIENCE_CONFIG, persistent: false, source: 'fallback' }) }
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  if (!isAdminOrigin(request)) return json({ error: 'Origin check failed.' }, 403)
  if (!adminAuthConfigured(env)) return json({ error: 'Admin authentication is not configured.' }, 503)
  if (!(await isAdminSession(request, env.BLOG_SESSION_SECRET))) return json({ error: 'Authentication required.' }, 401)
  if (!store) return json({ error: 'Live experience storage is not configured on this deployment.' }, 503)
  try {
    const body = await request.json()
    const config = normalizeExperienceConfig(body)
    const visibleScenes = scenes.filter(scene => scene.availability === 'active' && config.scenes[scene.id]?.visible !== false)
    if (!visibleScenes.length) return json({ error: 'At least one memory must remain visible.' }, 400)
    if (!visibleScenes.some(scene => scene.id === config.featuredScene)) config.featuredScene = visibleScenes[0].id
    const saved = { ...config, updatedAt: new Date().toISOString() }
    await store.write(saved)
    return json({ ok: true, config: saved, persistent: true })
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Could not save experience settings.' }, 400) }
}
