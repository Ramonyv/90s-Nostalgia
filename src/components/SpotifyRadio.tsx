import { motion } from 'framer-motion'
import { ExternalLink, GripHorizontal, Maximize2, Minimize2, Radio } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { getSpotifyEmbedUrl, type SpotifyPlaylist } from '../data/spotify'
import { trackEvent } from '../lib/analytics'

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
const COLLAPSED_KEY = 'yaadein-spotify-collapsed'
const NAV_CLEARANCE = 82
export const SPOTIFY_PLAY_EVENT = 'yaadein:play-spotify'
export const requestSpotifyPlayback = (playlist: SpotifyPlaylist) => {
  if (playlist.available === false || !playlist.uri) return
  window.dispatchEvent(new CustomEvent(SPOTIFY_PLAY_EVENT, { detail: { uri: playlist.uri } }))
}
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

function SpotifyUnavailable({ playlist }: { playlist: SpotifyPlaylist }) {
  const position = defaultPosition()
  return <motion.aside className="spotify-radio spotify-radio--placeholder" style={{ left: position.x, top: position.y }} initial={{ opacity: 0, y: 12, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} aria-label="Scene music information">
    <div className="radio-topline"><div><Radio size={14} /><span>Music card · 1997</span></div></div>
    <div className="spotify-placeholder__body"><small>Late Night · Side A</small><strong>{playlist.title}</strong><p>{playlist.stationLabel}</p></div>
  </motion.aside>
}

function SpotifyPlayer({ playlist }: { playlist: SpotifyPlaylist }) {
  const panel = useRef<HTMLElement>(null)
  const embedHost = useRef<HTMLDivElement>(null)
  const controller = useRef<SpotifyController | null>(null)
  const currentUri = useRef(playlist.uri)
  const pendingUri = useRef<string | null>(null)
  const playbackStarted = useRef(false)
  const activePlaylist = useRef(playlist)
  activePlaylist.current = playlist
  const dragOffset = useRef<Position | null>(null)
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSED_KEY) === 'yes')
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
          }
          createdController.play()
        })
        createdController.addListener('playback_started', () => {
          pendingUri.current = null
          if (!playbackStarted.current) trackEvent('audio_play', { audio_type: 'spotify', playlist: activePlaylist.current.title, source: 'spotify_player' })
          playbackStarted.current = true
        })
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
    const retryPlayback = () => {
      if (!playbackStarted.current) controller.current?.play()
    }
    window.addEventListener('pointerdown', retryPlayback)
    window.addEventListener('keydown', retryPlayback)
    return () => {
      window.removeEventListener('pointerdown', retryPlayback)
      window.removeEventListener('keydown', retryPlayback)
    }
  }, [])

  useEffect(() => {
    playbackStarted.current = false
    if (!controller.current) {
      pendingUri.current = playlist.uri
      return
    }
    if (currentUri.current !== playlist.uri) {
      controller.current.loadEntity(playlist.uri)
      currentUri.current = playlist.uri
    }
    controller.current.play()
  }, [playlist.uri])

  const clamp = useCallback((next: Position) => {
    const width = panel.current?.offsetWidth ?? Math.min(370, window.innerWidth - 28)
    const height = panel.current?.offsetHeight ?? 210
    return {
      x: Math.min(Math.max(8, next.x), Math.max(8, window.innerWidth - width - 8)),
      y: Math.min(Math.max(8, next.y), Math.max(8, window.innerHeight - height - NAV_CLEARANCE)),
    }
  }, [])

  const save = useCallback((next: Position) => {
    const safe = clamp(next)
    setPosition(safe)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  }, [clamp])

  useEffect(() => {
    const resize = () => save(position)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [position, save])

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

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(COLLAPSED_KEY, next ? 'yes' : 'no')
  }

  return <motion.aside layout ref={panel} className={`spotify-radio spotify-radio--persistent${collapsed ? ' is-collapsed' : ''}${dragging ? ' is-dragging' : ''}`} style={{ left: position.x, top: position.y, transformOrigin: 'top left' }} initial={{ opacity: 0, y: 12, scale: .94 }} animate={{ opacity: 1, y: 0, scale: collapsed ? .9 : 1 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }} aria-label="Persistent Spotify radio">
    <div className="radio-topline">
      <div className="radio-drag-handle" role="button" tabIndex={0} aria-label="Drag Spotify player. Use arrow keys to reposition." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={moveWithKeyboard}><Radio size={14} /><span>{playlist.stationLabel} · real 80s &amp; 90s</span><GripHorizontal size={18} aria-hidden="true" /></div>
      <button className="spotify-scale-toggle" type="button" onClick={toggleCollapsed} aria-label={collapsed ? 'Expand Spotify player' : 'Minimize Spotify player'} aria-expanded={!collapsed}>{collapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}</button>
    </div>
    <div className="spotify-radio__body" aria-hidden={collapsed}>
      <div ref={embedHost} className={`spotify-embed ${embedReady ? 'is-ready' : 'is-loading'}`} aria-label={`${playlist.title} on Spotify`}>
        {embedFailed && <iframe src={getSpotifyEmbedUrl(playlist)} title={`${playlist.title} on Spotify`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" />}
      </div>
      <a href={playlist.sourceUrl} target="_blank" rel="noreferrer" tabIndex={collapsed ? -1 : undefined}>Open playlist on Spotify <ExternalLink size={10} /></a>
    </div>
  </motion.aside>
}

export function SpotifyRadio({ playlist }: { playlist: SpotifyPlaylist }) {
  return playlist.available === false ? <SpotifyUnavailable playlist={playlist} /> : <SpotifyPlayer playlist={playlist} />
}
