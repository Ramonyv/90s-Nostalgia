import { motion } from 'framer-motion'
import { ExternalLink, GripHorizontal, Play, Radio } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { spotifyConfig } from '../data/spotify'

type Position = { x: number; y: number }
type SpotifyController = {
  addListener: (event: string, listener: (event?: { data?: { isPaused?: boolean } }) => void) => void
  destroy: () => void
  play: () => void
}
type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: SpotifyController) => void,
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
    __yaadeinSpotifyApi?: SpotifyIframeApi
  }
}

const STORAGE_KEY = 'yaadein-spotify-position'
export const SPOTIFY_PLAY_EVENT = 'yaadein:play-spotify'
let spotifyApiPromise: Promise<SpotifyIframeApi> | undefined

function loadSpotifyApi() {
  if (window.__yaadeinSpotifyApi) return Promise.resolve(window.__yaadeinSpotifyApi)
  if (spotifyApiPromise) return spotifyApiPromise

  spotifyApiPromise = new Promise(resolve => {
    const previousCallback = window.onSpotifyIframeApiReady
    window.onSpotifyIframeApiReady = api => {
      window.__yaadeinSpotifyApi = api
      previousCallback?.(api)
      resolve(api)
    }

    if (!document.querySelector('script[data-yaadein-spotify-api]')) {
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      script.dataset.yaadeinSpotifyApi = 'true'
      document.body.appendChild(script)
    }
  })

  return spotifyApiPromise
}

function defaultPosition(): Position {
  const panelWidth = Math.min(370, window.innerWidth - 28)
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const value = JSON.parse(saved) as Position
      return { x: Math.min(Math.max(14, value.x), window.innerWidth - panelWidth - 14), y: Math.min(Math.max(14, value.y), window.innerHeight - 218) }
    } catch { /* use the default position */ }
  }
  return { x: Math.max(14, Math.round(window.innerWidth * .043)), y: Math.max(14, window.innerHeight - 224) }
}

export function SpotifyRadio() {
  const panel = useRef<HTMLElement>(null)
  const embedHost = useRef<HTMLDivElement>(null)
  const controller = useRef<SpotifyController | null>(null)
  const pendingPlay = useRef(false)
  const dragOffset = useRef<Position | null>(null)
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [dragging, setDragging] = useState(false)
  const [needsTap, setNeedsTap] = useState(true)

  const requestPlayback = () => {
    pendingPlay.current = true
    controller.current?.play()
  }

  useEffect(() => {
    let cancelled = false
    let spotifyController: SpotifyController | null = null
    const onPlayRequest = () => requestPlayback()
    window.addEventListener(SPOTIFY_PLAY_EVENT, onPlayRequest)

    void loadSpotifyApi().then(api => {
      if (cancelled || !embedHost.current) return
      api.createController(embedHost.current, { uri: spotifyConfig.sourceUrl, width: '100%', height: 152 }, createdController => {
        if (cancelled) {
          createdController.destroy()
          return
        }
        spotifyController = createdController
        controller.current = createdController
        createdController.addListener('ready', () => {
          if (pendingPlay.current || sessionStorage.getItem('yaadein-entered') === 'yes') requestPlayback()
        })
        createdController.addListener('playback_started', () => {
          pendingPlay.current = false
          setNeedsTap(false)
        })
      })
    })

    return () => {
      cancelled = true
      window.removeEventListener(SPOTIFY_PLAY_EVENT, onPlayRequest)
      spotifyController?.destroy()
      controller.current = null
    }
  }, [])

  const clamp = (next: Position) => {
    const width = panel.current?.offsetWidth ?? Math.min(370, window.innerWidth - 28)
    const height = panel.current?.offsetHeight ?? 210
    return {
      x: Math.min(Math.max(8, next.x), Math.max(8, window.innerWidth - width - 8)),
      y: Math.min(Math.max(8, next.y), Math.max(8, window.innerHeight - height - 8)),
    }
  }

  const save = (next: Position) => {
    const safe = clamp(next)
    setPosition(safe)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  }

  useEffect(() => {
    const resize = () => save(position)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [position.x, position.y])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragOffset.current = { x: event.clientX - position.x, y: event.clientY - position.y }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) return
    setPosition(clamp({ x: event.clientX - dragOffset.current.x, y: event.clientY - dragOffset.current.y }))
  }
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) return
    const next = { x: event.clientX - dragOffset.current.x, y: event.clientY - dragOffset.current.y }
    dragOffset.current = null
    setDragging(false)
    save(next)
  }
  const moveWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const movement: Record<string, Position> = { ArrowLeft: { x: -12, y: 0 }, ArrowRight: { x: 12, y: 0 }, ArrowUp: { x: 0, y: -12 }, ArrowDown: { x: 0, y: 12 } }
    if (!movement[event.key]) return
    event.preventDefault()
    save({ x: position.x + movement[event.key].x, y: position.y + movement[event.key].y })
  }

  return <motion.aside ref={panel} className={`spotify-radio spotify-radio--persistent ${dragging ? 'is-dragging' : ''}`} style={{ left: position.x, top: position.y }} initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .45 }} aria-label="Persistent Spotify radio">
    <div className="radio-topline radio-drag-handle" role="button" tabIndex={0} aria-label="Drag Spotify player. Use arrow keys to reposition." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={moveWithKeyboard}>
      <div><Radio size={14} /><span>Salon radio · real 80s &amp; 90s</span></div>
      {needsTap
        ? <button className="spotify-play-nudge" type="button" onPointerDown={event => event.stopPropagation()} onClick={requestPlayback}><Play size={10} fill="currentColor" /> Play music</button>
        : <GripHorizontal size={18} aria-hidden="true" />}
    </div>
    <div ref={embedHost} className="spotify-embed" aria-label={`${spotifyConfig.title} on Spotify`} />
    <a href={spotifyConfig.sourceUrl} target="_blank" rel="noreferrer">Open playlist on Spotify <ExternalLink size={10} /></a>
  </motion.aside>
}
