import { motion } from 'framer-motion'
import { ExternalLink, GripHorizontal, Radio } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { getSpotifyEmbedUrl, type SpotifyPlaylist } from '../data/spotify'

type Position = { x: number; y: number }
type SpotifyController = {
  addListener: (event: string, listener: () => void) => void
  destroy: () => void
  loadEntity: (uri: string) => void
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
const NAV_CLEARANCE = 82
export const SPOTIFY_PLAY_EVENT = 'yaadein:play-spotify'
export const requestSpotifyPlayback = (playlist: SpotifyPlaylist) => window.dispatchEvent(new CustomEvent(SPOTIFY_PLAY_EVENT, { detail: { uri: playlist.uri } }))
let spotifyApiPromise: Promise<SpotifyIframeApi> | undefined

function loadSpotifyApi() {
  if (window.__yaadeinSpotifyApi) return Promise.resolve(window.__yaadeinSpotifyApi)
  if (spotifyApiPromise) return spotifyApiPromise

  spotifyApiPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      spotifyApiPromise = undefined
      reject(new Error('Spotify iframe API timed out'))
    }, 8000)
    window.onSpotifyIframeApiReady = api => {
      window.clearTimeout(timeout)
      window.__yaadeinSpotifyApi = api
      resolve(api)
    }

    if (!document.querySelector('script[data-yaadein-spotify-api]')) {
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      script.dataset.yaadeinSpotifyApi = 'true'
      script.onerror = () => {
        window.clearTimeout(timeout)
        spotifyApiPromise = undefined
        reject(new Error('Spotify iframe API failed to load'))
      }
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
      return { x: Math.min(Math.max(14, value.x), window.innerWidth - panelWidth - 14), y: Math.min(Math.max(14, value.y), Math.max(14, window.innerHeight - 218 - NAV_CLEARANCE)) }
    } catch { /* use the default position */ }
  }
  return { x: Math.max(14, Math.round(window.innerWidth * .043)), y: window.innerWidth <= 760 ? 144 : Math.max(14, window.innerHeight - 224 - NAV_CLEARANCE) }
}

export function SpotifyRadio({ playlist }: { playlist: SpotifyPlaylist }) {
  const panel = useRef<HTMLElement>(null)
  const embedHost = useRef<HTMLDivElement>(null)
  const controller = useRef<SpotifyController | null>(null)
  const currentUri = useRef(playlist.uri)
  const pendingUri = useRef<string | null>(null)
  const activePlaylist = useRef(playlist)
  activePlaylist.current = playlist
  const dragOffset = useRef<Position | null>(null)
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [dragging, setDragging] = useState(false)
  const [embedReady, setEmbedReady] = useState(false)
  const [embedFailed, setEmbedFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let spotifyController: SpotifyController | null = null
    const requestPlayback = (event: Event) => {
      const requestedUri = (event as CustomEvent<{ uri?: string }>).detail?.uri ?? activePlaylist.current.uri
      if (!controller.current) {
        pendingUri.current = requestedUri
        return
      }
      if (currentUri.current !== requestedUri) {
        controller.current.loadEntity(requestedUri)
        currentUri.current = requestedUri
      }
      controller.current.play()
    }
    window.addEventListener(SPOTIFY_PLAY_EVENT, requestPlayback)

    void loadSpotifyApi().then(api => {
      if (cancelled || !embedHost.current) return
      const initialPlaylist = activePlaylist.current
      currentUri.current = initialPlaylist.uri
      api.createController(embedHost.current, { uri: initialPlaylist.uri, width: '100%', height: 152 }, createdController => {
        if (cancelled) {
          createdController.destroy()
          return
        }
        spotifyController = createdController
        controller.current = createdController
        createdController.addListener('ready', () => {
          setEmbedReady(true)
          if (pendingUri.current) {
            if (currentUri.current !== pendingUri.current) {
              createdController.loadEntity(pendingUri.current)
              currentUri.current = pendingUri.current
            }
            createdController.play()
          }
        })
        createdController.addListener('playback_started', () => { pendingUri.current = null })
      })
    }).catch(() => { if (!cancelled) setEmbedFailed(true) })

    return () => {
      cancelled = true
      window.removeEventListener(SPOTIFY_PLAY_EVENT, requestPlayback)
      spotifyController?.destroy()
      controller.current = null
    }
  }, [])

  useEffect(() => {
    if (!controller.current || playlist.preservePlayback || currentUri.current === playlist.uri) return
    controller.current.loadEntity(playlist.uri)
    currentUri.current = playlist.uri
  }, [playlist.preservePlayback, playlist.uri])

  const clamp = (next: Position) => {
    const width = panel.current?.offsetWidth ?? Math.min(370, window.innerWidth - 28)
    const height = panel.current?.offsetHeight ?? 210
    return {
      x: Math.min(Math.max(8, next.x), Math.max(8, window.innerWidth - width - 8)),
      y: Math.min(Math.max(8, next.y), Math.max(8, window.innerHeight - height - NAV_CLEARANCE)),
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
      <div><Radio size={14} /><span>{playlist.stationLabel} · real 80s &amp; 90s</span></div>
      <GripHorizontal size={18} aria-hidden="true" />
    </div>
    <div ref={embedHost} className={`spotify-embed ${embedReady ? 'is-ready' : 'is-loading'}`} aria-label={`${playlist.title} on Spotify`}>
      {embedFailed && <iframe src={getSpotifyEmbedUrl(playlist)} title={`${playlist.title} on Spotify`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" />}
    </div>
    <a href={playlist.sourceUrl} target="_blank" rel="noreferrer">Open playlist on Spotify <ExternalLink size={10} /></a>
  </motion.aside>
}
