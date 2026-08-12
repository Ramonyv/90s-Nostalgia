import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Scene } from '../data/scenes'
import { SceneHotspot } from '../components/SceneHotspot'

export function MemoryScene({ scene, animated, videoSoundEnabled }: { scene: Scene; animated: boolean; videoSoundEnabled: boolean }) {
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  const showVideo = Boolean(animated && scene.backgroundVideo && !videoFailed && !reducedMotion)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = .2
    video.muted = Boolean(scene.videoMuted || !videoSoundEnabled)
    if (videoSoundEnabled && !scene.videoMuted) void video.play().catch(() => { video.muted = true })
  }, [scene.id, scene.videoMuted, showVideo, videoSoundEnabled])

  return <motion.main className={`memory-scene memory-scene--${scene.id}`} style={{ '--accent': scene.accentColor, '--scene-position': scene.mobilePosition } as React.CSSProperties} initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: .85, ease: [0.22, 1, 0.36, 1] }}>
    {showVideo ? <video ref={videoRef} className="scene-video" poster={scene.fallbackImage} autoPlay muted={Boolean(scene.videoMuted || !videoSoundEnabled)} loop playsInline preload="metadata" aria-hidden="true" onError={() => setVideoFailed(true)}>{scene.mobileVideo && <source media="(max-width: 760px)" src={scene.mobileVideo} type="video/mp4" />}<source src={scene.backgroundVideo} type="video/mp4" /></video> : <picture><source media="(max-width: 760px)" srcSet={scene.mobileBackground} /><img className="scene-image" src={scene.desktopBackground} alt={`${scene.title}, an illustrated Indian memory from ${scene.year}`} fetchPriority="high" /></picture>}
    <div className="scene-shade" />
    {scene.id === 'auto-rickshaw' && <div className="auto-ride-motion" aria-hidden="true"><i /><i /><i /></div>}
    {scene.animation.dust && <div className="sun-dust" aria-hidden="true">{Array.from({ length: scene.animation.dustCount }).map((_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>}
    <section className="scene-copy"><p className="scene-year"><span /> A memory from {scene.year}</p><h1>{scene.hindiTitle}</h1><p className="scene-description">{scene.shortLine}</p></section>
    <div className="hotspot-layer">{scene.hotspots.map((hotspot, i) => <SceneHotspot hotspot={hotspot} key={i} />)}</div>
    <div className="discover-hint"><span /><p>Move around to<br />find little memories</p></div>
  </motion.main>
}
