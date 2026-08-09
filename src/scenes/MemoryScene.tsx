import { motion } from 'framer-motion'
import type { Scene } from '../data/scenes'
import { SceneHotspot } from '../components/SceneHotspot'

export function MemoryScene({ scene }: { scene: Scene }) {
  return <motion.main className={`memory-scene memory-scene--${scene.id}`} style={{ '--accent': scene.accent, '--scene-position': scene.mobilePosition } as React.CSSProperties} initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: .85, ease: [0.22, 1, 0.36, 1] }}>
    {scene.video ? <video className="scene-video" poster={scene.background} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={scene.video} type="video/mp4" /></video> : <picture><source media="(max-width: 760px)" srcSet={scene.mobileBackground} /><img className="scene-image" src={scene.background} alt={`${scene.englishTitle}, an illustrated Indian memory from ${scene.year}`} fetchPriority="high" /></picture>}
    <div className="scene-shade" />
    <div className="sun-dust" aria-hidden="true">{Array.from({ length: 8 }).map((_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
    <section className="scene-copy"><p className="scene-year"><span /> A memory from {scene.year}</p><h1>{scene.title}</h1><p className="scene-description">{scene.description}</p></section>
    <div className="hotspot-layer">{scene.hotspots.map((hotspot, i) => <SceneHotspot hotspot={hotspot} key={i} />)}</div>
    <div className="discover-hint"><span /><p>Move around to<br />find little memories</p></div>
  </motion.main>
}
