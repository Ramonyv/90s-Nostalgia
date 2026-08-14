import type { BlogServerEnv } from '../../server/blog-api'

type NetlifyEvent = { rawUrl: string; httpMethod: string; headers: Record<string, string | undefined>; body?: string | null; isBase64Encoded?: boolean }

export function serverEnv(): BlogServerEnv {
  return {
    BLOG_ADMIN_PASSWORD_HASH: process.env.BLOG_ADMIN_PASSWORD_HASH,
    BLOG_SESSION_SECRET: process.env.BLOG_SESSION_SECRET,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_BRANCH: process.env.GITHUB_BRANCH,
  }
}

export function requestFromEvent(event: NetlifyEvent) {
  const body = event.body ? (event.isBase64Encoded ? Uint8Array.from(Buffer.from(event.body, 'base64')) : event.body) : undefined
  return new Request(event.rawUrl, { method: event.httpMethod, headers: event.headers as HeadersInit, body: event.httpMethod === 'GET' || event.httpMethod === 'HEAD' ? undefined : body })
}

export async function responseForNetlify(response: Response) {
  return { statusCode: response.status, headers: Object.fromEntries(response.headers.entries()), body: await response.text() }
}
