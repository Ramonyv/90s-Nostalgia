const SESSION_TTL_SECONDS = 90

export type PresenceStore = {
  touch(sessionId: string, ttlSeconds: number): Promise<number>
}

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
})

export async function handleVisitorPresence(request: Request, store?: PresenceStore) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  try {
    const body = await request.json() as { sessionId?: unknown }
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
    if (!/^[a-zA-Z0-9_-]{16,80}$/.test(sessionId)) return json({ error: 'Invalid session.' }, 400)
    if (!store) return json({ available: false, count: 1, points: 100 })

    const count = Math.max(1, await store.touch(sessionId, SESSION_TTL_SECONDS))
    return json({ available: true, count, points: count * 100 })
  } catch {
    return json({ available: false, count: 1, points: 100 })
  }
}
