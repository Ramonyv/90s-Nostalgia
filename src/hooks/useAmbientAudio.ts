import { useCallback, useEffect, useRef, useState } from 'react'
import type { Scene } from '../data/scenes'

export function useAmbientAudio(scene: Scene, entered: boolean) {
  const context = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)
  const source = useRef<AudioBufferSourceNode | null>(null)
  const [enabled, setEnabled] = useState(true)

  const build = useCallback(() => {
    if (!context.current) context.current = new AudioContext()
    const ctx = context.current, duration = 4, buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate), channel = buffer.getChannelData(0)
    for (let i = 0; i < channel.length; i++) channel[i] = (Math.random() * 2 - 1) * (scene.ambience === 'room' ? .12 : .2)
    const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), level = ctx.createGain()
    filter.type = 'lowpass'; filter.frequency.value = scene.ambience === 'station' ? 520 : scene.ambience === 'road' ? 300 : 180
    level.gain.value = 0; src.buffer = buffer; src.loop = true; src.connect(filter).connect(level).connect(ctx.destination); src.start()
    const oldSource = source.current, oldGain = gain.current
    if (oldSource && oldGain) {
      oldGain.gain.cancelScheduledValues(ctx.currentTime)
      oldGain.gain.linearRampToValueAtTime(0, ctx.currentTime + .8)
      window.setTimeout(() => { try { oldSource.stop() } catch { /* already stopped */ } }, 850)
    }
    source.current = src; gain.current = level
    level.gain.linearRampToValueAtTime(enabled ? .045 : 0, ctx.currentTime + 1.2)
  }, [scene.id, enabled])

  useEffect(() => { if (entered) build() }, [scene.id, entered])
  useEffect(() => { const ctx = context.current, g = gain.current; if (ctx && g) { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.linearRampToValueAtTime(enabled ? .045 : 0, ctx.currentTime + .5) } }, [enabled])
  const start = async () => { build(); await context.current?.resume() }
  return { ambienceEnabled: enabled, setAmbienceEnabled: setEnabled, startAmbient: start }
}
