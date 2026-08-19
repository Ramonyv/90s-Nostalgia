import { ArrowLeft, ArrowRight, Grid2X2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { sceneAvif, type Scene } from '../data/scenes'
import { trackEvent } from '../lib/analytics'

export function MemoryNavigator({ current, memories, onMore, onSceneSelect }: { current: Scene['id']; memories: Scene[]; onMore: () => void; onSceneSelect: (sceneId: Scene['id']) => void }) {
  const currentIndex = Math.max(0, memories.findIndex(scene => scene.id === current))
  const previous = memories[(currentIndex - 1 + memories.length) % memories.length]
  const next = memories[(currentIndex + 1) % memories.length]
  const dockRef = useRef<HTMLElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  const [preview, setPreview] = useState<{ sceneId: Scene['id']; left: number } | null>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
  }, [current, reducedMotion])
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  const navigate = (scene: Scene, method: string) => {
    setPreview(null)
    trackEvent('memory_explore', { from_scene: current, to_scene: scene.id, method })
    onSceneSelect(scene.id)
  }
  const showPreview = (sceneId: Scene['id'], item: HTMLElement) => {
    const dock = dockRef.current?.getBoundingClientRect(), bounds = item.getBoundingClientRect()
    if (!dock) return
    const center = bounds.left - dock.left + bounds.width / 2
    setPreview({ sceneId, left: Math.min(Math.max(148, center), Math.max(148, dock.width - 148)) })
  }
  const previewScene = memories.find(scene => scene.id === preview?.sceneId)

  return <nav ref={dockRef} className="memory-dock" aria-label="Memory navigation">
    <AnimatePresence>{previewScene && preview && <motion.aside className="memory-dock__peek" style={{ left: preview.left, '--accent': previewScene.accentColor } as React.CSSProperties} key={previewScene.id} aria-hidden="true" initial={{ opacity: 0, y: 10, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 7, scale: .96 }} transition={{ duration: .2, ease: [0.22, 1, 0.36, 1] }}>
      <picture><source srcSet={sceneAvif(previewScene.desktopBackground)} type="image/avif" /><img src={previewScene.desktopBackground} alt="" /></picture>{previewScene.backgroundVideo && !reducedMotion && <video src={previewScene.backgroundVideo} poster={previewScene.desktopBackground} autoPlay loop muted playsInline preload="metadata" />}
      <span><small>{previewScene.year} · Preview</small><strong>{previewScene.selectorTitle ?? previewScene.title}</strong></span>
    </motion.aside>}</AnimatePresence>
    <Link className="memory-dock__arrow" to={previous.slug} onClick={() => navigate(previous, 'previous')} aria-label={`Previous memory: ${previous.title}`}><ArrowLeft size={16} /></Link>
    <div className="memory-dock__viewport"><div className="memory-dock__track">{memories.map(scene => {
      const active = scene.id === current
      const previewing = preview?.sceneId === scene.id
      return <Link ref={active ? activeRef : undefined} className={`memory-dock__item${active ? ' is-active' : ''}${previewing ? ' is-previewing' : ''}`} style={{ '--accent': scene.accentColor } as React.CSSProperties} key={scene.id} to={scene.slug} aria-current={active ? 'page' : undefined} aria-label={`${scene.title}, ${scene.year}`} onClick={() => navigate(scene, 'memory_dock')} onPointerEnter={event => { if (event.pointerType !== 'touch') showPreview(scene.id, event.currentTarget) }} onPointerLeave={() => setPreview(currentPreview => currentPreview?.sceneId === scene.id ? null : currentPreview)} onFocus={event => showPreview(scene.id, event.currentTarget)} onBlur={() => setPreview(currentPreview => currentPreview?.sceneId === scene.id ? null : currentPreview)}>
        <span className="memory-dock__media"><img src={scene.mobileBackground} alt="" loading={active ? 'eager' : 'lazy'} decoding="async" /></span><span className="memory-dock__label"><strong>{scene.navLabel}</strong><small>{scene.year}</small></span>
      </Link>
    })}</div></div>
    <button className="memory-dock__all" type="button" onClick={() => { trackEvent('memory_explore', { scene_id: current, method: 'all_memories' }); onMore() }} aria-label={`Open all memories. Memory ${currentIndex + 1} of ${memories.length}`}><Grid2X2 size={15} /><span>{String(currentIndex + 1).padStart(2, '0')}/{String(memories.length).padStart(2, '0')}</span></button>
    <Link className="memory-dock__arrow" to={next.slug} onClick={() => navigate(next, 'next')} aria-label={`Next memory: ${next.title}`}><ArrowRight size={16} /></Link>
  </nav>
}
