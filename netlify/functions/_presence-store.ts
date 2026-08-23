import { getStore } from '@netlify/blobs'
import type { PresenceStore } from '../../server/presence-api'

const STORE_NAME = 'yaadein-visitor-presence'
const KEY_PREFIX = 'active/'

export function netlifyPresenceStore(): PresenceStore {
  const store = getStore({ name: STORE_NAME, consistency: 'strong' })
  return {
    touch: async (sessionId, ttlSeconds) => {
      const now = Date.now()
      const expiresAt = now + ttlSeconds * 1000
      await store.set(`${KEY_PREFIX}${expiresAt}/${sessionId}`, String(now))

      const { blobs } = await store.list({ prefix: KEY_PREFIX })
      const activeSessions = new Set<string>()
      const cleanup: Promise<void>[] = []

      for (const blob of blobs) {
        const match = blob.key.match(/^active\/(\d+)\/([a-zA-Z0-9_-]+)$/)
        if (!match || Number(match[1]) <= now) {
          cleanup.push(store.delete(blob.key))
          continue
        }
        activeSessions.add(match[2])
      }

      await Promise.all(cleanup)
      return activeSessions.size
    },
  }
}
