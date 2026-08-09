import { motion } from 'framer-motion'
import { ExternalLink, GripHorizontal, Radio } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { spotifyConfig, spotifyEmbedUrl } from '../data/spotify'

type Position = { x: number; y: number }

const STORAGE_KEY = 'yaadein-spotify-position'

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
  const dragOffset = useRef<Position | null>(null)
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [dragging, setDragging] = useState(false)

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
      <GripHorizontal size={18} aria-hidden="true" />
    </div>
    <div className="spotify-embed">
      <iframe
        src={spotifyEmbedUrl}
        title={`${spotifyConfig.title} on Spotify`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
      />
    </div>
    <a href={spotifyConfig.sourceUrl} target="_blank" rel="noreferrer">Open playlist on Spotify <ExternalLink size={10} /></a>
  </motion.aside>
}
