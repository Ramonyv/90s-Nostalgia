import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { keepsakes, type Keepsake } from '../data/keepsakes'
import type { Scene } from '../data/scenes'

const STORAGE_PREFIX = 'yaadein-keepsakes-v1:'
const MEMORY_SURFACE_EVENT = 'yaadein:memory-surface'

function readSeen(sceneId: Scene['id']) {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${sceneId}`) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(value => typeof value === 'string') as string[] : []
  } catch {
    return []
  }
}

export function MemoryKeepsake({ scene }: { scene: Scene }) {
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState<Keepsake | null>(null)
  const [revealed, setRevealed] = useState(() => readSeen(scene.id).length)

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  useEffect(() => {
    const closeForOtherSurface = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== 'keepsake') setOpen(false)
    }
    window.addEventListener(MEMORY_SURFACE_EVENT, closeForOtherSurface)
    return () => window.removeEventListener(MEMORY_SURFACE_EVENT, closeForOtherSurface)
  }, [])

  const reveal = () => {
    const collection = keepsakes[scene.id]
    let seen = readSeen(scene.id)
    let available = collection.filter(candidate => !seen.includes(candidate.id))
    if (!available.length) {
      seen = []
      available = collection.filter(candidate => candidate.id !== item?.id)
      if (!available.length) available = collection
    }
    const next = available[Math.floor(Math.random() * available.length)]
    const nextSeen = [...seen, next.id]
    try { localStorage.setItem(`${STORAGE_PREFIX}${scene.id}`, JSON.stringify(nextSeen)) } catch { /* memory still works without persistence */ }
    setItem(next)
    setRevealed(nextSeen.length)
  }

  const openBox = () => {
    window.dispatchEvent(new CustomEvent(MEMORY_SURFACE_EVENT, { detail: 'keepsake' }))
    if (!item) reveal()
    setOpen(true)
  }

  return <div className={`keepsake-dibba${open ? ' is-open' : ''}`} style={{ '--keepsake-accent': scene.accentColor } as React.CSSProperties}>
    <AnimatePresence mode="wait">
      {open && item && <motion.aside className="keepsake-note" key={item.id} aria-live="polite" initial={{ opacity: 0, y: 18, rotate: -1.2, scale: .96 }} animate={{ opacity: 1, y: 0, rotate: -.25, scale: 1 }} exit={{ opacity: 0, y: 8, rotate: .8, scale: .98 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}>
        <button className="keepsake-note__close" type="button" onClick={() => setOpen(false)} aria-label="Close Yaadon ka Dibba"><X size={15} /></button>
        <p className="keepsake-note__eyebrow">आज की मिली हुई याद</p>
        <div className="keepsake-object" aria-hidden="true"><span>{item.mark}</span></div>
        <p className="keepsake-note__object">{item.object}</p>
        <blockquote>“{item.line}”</blockquote>
        <div className="keepsake-note__footer"><span>{Math.min(revealed, keepsakes[scene.id].length)} / {keepsakes[scene.id].length}</span><button type="button" onClick={reveal}>एक और याद <ChevronRight size={12} /></button></div>
      </motion.aside>}
    </AnimatePresence>
    <motion.button className="keepsake-box" type="button" onClick={open ? () => setOpen(false) : openBox} aria-label={open ? 'Close Yaadon ka Dibba' : 'Open Yaadon ka Dibba'} aria-expanded={open} whileHover={{ y: -3 }} whileTap={{ scale: .97 }}>
      <span className="keepsake-box__lid" aria-hidden="true" />
      <span className="keepsake-box__label"><strong>यादों का डिब्बा</strong><small>{open ? 'धीरे से बंद करें' : 'एक याद खोलें'}</small></span>
    </motion.button>
  </div>
}
