import { scenes, type SceneId } from '../data/scenes'

export type PlaybackMode = 'static' | 'loop'
export type ScenePlaybackMode = 'inherit' | PlaybackMode
export type SceneExperience = { visible: boolean; playback: ScenePlaybackMode }

export type ExperienceConfig = {
  version: 1
  featuredScene: SceneId
  defaultPlayback: PlaybackMode
  allowVisitorOverride: boolean
  scenes: Partial<Record<SceneId, SceneExperience>>
  updatedAt?: string
}

const sceneIds = new Set(scenes.map(scene => scene.id))
export const DEFAULT_EXPERIENCE_CONFIG: ExperienceConfig = {
  version: 1,
  featuredScene: 'salon',
  defaultPlayback: 'static',
  allowVisitorOverride: true,
  scenes: {},
}

export function normalizeExperienceConfig(value: unknown): ExperienceConfig {
  if (!value || typeof value !== 'object') return DEFAULT_EXPERIENCE_CONFIG
  const input = value as Record<string, unknown>
  const featuredScene = typeof input.featuredScene === 'string' && sceneIds.has(input.featuredScene as SceneId) ? input.featuredScene as SceneId : DEFAULT_EXPERIENCE_CONFIG.featuredScene
  const defaultPlayback: PlaybackMode = input.defaultPlayback === 'loop' ? 'loop' : 'static'
  const sceneSettings: ExperienceConfig['scenes'] = {}
  if (input.scenes && typeof input.scenes === 'object') {
    for (const [id, setting] of Object.entries(input.scenes as Record<string, unknown>)) {
      if (!sceneIds.has(id as SceneId) || !setting || typeof setting !== 'object') continue
      const candidate = setting as Record<string, unknown>
      const playback: ScenePlaybackMode = candidate.playback === 'loop' || candidate.playback === 'static' ? candidate.playback : 'inherit'
      sceneSettings[id as SceneId] = { visible: candidate.visible !== false, playback }
    }
  }
  const updatedAt = typeof input.updatedAt === 'string' ? input.updatedAt : undefined
  return { version: 1, featuredScene, defaultPlayback, allowVisitorOverride: input.allowVisitorOverride !== false, scenes: sceneSettings, ...(updatedAt ? { updatedAt } : {}) }
}

export const sceneIsVisible = (config: ExperienceConfig, sceneId: SceneId) => config.scenes[sceneId]?.visible !== false
export const scenePlayback = (config: ExperienceConfig, sceneId: SceneId): PlaybackMode => {
  const mode = config.scenes[sceneId]?.playback
  return mode === 'loop' || mode === 'static' ? mode : config.defaultPlayback
}
