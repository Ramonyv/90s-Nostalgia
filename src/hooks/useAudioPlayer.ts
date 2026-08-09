import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { tracks } from '../data/tracks'

function makeWav(root: number, seed: number) {
  const rate = 8000, seconds = 24, count = rate * seconds
  const data = new Int16Array(count)
  const notes = [1, 1.25, 1.5, 2]
  for (let i = 0; i < count; i++) {
    const t = i / rate
    const step = Math.floor(t / 3) % notes.length
    const f = root * notes[(step + seed) % notes.length]
    const fade = Math.min(1, (t % 3) * 1.4, (3 - (t % 3)) * 0.8)
    const wobble = 1 + Math.sin(t * .55) * .003
    const sample = (Math.sin(2 * Math.PI * f * wobble * t) * .42 + Math.sin(2 * Math.PI * f * .5 * t) * .25 + Math.sin(2 * Math.PI * f * 1.5 * t) * .08) * fade
    data[i] = Math.max(-32767, Math.min(32767, sample * 8500))
  }
  const buffer = new ArrayBuffer(44 + data.byteLength), view = new DataView(buffer)
  const write = (o: number, s: string) => [...s].forEach((c, j) => view.setUint8(o + j, c.charCodeAt(0)))
  write(0, 'RIFF'); view.setUint32(4, 36 + data.byteLength, true); write(8, 'WAVE'); write(12, 'fmt ')
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, rate, true)
  view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, data.byteLength, true)
  new Int16Array(buffer, 44).set(data)
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }))
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urls = useMemo(() => [makeWav(110, 0), makeWav(98, 1), makeWav(123.47, 2)], [])
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(24)
  const [volume, setVolume] = useState(() => Number(sessionStorage.getItem('yaadein-volume') ?? .38))

  useEffect(() => {
    const audio = new Audio(urls[0]); audio.loop = true; audio.preload = 'metadata'; audio.volume = volume; audioRef.current = audio
    const time = () => setCurrentTime(audio.currentTime), meta = () => setDuration(audio.duration || 24)
    audio.addEventListener('timeupdate', time); audio.addEventListener('loadedmetadata', meta)
    return () => { audio.pause(); urls.forEach(URL.revokeObjectURL) }
  }, []) // one persistent audio instance

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; sessionStorage.setItem('yaadein-volume', String(volume)) }, [volume])
  const toggle = useCallback(async () => {
    const audio = audioRef.current; if (!audio) return
    if (audio.paused) { await audio.play(); setPlaying(true) } else { audio.pause(); setPlaying(false) }
  }, [])
  const playTrack = useCallback(async (next: number) => {
    const audio = audioRef.current; if (!audio) return
    if (next !== trackIndex) {
      audio.src = urls[next]
      audio.loop = true
      setTrackIndex(next)
      setCurrentTime(0)
    }
    await audio.play()
    setPlaying(true)
  }, [trackIndex, urls])
  const select = useCallback(async (next: number) => {
    const audio = audioRef.current; if (!audio) return
    const wasPlaying = !audio.paused; audio.src = urls[next]; audio.loop = true; setTrackIndex(next); setCurrentTime(0)
    if (wasPlaying) { await audio.play(); setPlaying(true) }
  }, [urls])
  const previous = () => select((trackIndex - 1 + tracks.length) % tracks.length)
  const next = () => select((trackIndex + 1) % tracks.length)
  const seek = (value: number) => { if (audioRef.current) { audioRef.current.currentTime = value; setCurrentTime(value) } }
  return { track: tracks[trackIndex], playing, currentTime, duration, volume, setVolume, toggle, playTrack, previous, next, seek }
}
