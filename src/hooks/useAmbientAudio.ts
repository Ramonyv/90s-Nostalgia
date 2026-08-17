import { useCallback, useEffect, useRef, useState } from 'react'
import type { AmbientKind, Scene } from '../data/scenes'

const ambiencePresets: Record<AmbientKind, { filter: number; noise: number; gain: number; rhythm?: number }> = {
  room: { filter: 180, noise: .12, gain: .1 },
  road: { filter: 300, noise: .2, gain: .12 },
  station: { filter: 520, noise: .18, gain: .12 },
  classroom: { filter: 260, noise: .12, gain: .1 },
  lane: { filter: 430, noise: .16, gain: .11 },
  television: { filter: 700, noise: .1, gain: .1 },
  rain: { filter: 1450, noise: .28, gain: .17 },
  arcade: { filter: 980, noise: .1, gain: .1 },
  cassette: { filter: 620, noise: .09, gain: .1 },
  'bus-stand': { filter: 380, noise: .18, gain: .13 },
  village: { filter: 540, noise: .11, gain: .1 },
  'auto-rickshaw': { filter: 360, noise: .2, gain: .16, rhythm: 8 },
  'permit-room': { filter: 1180, noise: .2, gain: .14, rhythm: .72 },
  baraat: { filter: 720, noise: .16, gain: .105, rhythm: 2.15 },
  night: { filter: 240, noise: .065, gain: .055, rhythm: .38 },
}

export function useAmbientAudio(scene: Scene, entered: boolean) {
  const context = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)
  const source = useRef<AudioBufferSourceNode | null>(null)
  const [enabled, setEnabled] = useState(true)
  const enabledRef = useRef(enabled)
  useEffect(() => { enabledRef.current = enabled }, [enabled])

  const build = useCallback(() => {
    if (!context.current) context.current = new AudioContext()
    const preset = ambiencePresets[scene.ambientAudio]
    const ctx = context.current, duration = 4, buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate), channel = buffer.getChannelData(0)
    for (let i = 0; i < channel.length; i++) {
      const enginePulse = preset.rhythm ? .68 + Math.sin(i / ctx.sampleRate * Math.PI * 2 * preset.rhythm) * .32 : 1
      channel[i] = (Math.random() * 2 - 1) * preset.noise * enginePulse
    }
    const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), level = ctx.createGain()
    filter.type = 'lowpass'; filter.frequency.value = preset.filter
    level.gain.value = 0; src.buffer = buffer; src.loop = true; src.connect(filter).connect(level).connect(ctx.destination); src.start()
    const oldSource = source.current, oldGain = gain.current
    if (oldSource && oldGain) {
      oldGain.gain.cancelScheduledValues(ctx.currentTime)
      oldGain.gain.linearRampToValueAtTime(0, ctx.currentTime + .8)
      window.setTimeout(() => { try { oldSource.stop() } catch { /* already stopped */ } }, 850)
    }
    source.current = src; gain.current = level
    level.gain.linearRampToValueAtTime(enabledRef.current ? preset.gain : 0, ctx.currentTime + 1.2)
  }, [scene.ambientAudio])

  useEffect(() => { if (entered) build() }, [build, entered])
  useEffect(() => { const ctx = context.current, g = gain.current; if (ctx && g) { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.linearRampToValueAtTime(enabled ? ambiencePresets[scene.ambientAudio].gain : 0, ctx.currentTime + .5) } }, [enabled, scene.ambientAudio])
  const start = async () => { build(); await context.current?.resume() }
  return { ambienceEnabled: enabled, setAmbienceEnabled: setEnabled, startAmbient: start }
}
