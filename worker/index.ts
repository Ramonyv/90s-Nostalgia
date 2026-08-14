import { handleBlogAuth, handleBlogPublish, type BlogServerEnv } from '../server/blog-api'

type WorkerEnv = BlogServerEnv & { ASSETS: { fetch(request: Request): Promise<Response> } }

export default {
  async fetch(request: Request, env: WorkerEnv) {
    const path = new URL(request.url).pathname
    if (path === '/api/blog-auth') return handleBlogAuth(request, env)
    if (path === '/api/blog-publish') return handleBlogPublish(request, env)
    if (path.startsWith('/api/')) return new Response(JSON.stringify({ error: 'API endpoint not found.' }), { status: 404, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
    return env.ASSETS.fetch(request)
  },
}
