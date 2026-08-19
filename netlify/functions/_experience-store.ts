import { getStore } from '@netlify/blobs'
import type { ExperienceStore } from '../../server/experience-api'
import type { ExperienceConfig } from '../../src/config/experience'

const STORE_NAME = 'yaadein-experience-control'
const CONFIG_KEY = 'live-config'

export function netlifyExperienceStore(): ExperienceStore {
  const store = getStore({ name: STORE_NAME, consistency: 'strong' })
  return {
    read: () => store.get(CONFIG_KEY, { type: 'json' }),
    write: async (config: ExperienceConfig) => { await store.setJSON(CONFIG_KEY, config) },
  }
}
