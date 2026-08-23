import { handleBlogAuth, handleBlogPublish, type BlogServerEnv } from '../server/blog-api'
import { handleExperienceConfig, type ExperienceStore } from '../server/experience-api'
import type { ExperienceConfig } from '../src/config/experience'
import { handleVisitorPresence, type PresenceStore } from '../server/presence-api'

type ExperienceKv = { get(key: string, type?: 'json'): Promise<unknown | null>; put(key: string, value: string): Promise<void> }
type PresenceKv = {
  list(options: { prefix: string }): Promise<{ keys: Array<{ name: string }> }>
  put(key: string, value: string, options: { expirationTtl: number }): Promise<void>
}
type WorkerEnv = BlogServerEnv & { ASSETS: { fetch(request: Request): Promise<Response> }; EXPERIENCE_CONFIG?: ExperienceKv; VISITOR_PRESENCE?: PresenceKv }

const workerExperienceStore = (kv?: ExperienceKv): ExperienceStore | undefined => kv ? {
  read: () => kv.get('live-config', 'json'),
  write: (config: ExperienceConfig) => kv.put('live-config', JSON.stringify(config)),
} : undefined

const workerPresenceStore = (kv?: PresenceKv): PresenceStore | undefined => kv ? {
  touch: async (sessionId, ttlSeconds) => {
    await kv.put(`active:${sessionId}`, String(Date.now()), { expirationTtl: ttlSeconds })
    const active = await kv.list({ prefix: 'active:' })
    return active.keys.length
  },
} : undefined

export default {
  async fetch(request: Request, env: WorkerEnv) {
    const path = new URL(request.url).pathname
    if (path === '/api/blog-auth') return handleBlogAuth(request, env)
    if (path === '/api/blog-publish') return handleBlogPublish(request, env)
    if (path === '/api/experience-config') return handleExperienceConfig(request, env, workerExperienceStore(env.EXPERIENCE_CONFIG))
    if (path === '/api/visitor-presence') return handleVisitorPresence(request, workerPresenceStore(env.VISITOR_PRESENCE))
    if (path.startsWith('/api/')) return new Response(JSON.stringify({ error: 'API endpoint not found.' }), { status: 404, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
    return env.ASSETS.fetch(request)
  },
}
